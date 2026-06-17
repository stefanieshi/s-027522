/**
 * llm.ts — 服务端 LLM(给监控器草拟大V回复用)。
 * 用 ANTHROPIC_API_KEY 调 Claude;没 key → 返回 mock 草稿(仍照常通知/approve)。
 * 敏感(法律/版权/担保流量等)→ flagged,给克制、不做承诺的回应。
 */
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";

export interface DraftedReply {
  reply: string;
  flagged: boolean;
}

function mockReply(postText: string, guideline?: string): DraftedReply {
  const flagged = /(lawsuit|copyright|guarantee|版权|法律|担保|保证)/i.test(postText);
  if (flagged) {
    return { reply: "这点我想认真回应、不想给不准确的承诺,稍后我详细回你一下 🙏", flagged: true };
  }
  const base = (guideline || "真诚、有价值、像人不像群发").slice(0, 40);
  const hook = postText.split(/\n/)[0].slice(0, 40);
  return { reply: `（mock·${base}）就「${hook}」这点,我的经验是先小范围验证再放量,踩过的坑可以聊聊。`, flagged: false };
}

export async function draftReply(opts: {
  postText: string;
  author?: string;
  platform?: string;
  guideline?: string;
  persona?: string;
}): Promise<DraftedReply> {
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key) return mockReply(opts.postText, opts.guideline);

  const sys =
    "你是社媒互动助手,帮我给关注的大V新帖草拟一条 warm、有价值、像真人、不像群发的公开回复(≤220字符)。" +
    "结合我的人格与基调;给观点或具体经验,不奉承、不硬广。" +
    "若帖子涉及法律/版权/担保流量等敏感话题,flagged=true 且回应克制、诚实、不做承诺。" +
    '只输出 JSON:{"reply":"","flagged":false}';
  const usr = `平台:${opts.platform || ""}\n大V:${opts.author || ""}\n我的人格:${opts.persona || "(无)"}\n回复基调:${opts.guideline || "(无)"}\n大V新帖:"""${opts.postText}"""`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: sys, messages: [{ role: "user", content: usr }] }),
    });
    if (!res.ok) throw new Error("API " + res.status);
    const data: any = await res.json();
    let t = (data.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("\n").trim();
    t = t.replace(/```json/gi, "").replace(/```/g, "").trim();
    const a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a >= 0 && b > a) t = t.slice(a, b + 1);
    const j = JSON.parse(t);
    return { reply: j.reply || "", flagged: !!j.flagged };
  } catch {
    return mockReply(opts.postText, opts.guideline);
  }
}
