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
import { publish, zernioAnalytics, type PublishInput, type Channel } from './publishers.js';
import { startScheduler } from './scheduler.js';
import { startAnalyticsRefresher, refreshAll } from './analytics.js';
import { insertScheduled, listScheduled, cancelScheduled, trackMetric, getMetrics, type SchedStatus, type MetricRow } from './db.js';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({ ok: true }));

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

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`Vibe Marketer backend listening on :${port}`);
  startScheduler();
  startAnalyticsRefresher();
});
