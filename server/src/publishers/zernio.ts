/**
 * zernio.ts — 官方 API 渠道(适合原创帖 + 排期)。当前的"官方 API 腿"。
 * 换成 Ayrshare / WoopSocial 时,照此文件实现一个新 Publisher 即可。
 * 依赖:@zernio/node
 */
import Zernio from "@zernio/node";
import type { Publisher, PublishInput, PublishResult, Platform } from "./types.js";

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

const zernio = new Zernio(); // 读 ZERNIO_API_KEY 环境变量

async function zernioPublish(i: PublishInput): Promise<PublishResult> {
  try {
    const body: Record<string, unknown> = {
      content: i.text,
      platforms: [{ platform: ZERNIO_PLATFORM[i.platform], accountId: i.externalAccountId }],
      ...(i.mediaUrls?.length ? { mediaUrls: i.mediaUrls } : {}),
      // 平台专属选项尽力透传(真 key 时按 zernio 文档校准字段名)
      ...(i.options ? { options: i.options } : {}),
    };
    if (i.scheduledFor) body.scheduledFor = i.scheduledFor;
    else body.publishNow = true;

    const { data } = await zernio.posts.createPost({ body: body as any });
    return {
      status: i.scheduledFor ? "scheduled" : "published",
      externalPostId: (data as any)?.id,
      publishedUrl: (data as any)?.url ?? (data as any)?.postUrl,
    };
  } catch (e: any) {
    return { status: "error", error: e?.message || String(e) };
  }
}

/** 拉真实互动数据,喂回「账号分析」看板和飞轮。 */
export async function zernioAnalytics(postId: string) {
  const { data } = await zernio.analytics.getAnalytics({ query: { postId } });
  return (data as any)?.analytics; // { views, likes, engagementRate, ... }
}

export const zernioPublisher: Publisher = {
  publish: zernioPublish,
  analytics: zernioAnalytics,
};
