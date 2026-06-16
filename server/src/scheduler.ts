/**
 * scheduler.ts — 常驻调度器(BUILD 指南第 ④ 步)
 * 用 node-cron 每分钟扫一遍 status=scheduled 且 scheduledFor<=now 的帖,
 * 调 publish() 用 zernio 渠道发出,成功后更新状态并存 externalPostId。
 *
 * 这里用一个内存版 store 占位,接 SQLite(better-sqlite3)后把
 * `loadDueScheduled` / `markPublished` / `markFailed` 换成真实 DB 读写即可。
 */
import cron from 'node-cron';
import { publish, type PublishInput } from './publishers.js';

export interface ScheduledPost {
  id: string;
  input: PublishInput;
  scheduledFor: string; // ISO
  status: 'scheduled' | 'published' | 'error';
  externalPostId?: string;
  error?: string;
}

/* ----- 占位内存 store(换成 db.ts 的 SQLite 实现)----- */
const queue: ScheduledPost[] = [];

export function enqueue(post: ScheduledPost) {
  queue.push(post);
}

function loadDueScheduled(now: number): ScheduledPost[] {
  return queue.filter((p) => p.status === 'scheduled' && new Date(p.scheduledFor).getTime() <= now);
}

function markPublished(id: string, externalPostId?: string) {
  const p = queue.find((x) => x.id === id);
  if (p) {
    p.status = 'published';
    p.externalPostId = externalPostId;
  }
}

function markFailed(id: string, error: string) {
  const p = queue.find((x) => x.id === id);
  if (p) {
    p.status = 'error';
    p.error = error;
  }
}

async function tick() {
  const due = loadDueScheduled(Date.now());
  for (const post of due) {
    const result = await publish(post.input, 'zernio');
    if (result.status === 'published' || result.status === 'scheduled') {
      markPublished(post.id, result.externalPostId);
      console.log(`[scheduler] published ${post.id} → ${result.externalPostId ?? '(no id)'}`);
    } else {
      markFailed(post.id, result.error || 'unknown');
      console.warn(`[scheduler] failed ${post.id}: ${result.error}`);
    }
  }
}

export function startScheduler() {
  cron.schedule('* * * * *', () => {
    tick().catch((e) => console.error('[scheduler] tick error', e));
  });
  console.log('[scheduler] running — scanning scheduled posts every minute');
}
