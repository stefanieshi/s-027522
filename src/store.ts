import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "./lib/utils";
import { DEMO, DEMO_STUDIO, DEMO_VOICE, demoDrafts } from "./lib/demo";
import { analyzeVoice, genReplies, genStudio, scanOps } from "./lib/ai";
import type { Draft, Op, Platform, QueueItem, StudioPost, Tab, Voice } from "./lib/types";

const DB_KEY = "resonance_v1";

/** Fresh demo opportunities for a platform, with ids assigned. */
function seedOps(platform: Platform): Op[] {
  return DEMO[platform].map((o, i) => ({ ...o, _id: `seed-${platform}-${i}` }));
}

interface AppState {
  // navigation / context
  tab: Tab;
  platform: Platform;
  niche: string;
  // triage
  ops: Op[];
  sel: number;
  scanning: boolean;
  drafts: Record<string, Draft[]>;
  draftBusy: string | null;
  // queue
  queue: QueueItem[];
  editId: string | null;
  // voice
  voice: Voice | null;
  voiceBusy: boolean;
  // studio
  studio: StudioPost[] | null;
  studioBusy: boolean;
  // misc
  demoMode: boolean;
  apiKey: string;
  model: string;

  // setters
  setTab: (t: Tab) => void;
  setPlatform: (p: Platform) => void;
  setNiche: (n: string) => void;
  setApiKey: (k: string) => void;
  setModel: (m: string) => void;
  setSel: (i: number) => void;

  // async generators (fall back to demo on failure)
  scan: () => Promise<void>;
  genDrafts: (id: string) => Promise<void>;
  trainVoice: (samples: string) => Promise<void>;
  studioGen: (seed: string) => Promise<void>;

  // triage actions
  approve: (id: string, k: number) => void;
  dismiss: (i: number) => void;
  snooze: (i: number) => void;

  // queue actions
  studioQueue: (k: number) => void;
  markPosted: (id: string) => void;
  removeQueued: (id: string) => void;
  startEdit: (id: string) => void;
  commitEdit: (id: string, text: string) => void;
}

function findIdx(ops: Op[], id: string): number {
  return ops.findIndex((o) => o._id === id);
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      tab: "briefing",
      platform: "x",
      niche: "AI stock research tools",
      ops: seedOps("x"),
      sel: 0,
      scanning: false,
      drafts: {},
      draftBusy: null,
      queue: [],
      editId: null,
      voice: null,
      voiceBusy: false,
      studio: null,
      studioBusy: false,
      demoMode: true,
      apiKey: "",
      model: "claude-sonnet-4-6",

      setTab: (t) => set({ tab: t }),
      setPlatform: (p) =>
        set({ platform: p, ops: seedOps(p), drafts: {}, studio: null, sel: 0, demoMode: true }),
      setNiche: (n) => set({ niche: n || get().niche }),
      setApiKey: (k) => set({ apiKey: k }),
      setModel: (m) => set({ model: m }),
      setSel: (i) => set({ sel: i }),

      scan: async () => {
        const { apiKey, model, niche, platform } = get();
        set({ scanning: true, sel: 0, drafts: {} });
        try {
          const out = await scanOps(apiKey, model, niche, platform);
          set({ ops: out.map((o, i) => ({ ...o, _id: `${Date.now()}-${i}` })), demoMode: false });
        } catch {
          set({
            ops: DEMO[platform].map((o, i) => ({ ...o, _id: `d${Date.now()}${i}` })),
            demoMode: true,
          });
        }
        set({ scanning: false });
      },

      genDrafts: async (id) => {
        const { ops, apiKey, model, platform, voice } = get();
        const op = ops[findIdx(ops, id)];
        if (!op) return;
        set({ draftBusy: id });
        try {
          const d = await genReplies(apiKey, model, platform, op, voice ? voice.voice_dna : null);
          set((s) => ({ drafts: { ...s.drafts, [id]: d }, demoMode: false }));
        } catch {
          set((s) => ({ drafts: { ...s.drafts, [id]: demoDrafts(!!get().voice) }, demoMode: true }));
        }
        set({ draftBusy: null });
      },

      trainVoice: async (samples) => {
        const { apiKey, model } = get();
        set({ voiceBusy: true });
        try {
          set({ voice: await analyzeVoice(apiKey, model, samples), demoMode: false });
        } catch {
          set({ voice: DEMO_VOICE, demoMode: true });
        }
        set({ voiceBusy: false });
      },

      studioGen: async (seed) => {
        const { apiKey, model, niche, platform, voice } = get();
        set({ studioBusy: true, studio: null });
        try {
          const out = await genStudio(apiKey, model, niche, platform, seed, voice ? voice.voice_dna : null);
          set({ studio: out, demoMode: false });
        } catch {
          set({ studio: DEMO_STUDIO, demoMode: true });
        }
        set({ studioBusy: false });
      },

      approve: (id, k) => {
        const { ops, drafts, platform } = get();
        const i = findIdx(ops, id);
        if (i < 0) return;
        const op = ops[i];
        const d = (drafts[id] || [])[k];
        if (!d) return;
        const item: QueueItem = {
          id: uid(),
          platform,
          target: (op.text || op.title || "").slice(0, 90),
          text: d.reply,
          sounds: d.sounds,
          safety: d.safety,
          note: d.note,
          status: "ready",
        };
        set((s) => ({ queue: [item, ...s.queue] }));
        get().dismiss(i);
      },

      dismiss: (i) =>
        set((s) => {
          const ops = s.ops.slice();
          ops.splice(i, 1);
          return { ops, sel: Math.min(s.sel, Math.max(0, ops.length - 1)) };
        }),

      snooze: (i) =>
        set((s) => {
          const ops = s.ops.slice();
          const [m] = ops.splice(i, 1);
          if (m) ops.push(m);
          return { ops };
        }),

      studioQueue: (k) => {
        const { studio, platform } = get();
        const sp = studio && studio[k];
        if (!sp) return;
        const item: QueueItem = {
          id: uid(),
          platform,
          target: "original post",
          text: sp.text,
          sounds: null,
          safety: sp.safety,
          note: sp.note,
          status: "ready",
        };
        set((s) => ({ queue: [item, ...s.queue] }));
      },

      markPosted: (id) =>
        set((s) => ({
          queue: s.queue.map((q) => (q.id === id ? { ...q, status: "posted" as const } : q)),
        })),

      removeQueued: (id) => set((s) => ({ queue: s.queue.filter((q) => q.id !== id) })),

      startEdit: (id) => set((s) => ({ editId: s.editId === id ? null : id })),

      commitEdit: (id, text) =>
        set((s) => ({
          editId: null,
          queue: s.queue.map((q) => (q.id === id ? { ...q, text } : q)),
        })),
    }),
    {
      name: DB_KEY,
      // Persist only durable, user-owned data; triage/studio are ephemeral.
      partialize: (s) => ({
        queue: s.queue,
        voice: s.voice,
        niche: s.niche,
        apiKey: s.apiKey,
        model: s.model,
      }),
    }
  )
);
