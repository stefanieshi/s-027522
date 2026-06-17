/**
 * reddit.ts — 免费 Reddit 数据源(Reddit 公开 .json 端点,无需 API key)。
 * REDDIT_SOURCE=public 时,apify.ts 把 reddit 平台抓取委派到这里。只读。
 * 归一化成和 apify.ts 一致的形状,调用点(server/monitor)无感。
 *
 * 用 Reddit 公开只读 JSON(给任意 URL 加 .json):search / 子版块榜 / 用户提交 / 帖子评论。
 * 免费、官方、合法(非商用);带描述性 User-Agent 降被限概率。高频请用官方 OAuth 提限额。
 */
import type { ViralCandidate, PulledComment, LatestPost } from "./apify.js";
import { cfg } from "../config.js";

const UA = () => cfg("REDDIT_USER_AGENT") || "vibe-marketer/1.0 (read-only research)";

async function getJSON<T>(url: string): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30_000);
  try {
    const res = await fetch(url, { headers: { "user-agent": UA(), accept: "application/json" }, signal: ctrl.signal });
    if (res.status === 429) throw new Error("Reddit 限流(429),稍后再试或配 REDDIT_USER_AGENT / 官方 OAuth 提限额");
    if (!res.ok) throw new Error(`Reddit ${res.status}: ${(await res.text().catch(() => "")).slice(0, 160)}`);
    return (await res.json()) as T;
  } catch (e: any) {
    if (e?.name === "AbortError" || e instanceof TypeError) throw new Error("Reddit 公开接口不可达(检查网络/出站策略)");
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

function fmt(n: unknown): string {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "0";
  return v >= 1000 ? (v / 1000).toFixed(v >= 1e4 ? 0 : 1) + "k" : String(v);
}
const enc = encodeURIComponent;
const threadUrl = (permalink?: string, fallback?: string) =>
  permalink ? "https://www.reddit.com" + permalink : String(fallback || "");

function postToCandidate(d: any): ViralCandidate {
  return {
    platform: "reddit",
    source: "u/" + (d?.author || "reddit"),
    raw: [d?.title, d?.selftext].filter(Boolean).join("\n").trim(),
    metrics: `⬆${fmt(d?.score ?? d?.ups)}·💬${fmt(d?.num_comments)}`,
    url: threadUrl(d?.permalink, d?.url),
  };
}

/** 发现爆款:r/子版块 → 该版块周榜;否则全站关键词搜索(按 top/week)。 */
export async function redditDiscover(query: string, limit: number): Promise<ViralCandidate[]> {
  const q = query.trim();
  if (!q) return [];
  const url = /^r\//i.test(q)
    ? `https://www.reddit.com/${q.replace(/^\/+/, "")}/top.json?t=week&limit=${limit}&raw_json=1`
    : `https://www.reddit.com/search.json?q=${enc(q)}&sort=top&t=week&limit=${limit}&raw_json=1`;
  const data = await getJSON<any>(url);
  const children = data?.data?.children || [];
  return children.filter((c: any) => c?.kind === "t3").map((c: any) => postToCandidate(c.data));
}

/** 大V监控:某用户最新提交的帖(newest first)。 */
export async function redditUserLatest(handle: string, limit: number): Promise<LatestPost[]> {
  const h = handle.replace(/^u\//i, "").replace(/^@/, "").trim();
  const data = await getJSON<any>(`https://www.reddit.com/user/${enc(h)}/submitted.json?sort=new&limit=${limit}&raw_json=1`);
  const children = data?.data?.children || [];
  return children
    .filter((c: any) => c?.kind === "t3")
    .map((c: any) => {
      const d = c.data;
      return {
        postId: String(d?.name || d?.id || ""),
        url: threadUrl(d?.permalink, d?.url),
        text: [d?.title, d?.selftext].filter(Boolean).join("\n").trim(),
        author: "u/" + (d?.author || h),
        ts: d?.created_utc ? new Date(d.created_utc * 1000).toISOString() : undefined,
      };
    });
}

const DEAD = new Set(["[deleted]", "[removed]"]);
function collectComments(children: any[], out: PulledComment[], limit: number) {
  for (const c of children) {
    if (out.length >= limit) return;
    if (c?.kind !== "t1") continue;
    const d = c.data;
    const msg = String(d?.body || "").trim();
    if (msg && !DEAD.has(msg)) out.push({ platform: "reddit", from: "u/" + (d?.author || "reddit_user"), msg });
    const replies = d?.replies?.data?.children;
    if (Array.isArray(replies)) collectComments(replies, out, limit);
  }
}

/** 拉评论:对每条帖 URL 取其评论(含层级回复,展开到 limit 条)。 */
export async function redditComments(postUrls: string[], limit: number): Promise<PulledComment[]> {
  const out: PulledComment[] = [];
  for (const raw of postUrls) {
    if (out.length >= limit) break;
    const base = raw.split("?")[0].replace(/\/+$/, "");
    const json = await getJSON<any>(`${base}.json?limit=${limit}&sort=top&raw_json=1`);
    const listing = Array.isArray(json) ? json[1] : json; // [post, comments]
    const children = listing?.data?.children || [];
    collectComments(children, out, limit);
  }
  return out.slice(0, limit);
}
