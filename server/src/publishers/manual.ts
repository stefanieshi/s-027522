/**
 * manual.ts — 安全默认渠道。不在服务端发,只返回原生发送框 deeplink,由人工按发。
 * reply / dm 永远被路由到这里(见 index.ts 的 resolveChannel)。
 */
import type { Publisher, PublishInput, PublishResult } from "./types.js";

function manualPublish(i: PublishInput): PublishResult {
  let openUrl = "";
  if (i.platform === "x") {
    if (i.kind === "dm") {
      openUrl = "https://x.com/messages/compose?text=" + encodeURIComponent(i.text);
    } else if (i.kind === "reply") {
      const id = (i.targetUrl || "").match(/status\/(\d+)/)?.[1];
      openUrl = "https://x.com/intent/tweet?text=" + encodeURIComponent(i.text) + (id ? "&in_reply_to=" + id : "");
    } else {
      openUrl = "https://x.com/compose/post";
    }
  } else {
    openUrl =
      (
        {
          tiktok: "https://www.tiktok.com/upload",
          instagram: "https://www.instagram.com",
          reddit: "https://www.reddit.com/submit",
          youtube: "https://studio.youtube.com",
          linkedin: "https://www.linkedin.com/feed/",
          facebook: "https://www.facebook.com",
        } as Record<string, string>
      )[i.platform] || "";
  }
  return { status: "manual", openUrl };
}

export const manualPublisher: Publisher = {
  publish: async (i) => manualPublish(i),
};
