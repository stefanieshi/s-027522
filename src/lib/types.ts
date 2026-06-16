export type Platform = "x" | "tiktok" | "instagram" | "reddit";
export type DraftType = "x_post" | "tiktok_script" | "ig_caption" | "reddit_post";
export type DraftStatus = "pending" | "approved" | "published" | "rejected";
export type ResultTier = "win" | "mid" | "flop";

export interface Persona {
  voice: string;
  stance: string;
  taboo: string;
  format: string;
}

export interface Account {
  id: string;
  handle: string;
  platform: Platform;
  color: string;
  persona: Persona;
}

export interface Teardown {
  hook_type: string;
  structure: string;
  emotional_trigger: string;
  why_it_worked: string;
}

export interface Pattern {
  id: string;
  template: string;
}

export interface Swipe {
  id: string;
  platform: Platform;
  source: string;
  metrics: string;
  raw: string;
  teardown: Teardown | null;
  pattern: Pattern | null;
}

export interface Sim {
  score: number;
  peer: string;
}

export interface Draft {
  id: string;
  account_id: string;
  platform: Platform;
  type: DraftType;
  topic: string;
  hook: string;
  body: string;
  cta: string;
  disclosure_required: boolean;
  self: { hook: number; persona: number };
  patternId: string | null;
  scheduledAt: number | null;
  result: { tier: ResultTier; loggedAt: number } | null;
  promoted: boolean;
  sim: Sim | null;
  status: DraftStatus;
  created: number;
  publishedAt?: number;
}

export interface InboxItem {
  id: string;
  platform: Platform;
  from: string;
  color: string;
  msg: string;
  reply: string;
  status: "new" | "sent";
  flagged: boolean;
}

export interface Templates {
  comment: string;
  dm: string;
}

export interface Settings {
  apiKey: string;
  model: string;
  simThreshold: number;
  postStartHour: number;
  postEndHour: number;
  minGapMin: number;
  dailyPerAccount: number;
  autoReply: boolean;
}

export interface AppData {
  accounts: Account[];
  swipes: Swipe[];
  drafts: Draft[];
  inbox: InboxItem[];
  templates: Templates;
  settings: Settings;
}

export type ViewId = "today" | "calendar" | "inbox" | "analytics" | "voice" | "settings";
