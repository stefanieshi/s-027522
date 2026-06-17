/**
 * zernio.ts — 官方 API 渠道(适合原创帖 + 排期)。"官方 API 腿"。
 * 换成 Ayrshare / WoopSocial 时,照此文件实现一个新 Publisher 即可。
 * 依赖:@zernio/node(字段名按 SDK 真实 schema 校准:content / platforms[].accountId /
 * mediaItems[] / scheduledFor|publishNow;响应 data.post._id + platforms[].platformPostUrl)。
 */
import Zernio from "@zernio/node";
import type { Publisher, PublishInput, PublishResult, Platform, PublishOptions } from "./types.js";
import { cfg } from "../config.js";

/* 平台名映射:我们 app 用 'x',zernio 用 'twitter' */
const ZERNIO_PLATFORM: Record<Platform, string> = {
  x: "twitter",
  tiktok: "tiktok",
  instagram: "instagram",
  reddit: "reddit",
  youtube: "youtube",
  linkedin: "linkedin",
  facebook: "facebook",
};
/* 反向:zernio 平台名 → 我们的 */
const APP_PLATFORM: Record<string, string> = { twitter: "x" };

/**
 * 懒加载客户端:`new Zernio()` 在缺少 ZERNIO_API_KEY 时会抛错。
 * 不能在模块顶层构造(否则没配 key 的环境一启动就崩,manual/morelogin 也跟着挂)。
 * 只有真正用到 zernio 渠道时才构造,缺 key 时给清晰错误。
 */
let _client: Zernio | null = null;
let _clientKey: string | undefined;
function client(): Zernio {
  const key = cfg("ZERNIO_API_KEY"); // 存储优先,回退 env
  if (!key) throw new Error("Zernio 未配置:在网页「设置 → 连接」填 ZERNIO_API_KEY(或 server/.env)");
  if (_client && _clientKey === key) return _client; // key 变了就重建
  try {
    _client = new Zernio({ apiKey: key });
    _clientKey = key;
    return _client;
  } catch (e: any) {
    throw new Error("Zernio 未配置:" + (e?.message || String(e)));
  }
}

function guessMediaType(url: string): "image" | "video" | "gif" | "document" {
  const u = url.toLowerCase().split("?")[0];
  if (/\.(mp4|mov|webm|m4v|avi)$/.test(u)) return "video";
  if (/\.gif$/.test(u)) return "gif";
  if (/\.(pdf|docx?|pptx?)$/.test(u)) return "document";
  return "image";
}

/** 把我们的 PublishOptions 映射成 zernio 的 platformSpecificData(只对支持的平台)。 */
function platformSpecificData(platform: Platform, o?: PublishOptions): Record<string, unknown> | undefined {
  if (!o) return undefined;
  if (platform === "tiktok") {
    const d: Record<string, unknown> = {};
    if (o.privacy != null) d.privacyLevel = o.privacy;
    if (o.disableComment != null) d.allowComment = !o.disableComment;
    if (o.disableDuet != null) d.allowDuet = !o.disableDuet;
    if (o.disableStitch != null) d.allowStitch = !o.disableStitch;
    return Object.keys(d).length ? d : undefined;
  }
  if (platform === "youtube") {
    const d: Record<string, unknown> = {};
    if (o.madeForKids != null) d.madeForKids = o.madeForKids;
    if (o.categoryId != null) d.categoryId = o.categoryId;
    if (o.privacy != null) d.visibility = o.privacy;
    return Object.keys(d).length ? d : undefined;
  }
  return undefined;
}

async function zernioPublish(i: PublishInput): Promise<PublishResult> {
  if (!i.externalAccountId) {
    return { status: "error", error: "缺少 Zernio 账号 id(先在设置里选要发的已连接账号)" };
  }
  let z: Zernio;
  try {
    z = client();
  } catch (e: any) {
    return { status: "error", error: e?.message || String(e) };
  }
  try {
    const psd = platformSpecificData(i.platform, i.options);
    const body: Record<string, unknown> = {
      content: i.text,
      platforms: [
        {
          platform: ZERNIO_PLATFORM[i.platform],
          accountId: i.externalAccountId,
          ...(psd ? { platformSpecificData: psd } : {}),
        },
      ],
      ...(i.mediaUrls?.length ? { mediaItems: i.mediaUrls.map((url) => ({ type: guessMediaType(url), url })) } : {}),
    };
    if (i.scheduledFor) body.scheduledFor = i.scheduledFor;
    else body.publishNow = true;

    const { data } = await z.posts.createPost({ body: body as any, throwOnError: true });
    const post: any = (data as any)?.post;
    const target = post?.platforms?.find((p: any) => p?.platformPostUrl) ?? post?.platforms?.[0];
    return {
      status: i.scheduledFor ? "scheduled" : "published",
      externalPostId: post?._id,
      publishedUrl: target?.platformPostUrl,
    };
  } catch (e: any) {
    return { status: "error", error: e?.message || String(e) };
  }
}

/** 拉真实互动数据,喂回「账号分析」看板和飞轮。返回 { views, likes, engagementRate, ... }。 */
export async function zernioAnalytics(postId: string) {
  const { data } = await client().analytics.getAnalytics({ query: { postId }, throwOnError: true });
  return (data as any)?.analytics; // AnalyticsSinglePostResponse.analytics
}

/** 列出 zernio 已连接的社媒账号,供前端把"内部账号 → zernio accountId"对应起来。 */
export async function zernioListAccounts() {
  const { data } = await client().accounts.listAccounts({ throwOnError: true });
  const accounts: any[] = (data as any)?.accounts || [];
  return accounts.map((a) => ({
    id: a._id, // 发布时作为 platforms[].accountId
    platform: APP_PLATFORM[a.platform] ?? a.platform,
    username: a.username,
    displayName: a.displayName,
    profileUrl: a.profileUrl,
    isActive: a.isActive,
  }));
}

export const zernioPublisher: Publisher = {
  publish: zernioPublish,
  analytics: zernioAnalytics,
};
