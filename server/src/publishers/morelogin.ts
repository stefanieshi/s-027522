/**
 * morelogin.ts — 指纹浏览器渠道(矩阵号 / 无 API 平台)。
 * 默认 autoSubmit=false:打开预填好的发送框,留人工按「发布」(最安全)。
 * 各平台 composer 选择器不同,这里给 X 原创帖示例,其它平台照此扩展。
 * 依赖:playwright;MoreLogin 客户端须在本机运行且已登录。
 */
import { chromium } from "playwright";
import type { Publisher, PublishInput, PublishResult } from "./types.js";

const ML_BASE = process.env.MORELOGIN_LOCAL_API || "http://127.0.0.1:40000";

/** 启动指纹浏览器 profile,拿到动态 CDP 调试端口 */
async function mlStart(profileId: string): Promise<{ debugPort: number }> {
  const res = await fetch(ML_BASE + "/api/env/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.MORELOGIN_API_ID ? { "X-Api-Id": process.env.MORELOGIN_API_ID } : {}),
    },
    body: JSON.stringify({ uniqueId: profileId }), // 或 { envId: profileId }
  });
  const j: any = await res.json();
  const debugPort = j?.data?.debugPort ?? j?.debugPort;
  if (!debugPort) throw new Error("MoreLogin start 失败:" + JSON.stringify(j).slice(0, 200));
  return { debugPort };
}

async function moreloginPublish(i: PublishInput, opts: { autoSubmit?: boolean } = {}): Promise<PublishResult> {
  if (!i.externalAccountId) return { status: "error", error: "缺少 morelogin profile id" };
  try {
    const { debugPort } = await mlStart(i.externalAccountId);
    const browser = await chromium.connectOverCDP("http://127.0.0.1:" + debugPort);
    const ctx = browser.contexts()[0] || (await browser.newContext());
    const page = await ctx.newPage();

    if (i.platform === "x") {
      await page.goto("https://x.com/compose/post");
      await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 20000 });
      // 拟人化输入:逐字 + 随机延迟
      await page.type('[data-testid="tweetTextarea_0"]', i.text, { delay: 30 + Math.random() * 60 });
      if (opts.autoSubmit) {
        await page.click('[data-testid="tweetButton"]');
        await page.waitForTimeout(2500);
      }
      // 默认不点发布,留给人工
    } else {
      // TODO: 补 tiktok / instagram / reddit 等平台的 composer 流程
      return { status: "error", error: "morelogin 暂未实现该平台 composer:" + i.platform };
    }

    return { status: opts.autoSubmit ? "published" : "manual" };
  } catch (e: any) {
    return { status: "error", error: e?.message || String(e) };
  }
}

export const moreloginPublisher: Publisher = {
  publish: (i) => moreloginPublish(i, { autoSubmit: process.env.MORELOGIN_AUTO_SUBMIT === "true" }),
};
