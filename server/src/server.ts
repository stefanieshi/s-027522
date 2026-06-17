/**
 * server.ts — Vibe Marketer 后端入口
 * 暴露接口:
 *   POST /api/publish            { input: PublishInput, channel: Channel }
 *   GET  /api/analytics/:postId  → zernio 真实互动数据
 *   GET  /health
 *
 * 跑起来:npm run dev   (默认 :8787)
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { publish, zernioAnalytics, zernioListAccounts, type PublishInput, type Channel } from './publishers.js';
import { startScheduler } from './scheduler.js';
import { startAnalyticsRefresher, refreshAll } from './analytics.js';
import { insertScheduled, listScheduled, cancelScheduled, trackMetric, getMetrics, type SchedStatus, type MetricRow } from './db.js';
import { discoverViral, pullComments, fetchTrends, NO_TOKEN } from './sources/apify.js';
import { xAccountsList, xAccountAdd, xAccountsLogin, xAccountDelete } from './sources/x.js';
import { startMonitor, runOnce } from './monitor.js';
import {
  addTracked, listTracked, deleteTracked, listMentions, setMentionStatus, markMentionNotified,
  listInspiration, type TrackKind, type MentionStatus, type TrackedRow, type MentionRow, type InspirationRow,
} from './db.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

/* 集成状态(只返回布尔/枚举,绝不含密钥)——前端据此判断数据源是否接好、空白页该提示啥 */
app.get('/api/status', (_req, res) => {
  res.json({
    apifyToken: !!process.env.APIFY_TOKEN,
    xSource: process.env.X_SOURCE || 'apify',
    redditSource: process.env.REDDIT_SOURCE || 'apify',
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    zernio: !!process.env.ZERNIO_API_KEY,
  });
});

app.post('/api/publish', async (req, res) => {
  const { input, channel } = req.body as { input: PublishInput; channel: Channel };
  if (!input?.text || !input?.platform || !input?.kind) {
    return res.status(400).json({ status: 'error', error: '缺少 input.text / platform / kind' });
  }
  const result = await publish(input, channel || 'manual');
  res.json(result);
});

/* ===== 排期帖:持久化到 SQLite,由 scheduler 到点真发 ===== */
app.post('/api/schedule', (req, res) => {
  const { input, channel, scheduledFor } = req.body as {
    input: PublishInput;
    channel?: Channel;
    scheduledFor?: string;
  };
  const when = scheduledFor || input?.scheduledFor;
  if (!input?.text || !input?.platform || !input?.kind) {
    return res.status(400).json({ status: 'error', error: '缺少 input.text / platform / kind' });
  }
  if (!when || Number.isNaN(Date.parse(when))) {
    return res.status(400).json({ status: 'error', error: 'scheduledFor 必须是合法 ISO 时间' });
  }
  const row = insertScheduled(input, channel || 'zernio', when);
  res.json({ status: 'scheduled', id: row.id, scheduledFor: row.scheduled_for });
});

app.get('/api/schedule', (req, res) => {
  const status = req.query.status as SchedStatus | undefined;
  res.json(listScheduled(status));
});

app.delete('/api/schedule/:id', (req, res) => {
  const ok = cancelScheduled(req.params.id);
  res.status(ok ? 200 : 404).json({ status: ok ? 'canceled' : 'not_found' });
});

app.get('/api/analytics/:postId', async (req, res) => {
  try {
    res.json(await zernioAnalytics(req.params.postId));
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

/* 列出 zernio 已连接账号:前端据此把"内部账号 → zernio accountId"对应起来 */
app.get('/api/zernio/accounts', async (_req, res) => {
  try {
    res.json(await zernioListAccounts());
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

/* ===== 真实互动数据(post_metrics) ===== */
const toMetricDTO = (r: MetricRow) => ({
  externalPostId: r.external_post_id,
  accountId: r.account_id,
  platform: r.platform,
  views: r.views,
  likes: r.likes,
  engagementRate: r.engagement_rate,
  status: r.status,
  fetchedAt: r.fetched_at,
});

app.post('/api/metrics/track', (req, res) => {
  const { externalPostId, accountId, platform } = req.body as { externalPostId?: string; accountId?: string; platform?: string };
  if (!externalPostId) return res.status(400).json({ status: 'error', error: '缺少 externalPostId' });
  trackMetric(externalPostId, accountId, platform);
  res.json({ status: 'ok' });
});

app.get('/api/metrics', (req, res) => {
  const ids = String(req.query.ids || '').split(',').map((s) => s.trim()).filter(Boolean);
  res.json(getMetrics(ids).map(toMetricDTO));
});

app.post('/api/metrics/refresh', async (_req, res) => {
  res.json(await refreshAll());
});

/* ===== 抓取摄入(Apify):爆款雷达 / 真收件箱 / 趋势选题 ===== */
function apifyError(res: express.Response, e: any) {
  if (e?.message === NO_TOKEN) return res.status(400).json({ error: NO_TOKEN });
  return res.status(500).json({ error: e?.message || String(e) });
}

app.post('/api/discover', async (req, res) => {
  const { platform, query, limit } = req.body as { platform: string; query: string; limit?: number };
  if (!platform || !query) return res.status(400).json({ error: '缺少 platform / query' });
  try {
    res.json(await discoverViral({ platform: platform as any, query, limit }));
  } catch (e) {
    apifyError(res, e);
  }
});

app.post('/api/inbox/pull', async (req, res) => {
  const { platform, postUrls, limit } = req.body as { platform: string; postUrls: string[]; limit?: number };
  if (!platform || !postUrls?.length) return res.status(400).json({ error: '缺少 platform / postUrls' });
  try {
    res.json(await pullComments({ platform: platform as any, postUrls, limit }));
  } catch (e) {
    apifyError(res, e);
  }
});

app.post('/api/trends', async (req, res) => {
  const { platform, query, limit } = req.body as { platform: string; query: string; limit?: number };
  if (!platform || !query) return res.status(400).json({ error: '缺少 platform / query' });
  try {
    res.json(await fetchTrends({ platform: platform as any, query, limit }));
  } catch (e) {
    apifyError(res, e);
  }
});

/* ===== 追踪雷达:对标/大V 账号 + 大V回复待办 + niche 灵感 ===== */
const trackedDTO = (r: TrackedRow) => ({
  id: r.id, platform: r.platform, handle: r.handle, kind: r.kind, niche: r.niche,
  replyAccountId: r.reply_account_id, guideline: r.reply_guideline, lastChecked: r.last_checked, active: !!r.active,
});
const mentionDTO = (r: MentionRow) => ({
  id: r.id, platform: r.platform, postUrl: r.post_url, postText: r.post_text, author: r.author,
  reply: r.draft_reply, flagged: !!r.flagged, status: r.status, createdAt: r.created_at,
});
const inspirationDTO = (r: InspirationRow) => ({
  platform: r.platform, source: r.source, raw: r.raw, metrics: r.metrics, url: r.url, topic: r.topic, score: r.score,
});

app.get('/api/tracked', (req, res) => {
  res.json(listTracked(req.query.kind as TrackKind | undefined).map(trackedDTO));
});
app.post('/api/tracked/import', (req, res) => {
  const { platform, kind, handles, niche, replyAccountId, guideline } = req.body as {
    platform: string; kind: TrackKind; handles: string[]; niche?: string; replyAccountId?: string; guideline?: string;
  };
  if (!platform || !kind || !handles?.length) return res.status(400).json({ error: '缺少 platform / kind / handles' });
  let n = 0;
  for (const raw of handles) {
    const handle = String(raw).trim();
    if (!handle) continue;
    addTracked({ platform, handle, kind, niche, replyAccountId, guideline });
    n++;
  }
  res.json({ status: 'ok', added: n });
});
app.delete('/api/tracked/:id', (req, res) => {
  const ok = deleteTracked(req.params.id);
  res.status(ok ? 200 : 404).json({ status: ok ? 'ok' : 'not_found' });
});

app.get('/api/mentions', (req, res) => {
  res.json(listMentions(req.query.status as MentionStatus | undefined).map(mentionDTO));
});
app.post('/api/mentions/:id/:action', (req, res) => {
  const map: Record<string, MentionStatus> = { approve: 'approved', sent: 'sent', ignore: 'ignored' };
  const status = map[req.params.action];
  if (!status) return res.status(400).json({ error: '未知操作' });
  res.status(setMentionStatus(req.params.id, status) ? 200 : 404).json({ status });
});
app.post('/api/mentions/mark-notified', (req, res) => {
  markMentionNotified((req.body?.ids as string[]) || []);
  res.json({ status: 'ok' });
});

app.get('/api/inspiration', (req, res) => {
  res.json(listInspiration(req.query.platform as string | undefined).map(inspirationDTO));
});
app.post('/api/monitor/run', async (req, res) => {
  try {
    res.json(await runOnce(!!(req.body && req.body.demo)));
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

/* ===== X 抓取小号(twscrape)账号管理:代理到本机 sidecar ===== */
app.get('/api/twscrape/accounts', async (_req, res) => {
  try {
    res.json(await xAccountsList());
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});
app.post('/api/twscrape/accounts/add', async (req, res) => {
  const { username, password, email, emailPassword } = req.body as {
    username?: string; password?: string; email?: string; emailPassword?: string;
  };
  if (!username || !password || !email || !emailPassword) {
    return res.status(400).json({ error: '缺少 用户名 / 密码 / 邮箱 / 邮箱密码' });
  }
  try {
    res.json(await xAccountAdd({ username, password, email, email_password: emailPassword }));
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});
app.post('/api/twscrape/accounts/login', async (_req, res) => {
  try {
    res.json(await xAccountsLogin());
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});
app.delete('/api/twscrape/accounts/:username', async (req, res) => {
  try {
    res.json(await xAccountDelete(req.params.username));
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`Vibe Marketer backend listening on :${port}`);
  startScheduler();
  startAnalyticsRefresher();
  startMonitor();
});
