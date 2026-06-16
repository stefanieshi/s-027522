/**
 * publishers/types.ts — 发布层共享类型 + Publisher 适配器接口。
 * 换供应商(Ayrshare / WoopSocial …)= 新增一个实现该接口的文件,
 * 不动前端、不动调度/回收。
 */
export type Platform = "x" | "tiktok" | "instagram" | "reddit" | "youtube" | "linkedin" | "facebook";
export type ActionKind = "post" | "reply" | "dm";
export type Channel = "manual" | "zernio" | "morelogin";

export interface PublishInput {
  accountId: string; // 你 app 内部的账号 id
  externalAccountId?: string; // zernio 的 account_id 或 morelogin 的 profile/uniqueId
  platform: Platform;
  kind: ActionKind; // post / reply / dm
  text: string;
  mediaUrls?: string[];
  scheduledFor?: string; // ISO 时间;给了就排期,不给就立即发
  targetUrl?: string; // reply 用:被回复的推文 URL
}

export interface PublishResult {
  status: "published" | "scheduled" | "manual" | "error";
  externalPostId?: string;
  openUrl?: string; // manual 渠道:原生发送框 deeplink
  error?: string;
}

/** 一个发布渠道的适配器。analytics 可选(只有官方 API 渠道支持)。 */
export interface Publisher {
  publish(input: PublishInput): Promise<PublishResult>;
  analytics?(externalPostId: string): Promise<unknown>;
}
