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

export default db;
