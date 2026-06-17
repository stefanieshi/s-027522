/**
 * monitor.ts — 追踪雷达监控器。
 *  · 大V watchlist:抓最新帖,发现新帖 → LLM 草拟回复 → 存 mentions(drafted, notified=0)
 *  · 对标/niche:周期 discoverViral → upsert inspiration(灵感/趋势源)
 * 回复永远人工 approve 后发(不在此自动发)。
 */
import cron from "node-cron";
import { fetchAccountLatest, discoverViral, NO_TOKEN } from "./sources/apify.js";
import { draftReply } from "./llm.js";
import {
  listActiveTracked,
  updateTrackedCheck,
  insertMention,
  upsertInspiration,
  type TrackedRow,
} from "./db.js";

let running = false;

async function checkBigV(t: TrackedRow): Promise<number> {
  const latest = await fetchAccountLatest({ platform: t.platform as any, handle: t.handle, limit: 5 });
  if (!latest.length) {
    updateTrackedCheck(t.id, t.last_post_id);
    return 0;
  }
  const newestId = latest[0].postId;
  // 首次见到该账号:只记录基线,不回灌历史
  if (!t.last_post_id) {
    updateTrackedCheck(t.id, newestId);
    return 0;
  }
  // 收集 last_post_id 之后的新帖(按返回顺序到遇到已知为止)
  const fresh: typeof latest = [];
  for (const p of latest) {
    if (p.postId === t.last_post_id) break;
    fresh.push(p);
  }
  let created = 0;
  for (const p of fresh.reverse()) {
    const d = await draftReply({ postText: p.text, author: p.author, platform: t.platform, guideline: t.reply_guideline || undefined });
    insertMention({
      trackedId: t.id,
      platform: t.platform,
      postId: p.postId,
      postUrl: p.url,
      postText: p.text,
      author: p.author,
      draftReply: d.reply,
      flagged: d.flagged,
    });
    created++;
  }
  updateTrackedCheck(t.id, newestId);
  return created;
}

async function scanInspiration(t: TrackedRow): Promise<void> {
  const query = t.kind === "competitor" ? t.handle : t.niche || t.handle;
  const cands = await discoverViral({ platform: t.platform as any, query, limit: 8 });
  cands.forEach((c, i) =>
    upsertInspiration({
      platform: c.platform,
      source: c.source,
      raw: c.raw,
      metrics: c.metrics,
      url: c.url,
      topic: (c.raw || "").split(/\n/)[0].slice(0, 60),
      score: 100 - i,
    })
  );
}

/** demo:无 Apify key 时,为每个大V合成一条"新帖"走完草拟管线(便于演示/验证)。 */
async function demoMention(t: TrackedRow): Promise<void> {
  const post = {
    postText: `(demo) ${t.handle} 刚发了条新帖:大多数人做增长都把顺序搞反了——先有分发,再谈内容。你怎么看?`,
    author: "@" + t.handle,
    platform: t.platform,
  };
  const d = await draftReply({ postText: post.postText, author: post.author, platform: t.platform, guideline: t.reply_guideline || undefined });
  insertMention({
    trackedId: t.id,
    platform: t.platform,
    postId: "demo-" + Date.now(),
    postUrl: t.platform === "x" ? `https://x.com/${t.handle.replace(/^@/, "")}` : "",
    postText: post.postText,
    author: post.author,
    draftReply: d.reply,
    flagged: d.flagged,
  });
}

export async function runOnce(demo = false): Promise<{ bigv: number; mentions: number; inspiration: number; skipped?: string }> {
  const bigvs = listActiveTracked("bigv");
  const competitors = listActiveTracked("competitor");
  let mentions = 0;
  let inspiration = 0;
  let skipped: string | undefined;
  for (const t of bigvs) {
    try {
      if (demo) {
        await demoMention(t);
        mentions++;
      } else {
        mentions += await checkBigV(t);
      }
    } catch (e: any) {
      if (e?.message === NO_TOKEN) skipped = NO_TOKEN;
      else console.warn("[monitor] bigv", t.handle, e?.message);
    }
  }
  for (const t of competitors) {
    try {
      await scanInspiration(t);
      inspiration++;
    } catch (e: any) {
      if (e?.message === NO_TOKEN) skipped = NO_TOKEN;
      else console.warn("[monitor] competitor", t.handle, e?.message);
    }
  }
  if (mentions) console.log(`[monitor] drafted ${mentions} new big-V reply task(s)`);
  return { bigv: bigvs.length, mentions, inspiration, skipped };
}

export function startMonitor(): void {
  const min = Math.min(59, Math.max(1, Number(process.env.MONITOR_INTERVAL_MIN) || 3));
  cron.schedule(`*/${min} * * * *`, () => {
    if (running) return;
    running = true;
    runOnce()
      .catch((e) => console.error("[monitor] error", e))
      .finally(() => (running = false));
  });
  console.log(`[monitor] running — big-V + niche radar every ${min}m`);
}
