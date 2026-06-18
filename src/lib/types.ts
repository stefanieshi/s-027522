/** Domain types for Resonance · Reply Copilot. */

export type Platform = "x" | "reddit";
export type Tab = "briefing" | "triage" | "queue" | "studio" | "voice";
export type Safety = "green" | "amber" | "red";

/** A scored reply opportunity surfaced in Triage. */
export interface Op {
  _id: string;
  fit: number;
  why_now: string;
  decay_hours: number;
  angle: string;
  text: string;
  // X
  author?: string;
  handle?: string;
  verified?: boolean;
  likes?: number;
  reposts?: number;
  replies?: number;
  // Reddit
  subreddit?: string;
  title?: string;
  upvotes?: number;
  comments?: number;
}

/** A generated reply option for an Op. */
export interface Draft {
  angle: string;
  reply: string;
  sounds: number | null;
  safety: Safety;
  note: string;
}

/** An item awaiting human review in the Approval queue. */
export interface QueueItem {
  id: string;
  platform: Platform;
  target: string;
  text: string;
  sounds: number | null;
  safety: Safety;
  note: string;
  status: "ready" | "posted";
}

/** Trained voice profile. */
export interface Voice {
  voice_dna: string;
  tone: string;
  signature_moves: string[];
  vocabulary: string[];
  avoid: string[];
}

/** An original post generated in Studio. */
export interface StudioPost {
  format: string;
  text: string;
  safety: Safety;
  note: string;
}
