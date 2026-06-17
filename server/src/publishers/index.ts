/**
 * publishers/index.ts — 渠道注册表 + 安全策略路由。
 *
 * ★ 安全地基(写死,别改):reply 和 dm 永远走 manual。
 *   X 明令禁止自动化 DM;自动群发回复触发 spam 检测 → 封号。
 *
 * 加新供应商:实现 Publisher(见 zernio.ts),在 REGISTRY 里登记一个新 channel 即可,
 * publish()/analytics 的对外签名不变,server/scheduler/analytics 零改动。
 */
import type { Channel, Publisher, PublishInput, PublishResult, ActionKind } from "./types.js";
import { manualPublisher } from "./manual.js";
import { zernioPublisher, zernioAnalytics, zernioListAccounts } from "./zernio.js";
import { moreloginPublisher } from "./morelogin.js";

export * from "./types.js";
export { zernioAnalytics, zernioListAccounts };

const REGISTRY: Record<Channel, Publisher> = {
  manual: manualPublisher,
  zernio: zernioPublisher,
  morelogin: moreloginPublisher,
};

/** reply / dm 强制 manual,不管前端选了什么渠道。 */
export function resolveChannel(requested: Channel, kind: ActionKind): Channel {
  if (kind === "reply" || kind === "dm") return "manual";
  return requested;
}

export async function publish(i: PublishInput, requested: Channel): Promise<PublishResult> {
  const channel = resolveChannel(requested, i.kind); // 安全策略先生效
  const publisher = REGISTRY[channel];
  if (!publisher) return { status: "error", error: "未知渠道" };
  return publisher.publish(i);
}
