/**
 * publishers.ts — Vibe Marketer 发布集成层
 * 三个渠道:manual(安全默认)/ zernio(官方 API)/ morelogin(指纹浏览器)
 *
 * ★ 安全地基(写死,别改):reply 和 dm 永远走 manual。
 *   X 明令禁止自动化 DM;自动群发回复触发 spam 检测 → 封号。
 *
 * 依赖:@zernio/node, playwright   (见 package.json)
 */
import Zernio from '@zernio/node';
import { chromium } from 'playwright';

export type Platform = 'x' | 'tiktok' | 'instagram' | 'reddit' | 'youtube' | 'linkedin' | 'facebook';
export type ActionKind = 'post' | 'reply' | 'dm';
export type Channel = 'manual' | 'zernio' | 'morelogin';

export interface PublishInput {
  accountId: string;          // 你 app 内部的账号 id
  externalAccountId?: string; // zernio 的 account_id 或 morelogin 的 profile/uniqueId
  platform: Platform;
  kind: ActionKind;           // post / reply / dm
  text: string;
  mediaUrls?: string[];
  scheduledFor?: string;      // ISO 时间;给了就排期,不给就立即发
  targetUrl?: string;         // reply 用:被回复的推文 URL
}
export interface PublishResult {
  status: 'published' | 'scheduled' | 'manual' | 'error';
  externalPostId?: string;
  openUrl?: string;           // manual 渠道:原生发送框 deeplink
  error?: string;
}

/* 平台名映射:我们 app 用 'x',zernio 用 'twitter' */
const ZERNIO_PLATFORM: Record<Platform, string> = {
  x: 'twitter', tiktok: 'tiktok', instagram: 'instagram', reddit: 'reddit',
  youtube: 'youtube', linkedin: 'linkedin', facebook: 'facebook',
};

/* ===================== 安全策略 ===================== */
/** reply / dm 强制 manual,不管前端选了什么渠道 */
export function resolveChannel(requested: Channel, kind: ActionKind): Channel {
  if (kind === 'reply' || kind === 'dm') return 'manual';
  return requested;
}

/* ===================== MANUAL(安全默认) ===================== */
/** 不在服务端发,只返回原生发送框链接,由人工按发 */
function manualPublish(i: PublishInput): PublishResult {
  let openUrl = '';
  if (i.platform === 'x') {
    if (i.kind === 'dm') {
      openUrl = 'https://x.com/messages/compose?text=' + encodeURIComponent(i.text);
    } else if (i.kind === 'reply') {
      const id = (i.targetUrl || '').match(/status\/(\d+)/)?.[1];
      openUrl = 'https://x.com/intent/tweet?text=' + encodeURIComponent(i.text) + (id ? '&in_reply_to=' + id : '');
    } else {
      openUrl = 'https://x.com/compose/post';
    }
  } else {
    openUrl = ({
      tiktok: 'https://www.tiktok.com/upload',
      instagram: 'https://www.instagram.com',
      reddit: 'https://www.reddit.com/submit',
      youtube: 'https://studio.youtube.com',
      linkedin: 'https://www.linkedin.com/feed/',
      facebook: 'https://www.facebook.com',
    } as Record<string, string>)[i.platform] || '';
  }
  return { status: 'manual', openUrl };
}

/* ===================== ZERNIO(官方 API,适合原创帖 + 排期) ===================== */
const zernio = new Zernio(); // 读 ZERNIO_API_KEY 环境变量

async function zernioPublish(i: PublishInput): Promise<PublishResult> {
  try {
    const body: Record<string, unknown> = {
      content: i.text,
      platforms: [{ platform: ZERNIO_PLATFORM[i.platform], accountId: i.externalAccountId }],
      ...(i.mediaUrls?.length ? { mediaUrls: i.mediaUrls } : {}),
    };
    if (i.scheduledFor) body.scheduledFor = i.scheduledFor;
    else body.publishNow = true;

    const { data } = await zernio.posts.createPost({ body: body as any });
    return { status: i.scheduledFor ? 'scheduled' : 'published', externalPostId: (data as any)?.id };
  } catch (e: any) {
    return { status: 'error', error: e?.message || String(e) };
  }
}

/** 拉真实互动数据,喂回「账号分析」看板和飞轮 */
export async function zernioAnalytics(postId: string) {
  const { data } = await zernio.analytics.getAnalytics({ query: { postId } });
  return (data as any)?.analytics; // { views, likes, engagementRate, ... }
}

/* ===================== MORELOGIN(指纹浏览器,适合矩阵号 / 无 API 平台) ===================== */
const ML_BASE = process.env.MORELOGIN_LOCAL_API || 'http://127.0.0.1:40000';

/** 启动指纹浏览器 profile,拿到动态 CDP 调试端口 */
async function mlStart(profileId: string): Promise<{ debugPort: number }> {
  const res = await fetch(ML_BASE + '/api/env/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 部分 MoreLogin 版本本地 API 需要鉴权头,按你的版本补;不需要就留空
      ...(process.env.MORELOGIN_API_ID ? { 'X-Api-Id': process.env.MORELOGIN_API_ID } : {}),
    },
    body: JSON.stringify({ uniqueId: profileId }), // 或 { envId: profileId }
  });
  const j: any = await res.json();
  const debugPort = j?.data?.debugPort ?? j?.debugPort;
  if (!debugPort) throw new Error('MoreLogin start 失败:' + JSON.stringify(j).slice(0, 200));
  return { debugPort };
}

/**
 * 用指纹浏览器驱动平台 composer 发帖。
 * 默认 autoSubmit=false:打开预填好的发送框,留人工按「发布」(最安全)。
 * 各平台 composer 选择器不同,这里给 X 原创帖示例,其它平台照此扩展。
 */
async function moreloginPublish(i: PublishInput, opts: { autoSubmit?: boolean } = {}): Promise<PublishResult> {
  if (!i.externalAccountId) return { status: 'error', error: '缺少 morelogin profile id' };
  try {
    const { debugPort } = await mlStart(i.externalAccountId);
    const browser = await chromium.connectOverCDP('http://127.0.0.1:' + debugPort);
    const ctx = browser.contexts()[0] || (await browser.newContext());
    const page = await ctx.newPage();

    if (i.platform === 'x') {
      await page.goto('https://x.com/compose/post');
      await page.waitForSelector('[data-testid="tweetTextarea_0"]', { timeout: 20000 });
      // 拟人化输入:逐字 + 随机延迟
      await page.type('[data-testid="tweetTextarea_0"]', i.text, { delay: 30 + Math.random() * 60 });
      if (opts.autoSubmit) {
        await page.click('[data-testid="tweetButton"]');
        await page.waitForTimeout(2500);
      }
      // 默认不点发布,留给人工
    } else {
      // TODO: 让 Claude Code 补 tiktok / instagram / reddit 等平台的 composer 流程
      return { status: 'error', error: 'morelogin 暂未实现该平台 composer:' + i.platform };
    }

    return { status: opts.autoSubmit ? 'published' : 'manual' };
  } catch (e: any) {
    return { status: 'error', error: e?.message || String(e) };
  }
}

/* ===================== 路由 ===================== */
export async function publish(i: PublishInput, requested: Channel): Promise<PublishResult> {
  const channel = resolveChannel(requested, i.kind); // 安全策略先生效
  switch (channel) {
    case 'manual': return manualPublish(i);
    case 'zernio': return zernioPublish(i);
    case 'morelogin': return moreloginPublish(i, { autoSubmit: process.env.MORELOGIN_AUTO_SUBMIT === 'true' });
    default: return { status: 'error', error: '未知渠道' };
  }
}
