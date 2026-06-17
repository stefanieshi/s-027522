/**
 * x.ts — 免费 X 数据源(twscrape sidecar 客户端)。
 * X_SOURCE=twscrape 时,apify.ts 把 x 平台的抓取委派到这里。只读。
 * 归一化成和 apify.ts 一致的形状,调用点(server/monitor)无感。
 */
import type { ViralCandidate, PulledComment, LatestPost } from "./apify.js";
import { cfg } from "../config.js";

const BASE = () => (cfg("TWSCRAPE_URL") || "http://127.0.0.1:8001").replace(/\/$/, "");

async function getJSON<T>(path: string): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90_000);
  try {
    const res = await fetch(BASE() + path, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`twscrape ${res.status}: ${(await res.text().catch(() => "")).slice(0, 160)}`);
    return (await res.json()) as T;
  } catch (e: any) {
    if (e?.name === "AbortError" || e instanceof TypeError) {
      throw new Error("twscrape sidecar 不可达(确认已启动 :8001 并加了 X 小号)");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

/** 通用请求(支持 POST/DELETE + 自定义超时);加号/登录较慢,故超时更长。 */
async function reqJSON<T>(path: string, method: "GET" | "POST" | "DELETE", body?: unknown, timeoutMs = 90_000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(BASE() + path, {
      method,
      headers: body ? { "content-type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`twscrape ${res.status}: ${(await res.text().catch(() => "")).slice(0, 160)}`);
    return (await res.json()) as T;
  } catch (e: any) {
    if (e?.name === "AbortError" || e instanceof TypeError) {
      throw new Error("twscrape sidecar 不可达(确认已启动 :8001;cd server/x-scraper && ./run.sh)");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

const enc = encodeURIComponent;

/* ---------- 小号(burner)账号管理:供前端 UI 调用 ---------- */
export interface XAccount {
  username: string;
  active: boolean;
  logged_in: boolean;
  last_used?: string | null;
  total_req?: number | null;
  error_msg?: string | null;
}
export const xAccountsList = () => reqJSON<XAccount[]>("/accounts", "GET");
export const xAccountAdd = (body: { username: string; password: string; email: string; email_password: string }) =>
  reqJSON<{ ok: boolean; username?: string; logged_in?: boolean; login_error?: string | null; error?: string }>("/accounts/add", "POST", body, 150_000);
export const xAccountsLogin = () => reqJSON<{ total: number; active: number }>("/accounts/login", "POST", undefined, 180_000);
export const xAccountDelete = (username: string) => reqJSON<{ ok: boolean }>("/accounts/" + enc(username), "DELETE");

/** 发现爆款:@handle → 该账号近期帖;否则关键词搜索。 */
export async function xDiscover(query: string, limit: number): Promise<ViralCandidate[]> {
  const q = query.trim();
  if (!q) return [];
  if (q.startsWith("@")) {
    const rows = await getJSON<any[]>(`/user_tweets?login=${enc(q)}&limit=${limit}`);
    return rows.map((r) => ({ platform: "x" as const, source: r.author || q, raw: r.text || "", metrics: "", url: r.url || "" }));
  }
  const rows = await getJSON<any[]>(`/search?q=${enc(q)}&limit=${limit}`);
  return rows.map((r) => ({ platform: "x" as const, source: r.source || "@x", raw: r.raw || "", metrics: r.metrics || "", url: r.url || "" }));
}

/** 大V监控:某账号最新帖(newest first)。 */
export async function xUserLatest(handle: string, limit: number): Promise<LatestPost[]> {
  const rows = await getJSON<any[]>(`/user_tweets?login=${enc(handle)}&limit=${limit}`);
  return rows.map((r) => ({ postId: String(r.postId || r.url || ""), url: r.url || "", text: r.text || "", author: r.author || ("@" + handle.replace(/^@/, "")), ts: r.ts }));
}

/** 拉评论:对每条帖 URL 取其回复。 */
export async function xReplies(postUrls: string[], limit: number): Promise<PulledComment[]> {
  const out: PulledComment[] = [];
  for (const url of postUrls) {
    const id = (url.match(/status\/(\d+)/) || [])[1];
    if (!id) continue;
    const rows = await getJSON<any[]>(`/replies?tweet_id=${id}&limit=${limit}`);
    rows.forEach((r) => out.push({ platform: "x" as const, from: r.from || "@x", msg: r.msg || "" }));
  }
  return out.filter((c) => c.msg);
}
