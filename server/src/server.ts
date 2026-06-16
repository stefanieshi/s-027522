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

app.get('/api/analytics/:postId', async (req, res) => {
  try {
    res.json(await zernioAnalytics(req.params.postId));
  } catch (e: any) {
    res.status(500).json({ error: e?.message || String(e) });
  }
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`Vibe Marketer backend listening on :${port}`);
  startScheduler();
});
