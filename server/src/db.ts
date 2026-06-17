/**
 * db.ts — SQLite 持久化(better-sqlite3)
 *
 * 存「排期帖」队列:调度器(scheduler.ts)每分钟扫 status='scheduled' 且
 * scheduled_for<=now 的行去真发。规模化再换 Postgres。
 *
 * DB 路径用 env DB_PATH 配置,默认 ./data/vibe-marketer.db(已 gitignore)。
 */
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import type { PublishInput, Channel, Platform, ActionKind } from "./publishers.js";

const DB_PATH = process.env.DB_PATH || "./data/vibe-marketer.db";
mkdirSync(dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id                  TEXT PRIMARY KEY,
  account_id          TEXT NOT NULL,
  external_account_id TEXT,
  platform            TEXT NOT NULL,
  kind                TEXT NOT NULL,
  text                TEXT NOT NULL,
  media_urls          TEXT,            -- JSON array
  target_url          TEXT,
  channel             TEXT NOT NULL DEFAULT 'zernio',
  scheduled_for       TEXT NOT NULL,   -- ISO 8601
  status              TEXT NOT NULL DEFAULT 'scheduled', -- scheduled|published|error|canceled
  external_post_id    TEXT,
  error               TEXT,
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sched_status_time ON scheduled_posts(status, scheduled_for);

CREATE TABLE IF NOT EXISTS post_metrics (
  external_post_id TEXT PRIMARY KEY,
  account_id       TEXT,
  platform         TEXT,
  views            INTEGER,
  likes            INTEGER,
  engagement_rate  REAL,
  status           TEXT NOT NULL DEFAULT 'pending', -- pending|ok|error
  error            TEXT,
  fetched_at       TEXT,
  created_at       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tracked_accounts (
  id                TEXT PRIMARY KEY,
  platform          TEXT NOT NULL,
  handle            TEXT NOT NULL,
  kind              TEXT NOT NULL,         -- competitor | bigv
  niche             TEXT,
  reply_account_id  TEXT,                  -- 以哪个内部号的人格回复(bigv)
  reply_guideline   TEXT,
  last_post_id      TEXT,
  last_checked      TEXT,
  active            INTEGER NOT NULL DEFAULT 1,
  created_at        TEXT NOT NULL,
  UNIQUE(platform, handle, kind)
);

CREATE TABLE IF NOT EXISTS mentions (
  id           TEXT PRIMARY KEY,
  tracked_id   TEXT NOT NULL,
  platform     TEXT NOT NULL,
  post_id      TEXT,
  post_url     TEXT,
  post_text    TEXT,
  author       TEXT,
  draft_reply  TEXT,
  flagged      INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'drafted', -- drafted|approved|sent|ignored
  notified     INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_mentions_status ON mentions(status, created_at);

CREATE TABLE IF NOT EXISTS inspiration (
  id          TEXT PRIMARY KEY,
  platform    TEXT NOT NULL,
  source      TEXT,
  raw         TEXT,
  metrics     TEXT,
  url         TEXT,
  topic       TEXT,
  score       INTEGER,
  created_at  TEXT NOT NULL,
  UNIQUE(platform, url)
);
`);

export type SchedStatus = "scheduled" | "published" | "error" | "canceled";

export interface ScheduledRow {
  id: string;
  account_id: string;
  external_account_id: string | null;
  platform: Platform;
  kind: ActionKind;
  text: string;
  media_urls: string | null;
  target_url: string | null;
  channel: Channel;
  scheduled_for: string;
  status: SchedStatus;
  external_post_id: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

const insertStmt = db.prepare(`
  INSERT INTO scheduled_posts
    (id, account_id, external_account_id, platform, kind, text, media_urls, target_url,
     channel, scheduled_for, status, created_at, updated_at)
  VALUES
    (@id, @account_id, @external_account_id, @platform, @kind, @text, @media_urls, @target_url,
     @channel, @scheduled_for, 'scheduled', @now, @now)
`);

/** Persist a new scheduled post. `scheduledFor` (ISO) decides when it fires. */
export function insertScheduled(input: PublishInput, channel: Channel, scheduledFor: string, id = randomUUID()): ScheduledRow {
  const now = new Date().toISOString();
  insertStmt.run({
    id,
    account_id: input.accountId,
    external_account_id: input.externalAccountId ?? null,
    platform: input.platform,
    kind: input.kind,
    text: input.text,
    media_urls: input.mediaUrls?.length ? JSON.stringify(input.mediaUrls) : null,
    target_url: input.targetUrl ?? null,
    channel,
    scheduled_for: scheduledFor,
    now,
  });
  return getById(id)!;
}

export function getById(id: string): ScheduledRow | undefined {
  return db.prepare("SELECT * FROM scheduled_posts WHERE id = ?").get(id) as ScheduledRow | undefined;
}

/** Rows that are due to publish (status=scheduled, scheduled_for <= nowIso). */
export function getDueScheduled(nowIso: string): ScheduledRow[] {
  return db
    .prepare("SELECT * FROM scheduled_posts WHERE status = 'scheduled' AND scheduled_for <= ? ORDER BY scheduled_for ASC")
    .all(nowIso) as ScheduledRow[];
}

export function listScheduled(status?: SchedStatus): ScheduledRow[] {
  if (status) return db.prepare("SELECT * FROM scheduled_posts WHERE status = ? ORDER BY scheduled_for ASC").all(status) as ScheduledRow[];
  return db.prepare("SELECT * FROM scheduled_posts ORDER BY scheduled_for ASC").all() as ScheduledRow[];
}

export function markPublished(id: string, externalPostId?: string): void {
  db.prepare("UPDATE scheduled_posts SET status='published', external_post_id=?, error=NULL, updated_at=? WHERE id=?").run(
    externalPostId ?? null,
    new Date().toISOString(),
    id
  );
}

export function markFailed(id: string, error: string): void {
  db.prepare("UPDATE scheduled_posts SET status='error', error=?, updated_at=? WHERE id=?").run(error.slice(0, 500), new Date().toISOString(), id);
}

/** Cancel a still-pending scheduled post. Returns true if a row was canceled. */
export function cancelScheduled(id: string): boolean {
  const r = db.prepare("UPDATE scheduled_posts SET status='canceled', updated_at=? WHERE id=? AND status='scheduled'").run(
    new Date().toISOString(),
    id
  );
  return r.changes > 0;
}

/** Reconstruct a PublishInput for immediate publish (drops scheduledFor → publishNow). */
export function rowToInput(row: ScheduledRow): PublishInput {
  return {
    accountId: row.account_id,
    externalAccountId: row.external_account_id ?? undefined,
    platform: row.platform,
    kind: row.kind,
    text: row.text,
    mediaUrls: row.media_urls ? (JSON.parse(row.media_urls) as string[]) : undefined,
    targetUrl: row.target_url ?? undefined,
  };
}

/* ===================== post_metrics(真实互动数据回收) ===================== */
export interface MetricRow {
  external_post_id: string;
  account_id: string | null;
  platform: string | null;
  views: number | null;
  likes: number | null;
  engagement_rate: number | null;
  status: "pending" | "ok" | "error";
  error: string | null;
  fetched_at: string | null;
  created_at: string;
}

/** 注册一个要追踪互动数据的帖(幂等)。发布成功后调一次。 */
export function trackMetric(externalPostId: string, accountId?: string | null, platform?: string | null): void {
  db.prepare(
    `INSERT INTO post_metrics (external_post_id, account_id, platform, status, created_at)
     VALUES (?, ?, ?, 'pending', ?)
     ON CONFLICT(external_post_id) DO UPDATE SET
       account_id = COALESCE(excluded.account_id, post_metrics.account_id),
       platform   = COALESCE(excluded.platform, post_metrics.platform)`
  ).run(externalPostId, accountId ?? null, platform ?? null, new Date().toISOString());
}

export function upsertMetricResult(externalPostId: string, m: { views?: number; likes?: number; engagementRate?: number }): void {
  db.prepare(
    "UPDATE post_metrics SET views=?, likes=?, engagement_rate=?, status='ok', error=NULL, fetched_at=? WHERE external_post_id=?"
  ).run(m.views ?? null, m.likes ?? null, m.engagementRate ?? null, new Date().toISOString(), externalPostId);
}

export function markMetricError(externalPostId: string, error: string): void {
  db.prepare("UPDATE post_metrics SET status='error', error=?, fetched_at=? WHERE external_post_id=?").run(
    error.slice(0, 300),
    new Date().toISOString(),
    externalPostId
  );
}

export function listTrackedMetricIds(): string[] {
  return (db.prepare("SELECT external_post_id FROM post_metrics").all() as { external_post_id: string }[]).map((r) => r.external_post_id);
}

export function getMetrics(ids: string[]): MetricRow[] {
  if (!ids.length) return [];
  const ph = ids.map(() => "?").join(",");
  return db.prepare(`SELECT * FROM post_metrics WHERE external_post_id IN (${ph})`).all(...ids) as MetricRow[];
}

/* ===================== tracked_accounts ===================== */
export type TrackKind = "competitor" | "bigv";
export interface TrackedRow {
  id: string;
  platform: string;
  handle: string;
  kind: TrackKind;
  niche: string | null;
  reply_account_id: string | null;
  reply_guideline: string | null;
  last_post_id: string | null;
  last_checked: string | null;
  active: number;
  created_at: string;
}

export function addTracked(t: {
  platform: string;
  handle: string;
  kind: TrackKind;
  niche?: string;
  replyAccountId?: string;
  guideline?: string;
}): void {
  db.prepare(
    `INSERT INTO tracked_accounts (id, platform, handle, kind, niche, reply_account_id, reply_guideline, active, created_at)
     VALUES (@id, @platform, @handle, @kind, @niche, @reply_account_id, @reply_guideline, 1, @now)
     ON CONFLICT(platform, handle, kind) DO UPDATE SET
       niche=COALESCE(excluded.niche, tracked_accounts.niche),
       reply_account_id=COALESCE(excluded.reply_account_id, tracked_accounts.reply_account_id),
       reply_guideline=COALESCE(excluded.reply_guideline, tracked_accounts.reply_guideline),
       active=1`
  ).run({
    id: randomUUID(),
    platform: t.platform,
    handle: t.handle.replace(/^@/, ""),
    kind: t.kind,
    niche: t.niche ?? null,
    reply_account_id: t.replyAccountId ?? null,
    reply_guideline: t.guideline ?? null,
    now: new Date().toISOString(),
  });
}

export function listTracked(kind?: TrackKind): TrackedRow[] {
  if (kind) return db.prepare("SELECT * FROM tracked_accounts WHERE kind=? ORDER BY created_at DESC").all(kind) as TrackedRow[];
  return db.prepare("SELECT * FROM tracked_accounts ORDER BY created_at DESC").all() as TrackedRow[];
}
export function listActiveTracked(kind: TrackKind): TrackedRow[] {
  return db.prepare("SELECT * FROM tracked_accounts WHERE kind=? AND active=1").all(kind) as TrackedRow[];
}
export function deleteTracked(id: string): boolean {
  return db.prepare("DELETE FROM tracked_accounts WHERE id=?").run(id).changes > 0;
}
export function updateTrackedCheck(id: string, lastPostId: string | null): void {
  db.prepare("UPDATE tracked_accounts SET last_post_id=?, last_checked=? WHERE id=?").run(lastPostId, new Date().toISOString(), id);
}

/* ===================== mentions(大V回复待办) ===================== */
export type MentionStatus = "drafted" | "approved" | "sent" | "ignored";
export interface MentionRow {
  id: string;
  tracked_id: string;
  platform: string;
  post_id: string | null;
  post_url: string | null;
  post_text: string | null;
  author: string | null;
  draft_reply: string | null;
  flagged: number;
  status: MentionStatus;
  notified: number;
  created_at: string;
}

export function insertMention(m: {
  trackedId: string;
  platform: string;
  postId?: string;
  postUrl?: string;
  postText?: string;
  author?: string;
  draftReply?: string;
  flagged?: boolean;
}): MentionRow {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO mentions (id, tracked_id, platform, post_id, post_url, post_text, author, draft_reply, flagged, status, notified, created_at)
     VALUES (?,?,?,?,?,?,?,?,?, 'drafted', 0, ?)`
  ).run(
    id,
    m.trackedId,
    m.platform,
    m.postId ?? null,
    m.postUrl ?? null,
    m.postText ?? null,
    m.author ?? null,
    m.draftReply ?? null,
    m.flagged ? 1 : 0,
    new Date().toISOString()
  );
  return db.prepare("SELECT * FROM mentions WHERE id=?").get(id) as MentionRow;
}

export function listMentions(status?: MentionStatus): MentionRow[] {
  if (status) return db.prepare("SELECT * FROM mentions WHERE status=? ORDER BY created_at DESC").all(status) as MentionRow[];
  return db.prepare("SELECT * FROM mentions ORDER BY created_at DESC").all() as MentionRow[];
}
export function listUnnotifiedMentions(): MentionRow[] {
  return db.prepare("SELECT * FROM mentions WHERE status='drafted' AND notified=0 ORDER BY created_at DESC").all() as MentionRow[];
}
export function setMentionStatus(id: string, status: MentionStatus): boolean {
  return db.prepare("UPDATE mentions SET status=? WHERE id=?").run(status, id).changes > 0;
}
export function markMentionNotified(ids: string[]): void {
  if (!ids.length) return;
  const stmt = db.prepare("UPDATE mentions SET notified=1 WHERE id=?");
  const tx = db.transaction((arr: string[]) => arr.forEach((i) => stmt.run(i)));
  tx(ids);
}

/* ===================== inspiration(niche 灵感/趋势源) ===================== */
export interface InspirationRow {
  id: string;
  platform: string;
  source: string | null;
  raw: string | null;
  metrics: string | null;
  url: string | null;
  topic: string | null;
  score: number | null;
  created_at: string;
}
export function upsertInspiration(i: { platform: string; source?: string; raw?: string; metrics?: string; url?: string; topic?: string; score?: number }): void {
  db.prepare(
    `INSERT INTO inspiration (id, platform, source, raw, metrics, url, topic, score, created_at)
     VALUES (@id,@platform,@source,@raw,@metrics,@url,@topic,@score,@now)
     ON CONFLICT(platform, url) DO UPDATE SET metrics=excluded.metrics, score=excluded.score`
  ).run({
    id: randomUUID(),
    platform: i.platform,
    source: i.source ?? null,
    raw: i.raw ?? null,
    metrics: i.metrics ?? null,
    url: i.url ?? null,
    topic: i.topic ?? null,
    score: i.score ?? null,
    now: new Date().toISOString(),
  });
}
export function listInspiration(platform?: string, limit = 40): InspirationRow[] {
  if (platform) return db.prepare("SELECT * FROM inspiration WHERE platform=? ORDER BY score DESC, created_at DESC LIMIT ?").all(platform, limit) as InspirationRow[];
  return db.prepare("SELECT * FROM inspiration ORDER BY created_at DESC, score DESC LIMIT ?").all(limit) as InspirationRow[];
}

export default db;
