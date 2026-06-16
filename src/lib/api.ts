/**
 * api.ts — 前端调后端发布层(server/)。
 * 所有调用都"优雅降级":后端不可达时返回 { status:'error', error:'BACKEND_UNREACHABLE' },
 * 由调用方回退到本地行为(打开原生发送框 / 本地标记),保证没后端也能用。
 */
import type { Platform } from "./types";

export type Channel = "manual" | "zernio" | "morelogin";
export type ActionKind = "post" | "reply" | "dm";

export interface PublishInput {
  accountId: string;
  externalAccountId?: string;
  platform: Platform;
  kind: ActionKind;
  text: string;
  mediaUrls?: string[];
  scheduledFor?: string;
  targetUrl?: string;
}

export interface PublishResult {
  status: "published" | "scheduled" | "manual" | "error";
  externalPostId?: string;
  openUrl?: string;
  error?: string;
}

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
