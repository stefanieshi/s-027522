import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AV } from "./lib/constants";
import { uid } from "./lib/utils";
import type { AppData, ViewId } from "./lib/types";
import type { ReactNode } from "react";

const DB_KEY = "vibe_marketer_v2";

function freshState(): AppData {
  return {
    accounts: [],
    swipes: [],
    drafts: [],
    inbox: [],
    templates: {
      comment: "Love your work, {name}! 真的做得很好 🙌 我们在做一个帮 creator 增长的小工具,想看的话回我。",
      dm: "Hey {name}! 看到你的 {platform} 内容了,很喜欢。我们在为 creator 做点东西,要不要发你一个抢先看?",
    },
    settings: {
      apiKey: "",
      model: "claude-sonnet-4-6",
      simThreshold: 0.5,
      postStartHour: 9,
      postEndHour: 22,
      minGapMin: 45,
      dailyPerAccount: 2,
      autoReply: true,
      useBackend: false,
      apiBase: "http://localhost:8787",
      channel: "manual",
    },
  };
}

function seeded(): AppData {
  const s = freshState();
  s.accounts = [
    { id: uid(), handle: "@buildinpublic_jay", platform: "x", color: AV[0], persona: { voice: "有棱角的独立开发者,短句,敢下判断", stance: "反共识、proof-of-work、不卖课", taboo: "套话, 营销腔, 夸大", format: "1 句钩子 + 编号清单 + 反问" } },
    { id: uid(), handle: "@quant_signal_desk", platform: "x", color: AV[5], persona: { voice: "冷静、数据驱动,像交易台快报", stance: "只讲数据,不荐股", taboo: "荐股, 保证收益", format: "数据点 + 一句解读" } },
    { id: uid(), handle: "@studywith.maya", platform: "tiktok", color: AV[1], persona: { voice: "亲切学生 UGC,口语,faceless 旁白", stance: "真实、可复现、晒过程", taboo: "夸大, 完美人设", format: "3 秒钩子 + 演示 + 行动号召" } },
    { id: uid(), handle: "u/quiet_builder", platform: "reddit", color: AV[2], persona: { voice: "谦逊 builder,分享成果不推销", stance: "先给价值,产品被问到才提", taboo: "硬广, 链接轰炸", format: "复盘体长文" } },
  ];
  s.swipes = [
    {
      id: uid(),
      platform: "x",
      source: "@某竞品",
      metrics: "2.1M·P98",
      raw: "大多数 AI 增长工具都在教你怎么被封号。这是反过来的做法 ↓",
      teardown: { hook_type: "反共识开场", structure: "钩子→编号清单→反问", emotional_trigger: "逆反+省时间", why_it_worked: "高信念立场,在 AI 填充物里显得真实" },
      pattern: { id: "contrarian_listicle", template: '"大多数人都在[做 X]。这是[反做法] ↓" + 编号清单 + 反问' },
    },
  ];
  s.inbox = [
    { id: uid(), platform: "x", from: "@AIVideoCreator", color: AV[1], msg: "你的工具能同时管理几个账号?手动发太累了", reply: "", status: "new", flagged: false },
    { id: uid(), platform: "tiktok", from: "DreamyAI", color: AV[2], msg: "Can I monetize my videos with this?", reply: "", status: "new", flagged: false },
    { id: uid(), platform: "x", from: "LegalEagle", color: AV[3], msg: "What about copyright if I replicate viral content?", reply: "", status: "new", flagged: true },
    { id: uid(), platform: "tiktok", from: "AnonUser", color: AV[5], msg: "Can you guarantee traffic / viral?", reply: "", status: "new", flagged: true },
  ];
  return s;
}

interface DataStore {
  data: AppData;
  /** Apply a mutation against a structural clone of the data, then persist. */
  setData: (mutate: (d: AppData) => void) => void;
  /** Replace the whole dataset (import / reset). */
  replace: (d: AppData) => void;
  resetSeed: () => void;
}

export const useData = create<DataStore>()(
  persist(
    (set) => ({
      data: seeded(),
      setData: (mutate) =>
        set((s) => {
          const next = structuredClone(s.data);
          mutate(next);
          return { data: next };
        }),
      replace: (d) => set({ data: d }),
      resetSeed: () => set({ data: seeded() }),
    }),
    {
      name: DB_KEY,
      partialize: (s) => ({ data: s.data }),
      // backfill any keys added in later versions onto older saves
      merge: (persisted, current) => {
        const p = persisted as { data?: Partial<AppData> } | undefined;
        if (!p?.data) return current;
        const base = freshState();
        return {
          ...current,
          data: {
            ...base,
            ...p.data,
            templates: { ...base.templates, ...p.data.templates },
            settings: { ...base.settings, ...p.data.settings },
          },
        };
      },
      // migrate the legacy single-file prototype save if present
      onRehydrateStorage: () => () => {
        try {
          const legacy = localStorage.getItem("hermes_v2");
          if (legacy && !localStorage.getItem(DB_KEY)) {
            const parsed = JSON.parse(legacy);
            useData.setState({ data: { ...seeded(), ...parsed } });
          }
        } catch {
          /* ignore */
        }
      },
    }
  )
);

export { freshState, seeded };

/* ===================== ephemeral UI store ===================== */
interface UiStore {
  view: ViewId;
  expanded: Record<string, boolean>;
  voiceTab: "persona" | "tmpl" | "swipe";
  calMonth: { y: number; m: number } | null;
  toastMsg: string;
  modal: ReactNode | null;
  go: (v: ViewId) => void;
  toggleExpanded: (p: string) => void;
  setExpanded: (p: string, v: boolean) => void;
  setVoiceTab: (t: "persona" | "tmpl" | "swipe") => void;
  setCalMonth: (m: { y: number; m: number } | null) => void;
  toast: (m: string) => void;
  openModal: (node: ReactNode) => void;
  closeModal: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useUi = create<UiStore>((set) => ({
  view: "today",
  expanded: {},
  voiceTab: "persona",
  calMonth: null,
  toastMsg: "",
  modal: null,
  go: (v) => set({ view: v, expanded: {} }),
  toggleExpanded: (p) => set((s) => ({ expanded: { ...s.expanded, [p]: !s.expanded[p] } })),
  setExpanded: (p, v) => set((s) => ({ expanded: { ...s.expanded, [p]: v } })),
  setVoiceTab: (t) => set({ voiceTab: t }),
  setCalMonth: (m) => set({ calMonth: m }),
  toast: (m) => {
    set({ toastMsg: m });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toastMsg: "" }), 2200);
  },
  openModal: (node) => set({ modal: node }),
  closeModal: () => set({ modal: null }),
}));
