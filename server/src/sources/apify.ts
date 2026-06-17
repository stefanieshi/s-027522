/**
 * sources/apify.ts — 抓取摄入数据源(Apify)。
 * 支撑三个"读取"功能:爆款雷达(发现爆款)/ 真收件箱(拉评论)/ 趋势选题。
 * 全是只读摄入,不自动发送 → 符合"AI 起草、人工把守发布"原则。
 *
 * 需要 env APIFY_TOKEN;actor id 可用 env 覆盖(默认值已用 search-actors 核实)。
 * 调用方式:Apify run-sync-get-dataset-items,直接拿 dataset 数组。
 */
import { xDiscover, xUserLatest, xReplies } from "./x.js";
import { redditDiscover, redditUserLatest, redditComments } from "./reddit.js";
import { cfg } from "../config.js";

type Platform = "x" | "tiktok" | "instagram" | "reddit";

export const NO_TOKEN = "NO_APIFY_TOKEN";

/** X 免费源(twscrape)开关:X_SOURCE=twscrape 时,x 平台抓取走 sidecar。 */
const useTwscrape = () => cfg("X_SOURCE") === "twscrape";
/** Reddit 免费源开关:REDDIT_SOURCE=public 时,reddit 平台走公开 .json(无需 key)。 */
const useRedditPublic = () => cfg("REDDIT_SOURCE") === "public";

const ACTORS = {
  tiktokHashtag: process.env.APIFY_ACTOR_TIKTOK_HASHTAG || "clockworks/tiktok-hashtag-scraper",
  tiktokComments: process.env.APIFY_ACTOR_TIKTOK_COMMENTS || "clockworks/tiktok-comments-scraper",
  xProfile: process.env.APIFY_ACTOR_X_PROFILE || "scraper_one/x-profile-posts-scraper",
  xReplies: process.env.APIFY_ACTOR_X_REPLIES || "scraper_one/x-post-replies-scraper",
  igComments: process.env.APIFY_ACTOR_IG_COMMENTS || "apify/instagram-comment-scraper",
  reddit: process.env.APIFY_ACTOR_REDDIT || "harshmaur/reddit-scraper", // posts+comments+search
  tiktokProfile: process.env.APIFY_ACTOR_TIKTOK_PROFILE || "clockworks/tiktok-scraper",
};

export interface LatestPost {
  postId: string;
  url: string;
  text: string;
  author: string;
  ts?: string;
}

export interface ViralCandidate {
  platform: Platform;
  source: string; // 作者 handle / 名
  raw: string; // 文案/字幕
  metrics: string; // "❤12k·▶120k"
  url: string;
}
export interface PulledComment {
  platform: Platform;
  from: string;
  msg: string;
}

/* ---------- low level ---------- */
async function runActor(actorId: string, input: Record<string, unknown>, maxItems: number): Promise<any[]> {
  const token = cfg("APIFY_TOKEN");
  if (!token) throw new Error(NO_TOKEN);
  const path = actorId.replace("/", "~"); // acts/<user>~<actor>
  const url = `https://api.apify.com/v2/acts/${path}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&maxItems=${maxItems}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`Apify ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } finally {
    clearTimeout(timer);
  }
}

function fmt(n: unknown): string {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "0";
  return v >= 1000 ? (v / 1000).toFixed(v >= 1e4 ? 0 : 1) + "k" : String(v);
}
function pick<T = unknown>(o: any, ...keys: string[]): T | undefined {
  for (const k of keys) if (o && o[k] != null) return o[k];
  return undefined;
}
function handleToUrl(q: string): string {
  const h = q.replace(/^@/, "").trim();
  return `https://x.com/${h}`;
}

/* ---------- 爆款雷达:发现爆款 ---------- */
export async function discoverViral(opts: { platform: Platform; query: string; limit?: number }): Promise<ViralCandidate[]> {
  const limit = Math.min(30, Math.max(1, opts.limit || 8));
  const q = (opts.query || "").trim();
  if (!q) return [];

  if (opts.platform === "x" && useTwscrape()) return xDiscover(q, limit);
  if (opts.platform === "reddit" && useRedditPublic()) return redditDiscover(q, limit);

  if (opts.platform === "tiktok") {
    const items = await runActor(ACTORS.tiktokHashtag, { hashtags: [q.replace(/^#/, "")], resultsPerPage: limit }, limit);
    return items.map((it) => ({
      platform: "tiktok" as const,
      source: "@" + (it?.authorMeta?.name ?? it?.authorMeta?.uniqueId ?? "tiktok"),
      raw: String(pick(it, "text", "desc") || ""),
      metrics: `❤${fmt(pick(it, "diggCount"))}·▶${fmt(pick(it, "playCount"))}`,
      url: String(pick(it, "webVideoUrl", "url") || ""),
    }));
  }
  if (opts.platform === "x") {
    // v1: 按 @handle 拉该账号近期帖(关键词搜索 actor 之后补)
    const items = await runActor(ACTORS.xProfile, { profileUrls: [handleToUrl(q)], resultsLimit: limit }, limit);
    return items.map((it) => ({
      platform: "x" as const,
      source: "@" + (pick<string>(it, "authorUsername") ?? pick<string>(it?.author, "userName") ?? q.replace(/^@/, "")),
      raw: String(pick(it, "text", "fullText", "content") || ""),
      metrics: `❤${fmt(pick(it, "likeCount", "favoriteCount"))}·🔁${fmt(pick(it, "retweetCount"))}`,
      url: String(pick(it, "url", "twitterUrl") || ""),
    }));
  }
  if (opts.platform === "reddit") {
    const items = await runActor(
      ACTORS.reddit,
      { searchTerms: [q], searchPosts: true, searchComments: false, maxPostsCount: limit, maxItems: limit },
      limit
    );
    return items.map((it) => ({
      platform: "reddit" as const,
      source: "u/" + (pick<string>(it, "username", "author") ?? "reddit"),
      raw: [pick(it, "title"), pick(it, "body", "text", "selftext")].filter(Boolean).join("\n").trim(),
      metrics: `⬆${fmt(pick(it, "upVotes", "score", "upvotes"))}·💬${fmt(pick(it, "numberOfComments", "numComments", "commentCount"))}`,
      url: String(pick(it, "url", "link", "postUrl") || ""),
    }));
  }
  // instagram 发现:留待补对应 actor
  return [];
}

/* ---------- 真收件箱:拉评论/回复 ---------- */
export async function pullComments(opts: { platform: Platform; postUrls: string[]; limit?: number }): Promise<PulledComment[]> {
  const limit = Math.min(100, Math.max(1, opts.limit || 20));
  const urls = (opts.postUrls || []).map((u) => u.trim()).filter(Boolean);
  if (!urls.length) return [];

  if (opts.platform === "x" && useTwscrape()) return xReplies(urls, limit);
  if (opts.platform === "reddit" && useRedditPublic()) return redditComments(urls, limit);

  if (opts.platform === "instagram") {
    const items = await runActor(ACTORS.igComments, { directUrls: urls, resultsLimit: limit }, limit);
    return items.map((it) => ({
      platform: "instagram" as const,
      from: String(pick(it, "ownerUsername", "username") || "ig_user"),
      msg: String(pick(it, "text") || ""),
    }));
  }
  if (opts.platform === "x") {
    const items = await runActor(ACTORS.xReplies, { postUrls: urls, resultsLimit: limit }, limit);
    return items.map((it) => ({
      platform: "x" as const,
      from: "@" + (pick<string>(it, "authorUsername") ?? pick<string>(it?.author, "userName") ?? "x_user"),
      msg: String(pick(it, "text", "fullText") || ""),
    }));
  }
  if (opts.platform === "tiktok") {
    const items = await runActor(ACTORS.tiktokComments, { postURLs: urls, commentsPerPost: limit }, limit);
    return items.map((it) => ({
      platform: "tiktok" as const,
      from: "@" + (pick<string>(it, "uniqueId", "username", "userName") ?? it?.user?.uniqueId ?? "tiktok_user"),
      msg: String(pick(it, "text", "comment") || ""),
    }));
  }
  if (opts.platform === "reddit") {
    const items = await runActor(
      ACTORS.reddit,
      { startUrls: urls.map((url) => ({ url })), searchPosts: false, crawlCommentsPerPost: true, maxCommentsPerPost: limit, maxCommentsCount: limit, maxPostsCount: urls.length },
      limit
    );
    return items
      .map((it) => ({
        platform: "reddit" as const,
        from: "u/" + (pick<string>(it, "username", "author") ?? "reddit_user"),
        msg: String(pick(it, "body", "comment", "text") || ""),
      }))
      .filter((c) => c.msg);
  }
  return [];
}

/* ---------- 趋势选题:从发现结果抽可复用选题 ---------- */
export async function fetchTrends(opts: { platform: Platform; query: string; limit?: number }): Promise<string[]> {
  const cands = await discoverViral({ ...opts, limit: opts.limit || 12 });
  const seen = new Set<string>();
  const topics: string[] = [];
  for (const c of cands) {
    const first = (c.raw || "").split(/\n/)[0].trim().slice(0, 60);
    const key = first.toLowerCase();
    if (first && !seen.has(key)) {
      seen.add(key);
      topics.push(first);
    }
    if (topics.length >= 10) break;
  }
  return topics;
}

/* ---------- 大V监控:抓某账号最新帖(newest first) ---------- */
export async function fetchAccountLatest(opts: { platform: Platform; handle: string; limit?: number }): Promise<LatestPost[]> {
  const limit = Math.min(20, Math.max(1, opts.limit || 5));
  const h = opts.handle.replace(/^@/, "").replace(/^u\//, "").trim();
  if (!h) return [];

  if (opts.platform === "x" && useTwscrape()) return xUserLatest(h, limit);
  if (opts.platform === "reddit" && useRedditPublic()) return redditUserLatest(h, limit);

  if (opts.platform === "x") {
    const items = await runActor(ACTORS.xProfile, { profileUrls: [`https://x.com/${h}`], resultsLimit: limit }, limit);
    return items.map((it) => ({
      postId: String(pick(it, "id", "tweetId", "id_str") || pick(it, "url") || ""),
      url: String(pick(it, "url", "twitterUrl") || ""),
      text: String(pick(it, "text", "fullText", "content") || ""),
      author: "@" + (pick<string>(it, "authorUsername") ?? pick<string>(it?.author, "userName") ?? h),
      ts: pick<string>(it, "createdAt", "created_at"),
    }));
  }
  if (opts.platform === "tiktok") {
    const items = await runActor(ACTORS.tiktokProfile, { profiles: [h], resultsPerPage: limit, shouldDownloadVideos: false }, limit);
    return items.map((it) => ({
      postId: String(pick(it, "id") || pick(it, "webVideoUrl") || ""),
      url: String(pick(it, "webVideoUrl", "url") || ""),
      text: String(pick(it, "text", "desc") || ""),
      author: "@" + (it?.authorMeta?.name ?? h),
      ts: pick<string>(it, "createTimeISO", "createTime"),
    }));
  }
  if (opts.platform === "reddit") {
    const items = await runActor(
      ACTORS.reddit,
      { startUrls: [{ url: `https://www.reddit.com/user/${h}/submitted/` }], searchPosts: true, searchComments: false, maxPostsCount: limit },
      limit
    );
    return items.map((it) => ({
      postId: String(pick(it, "id", "postId") || pick(it, "url") || ""),
      url: String(pick(it, "url", "link", "postUrl") || ""),
      text: [pick(it, "title"), pick(it, "body", "text")].filter(Boolean).join("\n").trim(),
      author: "u/" + (pick<string>(it, "username", "author") ?? h),
      ts: pick<string>(it, "createdAt", "created"),
    })).filter((p) => p.url || p.postId);
  }
  return [];
}
