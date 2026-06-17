/**
 * analytics.ts — 真实互动数据回收(BUILD 指南第 ⑤ 步)
 * 定时调 zernioAnalytics(externalPostId) 拉 views/likes/engagementRate,
 * 写回 post_metrics 表,供前端「账号分析」看板用真实数据替代手动打分。
 */
import cron from "node-cron";
import { zernioAnalytics } from "./publishers.js";
import { listTrackedMetricIds, upsertMetricResult, markMetricError } from "./db.js";

let running = false;

export async function refreshAll(): Promise<{ ok: number; err: number }> {
  const ids = listTrackedMetricIds();
  let ok = 0,
    err = 0;
  for (const id of ids) {
    try {
      const a: any = await zernioAnalytics(id);
      upsertMetricResult(id, {
        views: a?.views,
        likes: a?.likes,
        engagementRate: a?.engagementRate ?? a?.engagement_rate,
      });
      ok++;
    } catch (e: any) {
      markMetricError(id, e?.message || String(e));
      err++;
    }
  }
  if (ids.length) console.log(`[analytics] refreshed ${ok}/${ids.length} (err ${err})`);
  return { ok, err };
}

export function startAnalyticsRefresher(): void {
  const min = Math.min(59, Math.max(1, Number(process.env.ANALYTICS_REFRESH_MIN) || 10));
  cron.schedule(`*/${min} * * * *`, () => {
    if (running) return;
    running = true;
    refreshAll()
      .catch((e) => console.error("[analytics] refresh error", e))
      .finally(() => (running = false));
  });
  console.log(`[analytics] refresher running every ${min}m`);
}
