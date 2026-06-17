import type { Platform, DraftType, ViewId } from "./types";

export const PLATFORMS: Platform[] = ["x", "tiktok", "instagram", "reddit"];

export const PLAT_LABEL: Record<Platform, string> = {
  x: "X",
  tiktok: "TikTok",
  instagram: "Instagram",
  reddit: "Reddit",
};

export const PLAT_TIME: Record<Platform, string> = {
  x: "09:00",
  tiktok: "16:00",
  instagram: "12:00",
  reddit: "20:00",
};

export const TYPES: Record<DraftType, string> = {
  x_post: "X 原创帖",
  tiktok_script: "TikTok 脚本",
  ig_caption: "IG 文案",
  reddit_post: "Reddit 帖",
};

export const DEFAULT_TYPE: Record<Platform, DraftType> = {
  x: "x_post",
  tiktok: "tiktok_script",
  instagram: "ig_caption",
  reddit: "reddit_post",
};

export const AV = ["#E8553D", "#4F6EF2", "#2FA36B", "#B5840F", "#7A4FB5", "#0E7490"];

export const MODELS = ["claude-sonnet-4-6", "claude-opus-4-8", "claude-haiku-4-5-20251001"];

export const CHANNELS: { value: "manual" | "zernio" | "morelogin"; label: string; hint: string }[] = [
  { value: "manual", label: "manual · 人工按发(最安全)", hint: "后端只返回原生发送框 deeplink,你按发送" },
  { value: "zernio", label: "zernio · 官方 API(原创帖+排期)", hint: "需 ZERNIO_API_KEY;适合原创帖自动发/排期" },
  { value: "morelogin", label: "morelogin · 指纹浏览器(矩阵号)", hint: "需本机 MoreLogin 客户端 + Playwright" },
];

export const META: Record<ViewId, { eb: string; t: string; d: string }> = {
  today: {
    eb: "近 30 天热门内容驱动",
    t: "今天的社媒任务",
    d: "内容已自动生成好,你只需审一眼、批准、发送。AI 起草、你把守发布——这是防封的安全主线。",
  },
  calendar: {
    eb: "排期总览",
    t: "日历排期",
    d: "每天发了多少、X 帖怎么错峰排的,一眼看清。✓ 绿=已发布,⏳ 黄=已排期。点某天看明细。",
  },
  inbox: {
    eb: "互动引擎",
    t: "收件箱",
    d: "对方主动发来的评论/私信,助手已草好回复,你确认后一键打开原生发送框发出。",
  },
  analytics: {
    eb: "账号看板",
    t: "账号分析",
    d: "各账号的产出、排期、爆款率、人格契合度。把表现和人格放在一起看,知道哪个号在打。",
  },
  voice: {
    eb: "配置",
    t: "话术与人格",
    d: "每个账号一套独立人格 + 通用回复话术 + 爆款 pattern 库。这是自动生成质量的来源。",
  },
  settings: {
    eb: "配置",
    t: "设置",
    d: "接 Anthropic key 让 Claude 真正起草;时间设置控制 X 帖错峰;留空则用 mock 体验全流程。",
  },
};
