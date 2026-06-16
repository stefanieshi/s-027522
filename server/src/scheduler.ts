/**
 * scheduler.ts — 常驻调度器(BUILD 指南第 ④ 步)
 * node-cron 每分钟扫 DB 里 status='scheduled' 且 scheduled_for<=now 的帖,
 * 调 publish() 用该帖记录的渠道(默认 zernio)发出,成功后写回 status +
 * external_post_id,失败写回 error。
 */
import cron from "node-cron";
import { publish } from "./publishers.js";
import { getDueScheduled, markPublished, markFailed, rowToInput } from "./db.js";

let running = false; // guard against overlapping ticks

async function tick() {
  if (running) return;
  running = true;
  try {
    const due = getDueScheduled(new Date().toISOString());
    for (const row of due) {
      const result = await publish(rowToInput(row), row.channel);
      if (result.status === "published" || result.status === "scheduled" || result.status === "manual") {
        markPublished(row.id, result.externalPostId);
        console.log(`[scheduler] published ${row.id} (${row.platform}) → ${result.externalPostId ?? result.status}`);
      } else {
        markFailed(row.id, result.error || "unknown");
        console.warn(`[scheduler] failed ${row.id}: ${result.error}`);
      }
    }
  } finally {
    running = false;
  }
}

export function startScheduler() {
  cron.schedule("* * * * *", () => {
    tick().catch((e) => console.error("[scheduler] tick error", e));
  });
  console.log("[scheduler] running — scanning DB for due scheduled posts every minute");
}
