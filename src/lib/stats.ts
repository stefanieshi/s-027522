import type { Draft, Platform, Swipe } from "./types";

/** 无真实 metrics 时,每条已发帖的触达估算系数(标注"估算")。 */
const REACH_EST: Record<Platform, number> = { x: 300, tiktok: 1200, instagram: 500, reddit: 400 };

const DAY = 864e5;

export interface WeeklyStats {
  published: number;
  reach: number;
  reachEstimated: boolean; // 是否含估算(没有真实 views)
  likes: number;
  engagementRate: number | null;
  scheduled: number;
}

/** 近 7 天产出 + 触达/互动(有 draft.metrics 用真实,否则估算)。 */
export function weeklyStats(drafts: Draft[]): WeeklyStats {
  const since = Date.now() - 7 * DAY;
  const pub = drafts.filter((d) => d.status === "published" && (d.publishedAt || 0) >= since);
  let reach = 0;
  let likes = 0;
  let estimated = false;
  const engs: number[] = [];
  for (const d of pub) {
    if (d.metrics?.views != null) reach += d.metrics.views;
    else {
      reach += REACH_EST[d.platform] || 300;
      estimated = true;
    }
    if (d.metrics?.likes != null) likes += d.metrics.likes;
    if (d.metrics?.engagementRate != null) engs.push(d.metrics.engagementRate);
  }
  return {
    published: pub.length,
    reach,
    reachEstimated: estimated,
    likes,
    engagementRate: engs.length ? engs.reduce((a, b) => a + b, 0) / engs.length : null,
    scheduled: drafts.filter((d) => d.status === "approved" && d.scheduledAt).length,
  };
}

/** 连续有发帖的天数(含今天;今天还没发则从昨天起算)。 */
export function streak(drafts: Draft[]): number {
  const days = new Set(drafts.filter((d) => d.publishedAt).map((d) => new Date(d.publishedAt!).toDateString()));
  if (!days.size) return 0;
  let n = 0;
  const cursor = new Date();
  // 今天没发不清零:从今天往回数,允许今天空着
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toDateString())) {
    n++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

export interface Flywheel {
  ideas: number;
  drafted: number;
  published: number;
  tagged: number;
  wins: number;
}

export function flywheel(swipes: Swipe[], drafts: Draft[]): Flywheel {
  const published = drafts.filter((d) => d.status === "published");
  return {
    ideas: swipes.length,
    drafted: drafts.length,
    published: published.length,
    tagged: published.filter((d) => d.result).length,
    wins: published.filter((d) => d.result?.tier === "win").length,
  };
}

export function fmtNum(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n >= 1e4 ? 0 : 1) + "k";
  return String(Math.round(n));
}
