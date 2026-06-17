/**
 * api.ts — 前端调后端发布层(server/)。
 * 所有调用都"优雅降级":后端不可达时返回 { status:'error', error:'BACKEND_UNREACHABLE' },
 * 由调用方回退到本地行为(打开原生发送框 / 本地标记),保证没后端也能用。
 */
import type { Platform } from "./types";

export type Channel = "manual" | "zernio" | "morelogin";
export type ActionKind = "post" | "reply" | "dm";

export interface PublishOptions {
  privacy?: string;
  disableComment?: boolean;
  disableDuet?: boolean;
  disableStitch?: boolean;
  madeForKids?: boolean;
  categoryId?: string;
}

export interface PublishInput {
  accountId: string;
  externalAccountId?: string;
  platform: Platform;
  kind: ActionKind;
  text: string;
  mediaUrls?: string[];
  scheduledFor?: string;
  targetUrl?: string;
  options?: PublishOptions;
}

export interface PublishResult {
  status: "published" | "scheduled" | "manual" | "error";
  externalPostId?: string;
  publishedUrl?: string;
  openUrl?: string;
  error?: string;
}

/* ===================== 抓取摄入(Apify)===================== */
export const NO_APIFY_TOKEN = "NO_APIFY_TOKEN";

export interface ViralCandidate {
  platform: Platform;
  source: string;
  raw: string;
  metrics: string;
  url: string;
}
export interface PulledComment {
  platform: Platform;
  from: string;
  msg: string;
}

/** 抓取类调用统一返回 { data, error }:无后端/无 token/失败时 data 为空,error 给调用方提示。 */
async function getList<T>(apiBase: string, path: string, body?: unknown, method: "GET" | "POST" = "POST"): Promise<{ data: T[]; error?: string }> {
  try {
    const res = await fetch(base(apiBase) + path, {
      method,
      headers: method === "POST" ? { "content-type": "application/json" } : undefined,
      body: method === "POST" ? JSON.stringify(body ?? {}) : undefined,
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return { data: [], error: (j as any)?.error || "HTTP " + res.status };
    }
    return { data: (await res.json()) as T[] };
  } catch (e: any) {
    return { data: [], error: isNetwork(e) ? UNREACHABLE : e?.message || String(e) };
  }
}

export const apiDiscover = (apiBase: string, platform: string, query: string, limit = 8) =>
  getList<ViralCandidate>(apiBase, "/api/discover", { platform, query, limit });

export const apiPullInbox = (apiBase: string, platform: string, postUrls: string[], limit = 20) =>
  getList<PulledComment>(apiBase, "/api/inbox/pull", { platform, postUrls, limit });

export const apiTrends = (apiBase: string, platform: string, query: string, limit = 10) =>
  getList<string>(apiBase, "/api/trends", { platform, query, limit });

export const UNREACHABLE = "BACKEND_UNREACHABLE";

function base(apiBase: string): string {
  return (apiBase || "").replace(/\/$/, "");
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error("HTTP " + res.status + (txt ? ": " + txt.slice(0, 160) : ""));
  }
  return res.json() as Promise<T>;
}

/** 立即发布(或后端 manual→返回 deeplink)。 */
export async function apiPublish(apiBase: string, input: PublishInput, channel: Channel): Promise<PublishResult> {
  try {
    return await postJSON<PublishResult>(base(apiBase) + "/api/publish", { input, channel });
  } catch (e: any) {
    return { status: "error", error: isNetwork(e) ? UNREACHABLE : e?.message || String(e) };
  }
}

/** 排期发布:持久化到后端 DB,由 scheduler 到点发。 */
export async function apiSchedule(
  apiBase: string,
  input: PublishInput,
  channel: Channel,
  scheduledFor: string
): Promise<{ status: "scheduled" | "error"; id?: string; error?: string }> {
  try {
    return await postJSON(base(apiBase) + "/api/schedule", { input, channel, scheduledFor });
  } catch (e: any) {
    return { status: "error", error: isNetwork(e) ? UNREACHABLE : e?.message || String(e) };
  }
}

export async function apiCancelSchedule(apiBase: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(base(apiBase) + "/api/schedule/" + id, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

export interface ZernioAccount {
  id: string;
  platform: string;
  username?: string;
  displayName?: string;
  profileUrl?: string;
  isActive?: boolean;
}

/** 列出 zernio 已连接账号(后端读 ZERNIO_API_KEY);用于把内部账号映射到 zernio accountId。 */
export async function apiZernioAccounts(apiBase: string): Promise<{ data: ZernioAccount[]; error?: string }> {
  try {
    const res = await fetch(base(apiBase) + "/api/zernio/accounts");
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return { data: [], error: (j as any)?.error || "HTTP " + res.status };
    }
    return { data: (await res.json()) as ZernioAccount[] };
  } catch (e: any) {
    return { data: [], error: isNetwork(e) ? UNREACHABLE : e?.message || String(e) };
  }
}

/* ===================== 真实互动数据 ===================== */
export interface Metric {
  externalPostId: string;
  accountId: string | null;
  platform: string | null;
  views: number | null;
  likes: number | null;
  engagementRate: number | null;
  status: "pending" | "ok" | "error";
  fetchedAt: string | null;
}

/** 注册一个帖去追踪真实互动数据(发布成功后调)。 */
export async function apiTrack(apiBase: string, externalPostId: string, accountId?: string, platform?: string): Promise<void> {
  try {
    await postJSON(base(apiBase) + "/api/metrics/track", { externalPostId, accountId, platform });
  } catch {
    /* best-effort */
  }
}

/** 拉取一批帖的已存互动数据。 */
export async function apiGetMetrics(apiBase: string, ids: string[]): Promise<Metric[]> {
  if (!ids.length) return [];
  try {
    const res = await fetch(base(apiBase) + "/api/metrics?ids=" + encodeURIComponent(ids.join(",")));
    if (!res.ok) return [];
    return (await res.json()) as Metric[];
  } catch {
    return [];
  }
}

/** 触发后端立刻刷新所有追踪帖的互动数据。 */
export async function apiRefreshMetrics(apiBase: string): Promise<{ ok: number; err: number } | null> {
  try {
    return await postJSON(base(apiBase) + "/api/metrics/refresh", {});
  } catch {
    return null;
  }
}

/** 后端健康检查(设置页"测试连接"用)。 */
export async function apiHealth(apiBase: string): Promise<boolean> {
  try {
    const res = await fetch(base(apiBase) + "/health");
    return res.ok;
  } catch {
    return false;
  }
}

function isNetwork(e: any): boolean {
  return e instanceof TypeError || /Failed to fetch|NetworkError|load failed/i.test(e?.message || "");
}

/* ===================== 追踪雷达(对标/大V + 大V回复待办 + 灵感) ===================== */
export interface TrackedAccount {
  id: string;
  platform: string;
  handle: string;
  kind: "competitor" | "bigv";
  niche: string | null;
  replyAccountId: string | null;
  guideline: string | null;
  lastChecked: string | null;
  active: boolean;
}
export interface Mention {
  id: string;
  platform: Platform;
  postUrl: string | null;
  postText: string | null;
  author: string | null;
  reply: string | null;
  flagged: boolean;
  status: "drafted" | "approved" | "sent" | "ignored";
  notified: boolean;
  createdAt: string;
}
export interface Inspiration {
  platform: Platform;
  source: string | null;
  raw: string | null;
  metrics: string | null;
  url: string | null;
  topic: string | null;
  score: number | null;
}

export const apiListTracked = (apiBase: string, kind?: string) =>
  getList<TrackedAccount>(apiBase, "/api/tracked" + (kind ? "?kind=" + kind : ""), undefined, "GET");

export async function apiImportTracked(
  apiBase: string,
  body: { platform: string; kind: string; handles: string[]; niche?: string; replyAccountId?: string; guideline?: string }
): Promise<{ added: number } | { error: string }> {
  try {
    return await postJSON(base(apiBase) + "/api/tracked/import", body);
  } catch (e: any) {
    return { error: isNetwork(e) ? UNREACHABLE : e?.message || String(e) };
  }
}
export async function apiDeleteTracked(apiBase: string, id: string): Promise<boolean> {
  try {
    return (await fetch(base(apiBase) + "/api/tracked/" + id, { method: "DELETE" })).ok;
  } catch {
    return false;
  }
}

export const apiListMentions = (apiBase: string, status?: string) =>
  getList<Mention>(apiBase, "/api/mentions" + (status ? "?status=" + status : ""), undefined, "GET");

export async function apiMentionAction(apiBase: string, id: string, action: "approve" | "sent" | "ignore"): Promise<boolean> {
  try {
    return (await fetch(base(apiBase) + `/api/mentions/${id}/${action}`, { method: "POST" })).ok;
  } catch {
    return false;
  }
}
export async function apiMarkMentionsNotified(apiBase: string, ids: string[]): Promise<void> {
  try {
    await postJSON(base(apiBase) + "/api/mentions/mark-notified", { ids });
  } catch {
    /* best-effort */
  }
}

export const apiListInspiration = (apiBase: string, platform?: string) =>
  getList<Inspiration>(apiBase, "/api/inspiration" + (platform ? "?platform=" + platform : ""), undefined, "GET");

export async function apiRunMonitor(apiBase: string): Promise<{ mentions: number; inspiration: number } | null> {
  try {
    return await postJSON(base(apiBase) + "/api/monitor/run", {});
  } catch {
    return null;
  }
}
