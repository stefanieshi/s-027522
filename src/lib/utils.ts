import { PLAT_LABEL } from "./constants";
import type { Platform } from "./types";

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function initial(handle: string): string {
  return (handle || "?").replace(/^[@u/]+/, "")[0]?.toUpperCase() || "?";
}

export function isToday(ts?: number | null): boolean {
  return !!ts && new Date(ts).toDateString() === new Date().toDateString();
}

export function fmtTime(ts: number): string {
  const d = new Date(ts);
  const n = new Date();
  const day = d.toDateString() === n.toDateString() ? "今天 " : "明天 ";
  return day + d.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

/* ---- X (Twitter) native composer deeplinks — manual send, safest path ---- */
export function tweetId(s?: string): string | null {
  const m = (s || "").match(/status\/(\d+)/);
  return m ? m[1] : null;
}
export function xDmUrl(t: string): string {
  return "https://x.com/messages/compose?text=" + encodeURIComponent(t);
}
export function xReplyUrl(t: string, target?: string): string {
  const id = tweetId(target);
  const b = "https://x.com/intent/tweet?text=" + encodeURIComponent(t);
  return id ? b + "&in_reply_to=" + id : b;
}

export const composerUrl: Record<Platform, string> = {
  x: "https://x.com/compose/post",
  tiktok: "https://www.tiktok.com/upload",
  instagram: "https://www.instagram.com",
  reddit: "https://www.reddit.com/submit",
};

export function platLabel(p: Platform): string {
  return PLAT_LABEL[p];
}

export async function copy(t: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    return false;
  }
}
