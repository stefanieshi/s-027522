import { PLAT_LABEL, TYPES } from "./constants";
import { uid } from "./utils";
import type { Account, Draft, DraftType, InboxItem, Settings, Swipe, Teardown, Pattern, Templates } from "./types";

/**
 * Calls Anthropic Messages API directly from the browser (prototype/MVP mode).
 * For a real product, proxy this through the backend so the key never ships to
 * the client — see BUILD-WITH-CLAUDE-CODE.md.
 */
export async function callClaude(settings: Settings, system: string, user: string, maxTokens = 850): Promise<string> {
  const key = settings.apiKey.trim();
  if (!key) throw new Error("NO_KEY");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: settings.model || "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error("API " + res.status + ": " + (await res.text()).slice(0, 160));
  const data = await res.json();
  return (data.content || [])
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n")
    .trim();
}

function parseJSON(t: string): any {
  t = t.replace(/```json/gi, "").replace(/```/g, "").trim();
  const a = t.indexOf("{"),
    b = t.lastIndexOf("}");
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  return JSON.parse(t);
}

/* ===================== swipe teardown ===================== */
export async function teardownSwipe(settings: Settings, sw: Swipe): Promise<{ teardown: Teardown; pattern: Pattern }> {
  const sys =
    '你是爆款拆解专家。只输出严格 JSON:{"hook_type":"","structure":"","emotional_trigger":"","why_it_worked":"","pattern_template":""} pattern_template 必须是抽象可迁移的结构模板,不含原文具体内容。';
  const usr = `平台:${PLAT_LABEL[sw.platform]}\n内容:"""${sw.raw}"""\n拆解为什么爆并抽象成 pattern。`;
  try {
    const j = parseJSON(await callClaude(settings, sys, usr, 650));
    return {
      teardown: {
        hook_type: j.hook_type || "",
        structure: j.structure || "",
        emotional_trigger: j.emotional_trigger || "",
        why_it_worked: j.why_it_worked || "",
      },
      pattern: {
        id: (j.pattern_template || "pattern").slice(0, 22).replace(/\s+/g, "_").toLowerCase(),
        template: j.pattern_template || "",
      },
    };
  } catch (e: any) {
    if (e.message === "NO_KEY")
      return {
        teardown: {
          hook_type: "反共识/好奇钩子",
          structure: "钩子→清单→反问",
          emotional_trigger: "好奇+认同",
          why_it_worked: "(mock)立场鲜明,信息密度高",
        },
        pattern: { id: "hook_list_q", template: '(mock) "[反直觉论断] ↓" + 要点清单 + 反问' },
      };
    throw e;
  }
}

/* ===================== draft generation ===================== */
function getMemory(drafts: Draft[], id: string): { top: string[]; flop: string[] } {
  const d = drafts.filter((x) => x.account_id === id && x.result);
  return {
    top: d.filter((x) => x.result!.tier === "win").map((x) => x.hook || x.topic).filter(Boolean),
    flop: d.filter((x) => x.result!.tier === "flop").map((x) => x.hook || x.topic).filter(Boolean),
  };
}

function mockDraft(_a: Account, type: DraftType, topic: string) {
  const tp = topic || "今天的角度";
  const s: Record<DraftType, { hook: string; body: string; cta: string }> = {
    x_post: {
      hook: `大多数人做 ${tp} 都搞反了。`,
      body: `我试了 4 个号 7 天,真正有用的 3 件事:\n1) 先差异化人格\n2) 拆结构不抄内容\n3) 自己手动发`,
      cta: "你卡在哪步?",
    },
    tiktok_script: {
      hook: `我室友用这个搞定了 ${tp}……`,
      body: "[分镜1] 痛点\n[分镜2] 屏幕演示三步\n[分镜3] 结果对比",
      cta: "要模板评论扣 1",
    },
    ig_caption: {
      hook: `关于 ${tp},没人告诉你的一点 👇`,
      body: "省流三步,亲测可复现。",
      cta: "收藏 · #vibemarketing #buildinpublic #ai",
    },
    reddit_post: {
      hook: `我用 48 小时做完了 ${tp},踩的 5 个坑`,
      body: "纯复盘,数据都在正文。不卖东西。",
      cta: "",
    },
  };
  return { ...s[type], disclosure_required: /产品|课|工具|我的/.test(tp), hook_strength: 0.76, persona_fit: 0.82 };
}

function draftObj(a: Account, type: DraftType, topic: string, j: any): Draft {
  return {
    id: uid(),
    account_id: a.id,
    platform: a.platform,
    type,
    topic: topic || "",
    hook: j.hook || "",
    body: j.body || "",
    cta: j.cta || "",
    disclosure_required: !!j.disclosure_required,
    self: { hook: +j.hook_strength || 0, persona: +j.persona_fit || 0 },
    patternId: null,
    scheduledAt: null,
    result: null,
    promoted: false,
    sim: null,
    status: "pending",
    created: Date.now(),
  };
}

export async function generateDraft(
  settings: Settings,
  drafts: Draft[],
  acct: Account,
  type: DraftType,
  topic: string,
  patternTemplate: string
): Promise<Draft> {
  const guide = {
    x_post: "X 原创帖,≤280 字符,开场即钩子。",
    tiktok_script: "短视频脚本:3 秒钩子+演示+行动号召,可附[分镜],faceless 友好。",
    ig_caption: "IG 文案:钩子首行+价值+轻 CTA+3-5 标签。",
    reddit_post: "Reddit:builder 分享口吻,纯价值,产品自然处轻提。",
  }[type];
  const sys =
    '你为特定账号写内容,严格按人格,只复用结构不照搬原文。只输出 JSON:{"hook":"","body":"","cta":"","disclosure_required":false,"hook_strength":0,"persona_fit":0}';
  const mem = getMemory(drafts, acct.id);
  const usr = `账号:${acct.handle}(${PLAT_LABEL[acct.platform]})\n人格:语气=${acct.persona.voice};立场=${acct.persona.stance};禁用=${acct.persona.taboo};格式=${acct.persona.format}\n类型:${TYPES[type]} — ${guide}\n角度:${topic || "(自拟一个贴合人格的角度)"}\n${patternTemplate ? "套用结构(只用结构):" + patternTemplate : ""}\n${mem.top.length ? "赢家钩子借鉴方向:" + mem.top.slice(0, 3).join(" | ") : ""}\n${mem.flop.length ? "避开这类角度:" + mem.flop.slice(0, 3).join(" | ") : ""}`;
  try {
    return draftObj(acct, type, topic, parseJSON(await callClaude(settings, sys, usr, 750)));
  } catch (e: any) {
    if (e.message === "NO_KEY") return draftObj(acct, type, topic, mockDraft(acct, type, topic));
    throw e;
  }
}

/* ===================== inbox replies ===================== */
function mockReply(item: InboxItem, templates: Templates) {
  if (item.flagged)
    return { reply: "好问题——这块我们想认真回答,不想给你不准确的承诺。我让团队同事详细回你一下 🙏", flagged: true };
  const name = item.from;
  const r = item.platform === "x" ? templates.comment : templates.dm;
  return {
    reply: r
      .replace(/{name}/g, name)
      .replace(/{platform}/g, PLAT_LABEL[item.platform])
      .replace(/{content}/g, ""),
    flagged: false,
  };
}

export async function generateReply(
  settings: Settings,
  accounts: Account[],
  templates: Templates,
  item: InboxItem
): Promise<{ reply: string; flagged: boolean }> {
  void accounts.find((x) => x.platform === item.platform); // persona context hook (kept for parity)
  const sys =
    "你是社媒互动回复助手。基于账号人格 + 话术模板,为收到的消息草一条 warm、个性化、不像群发的回复。若消息涉及法律/版权/担保流量等敏感问题,flagged=true 且 reply 给一个克制、诚实、不做承诺的回应并建议人工确认。只输出 JSON:{\"reply\":\"\",\"flagged\":false}";
  const usr = `平台:${PLAT_LABEL[item.platform]}\n对方:${item.from}\n消息:"""${item.msg}"""\n参考话术模板(评论):${templates.comment}\n(私信):${templates.dm}\n变量 {name}->${item.from} {platform}->${PLAT_LABEL[item.platform]}`;
  try {
    const j = parseJSON(await callClaude(settings, sys, usr, 400));
    return { reply: j.reply || "", flagged: !!j.flagged };
  } catch (e: any) {
    if (e.message === "NO_KEY") return mockReply(item, templates);
    throw e;
  }
}
