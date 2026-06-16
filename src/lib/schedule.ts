import type { Draft, Settings, Account } from "./types";

/* ===================== dedup (cross-account similarity) ===================== */
function tokens(s: string): Set<string> {
  return new Set(
    (s || "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((w) => w.length > 1)
  );
}

export function jaccard(a: string, b: string): number {
  const A = tokens(a),
    B = tokens(b);
  if (!A.size || !B.size) return 0;
  let i = 0;
  A.forEach((x) => {
    if (B.has(x)) i++;
  });
  return i / (A.size + B.size - i);
}

/** Recompute pairwise similarity flags across all pending drafts (in place). */
export function recomputeSim(drafts: Draft[], accounts: Account[]): void {
  const acctOf = (id: string) => accounts.find((a) => a.id === id);
  const p = drafts.filter((d) => d.status === "pending");
  p.forEach((d) => (d.sim = null));
  for (let i = 0; i < p.length; i++) {
    for (let k = i + 1; k < p.length; k++) {
      const s = jaccard(p[i].hook + " " + p[i].body, p[k].hook + " " + p[k].body);
      if (s > (p[i].sim?.score || 0)) p[i].sim = { score: s, peer: acctOf(p[k].account_id)?.handle || "?" };
      if (s > (p[k].sim?.score || 0)) p[k].sim = { score: s, peer: acctOf(p[i].account_id)?.handle || "?" };
    }
  }
}

/* ===================== X post staggered scheduling ===================== */
function clampWin(t: number, s: Settings): number {
  const d = new Date(t);
  const h = d.getHours();
  if (h < s.postStartHour) {
    d.setHours(s.postStartHour, Math.floor(Math.random() * 30), 0, 0);
  } else if (h >= s.postEndHour) {
    d.setDate(d.getDate() + 1);
    d.setHours(s.postStartHour, Math.floor(Math.random() * 30), 0, 0);
  }
  return d.getTime();
}

/**
 * Assign a staggered schedule slot to an X post:
 *  - keep a min gap between posts of the same account
 *  - keep ~15min cross-account spacing to avoid synchronized bursts
 * Non-X drafts are not scheduled (published in their platform window).
 */
export function assignSchedule(d: Draft, drafts: Draft[], settings: Settings): void {
  if (d.type !== "x_post") {
    d.scheduledAt = null;
    return;
  }
  const gap = (settings.minGapMin || 45) * 6e4;
  const cross = 9e5; // 15 min
  const same = drafts
    .filter((x) => x.type === "x_post" && x.scheduledAt && x.id !== d.id && x.account_id === d.account_id && x.status !== "published")
    .map((x) => x.scheduledAt as number);
  const all = drafts
    .filter((x) => x.type === "x_post" && x.scheduledAt && x.id !== d.id && x.status !== "published")
    .map((x) => x.scheduledAt as number);
  let t = clampWin(Date.now() + (5 + Math.random() * 12) * 6e4, settings);
  let g = 0;
  while (g++ < 800) {
    if (same.every((x) => Math.abs(x - t) >= gap) && all.every((x) => Math.abs(x - t) >= cross)) break;
    t = clampWin(t + gap * 0.5 + Math.random() * gap * 0.7, settings);
  }
  d.scheduledAt = Math.round(t);
}
