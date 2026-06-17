import type { Platform } from "./types";

export interface TrendItem {
  platform: Platform;
  topic: string;
  score: number; // 热度 0-100
  example: string;
  tag?: string; // hashtag / 关键词
}

/** 无后端时的种子热点(让「今日趋势」开箱即有内容);接后端后用真实 inspiration 替代。 */
export const MOCK_TRENDS: TrendItem[] = [
  { platform: "x", topic: "独立开发者月入第一个 $10k", score: 78, tag: "buildinpublic", example: "我没融资、没团队,30 天做到 $10k MRR。复盘 3 个动作 ↓" },
  { platform: "x", topic: "为什么你的 X 涨粉停滞了", score: 81, tag: "growth", example: "涨粉停滞 90% 是因为你在发\"对的内容\"——但没人需要的内容。" },
  { platform: "x", topic: "AI agent 真能替代初级岗位了吗", score: 62, tag: "AIagents", example: "大多数人还在用 AI 写邮件,少数人已经让 agent 跑通整个工作流。" },
  { platform: "tiktok", topic: "AI 工具 30 秒上手", score: 63, tag: "aitools", example: "这个 AI 工具我每天都在用,省下 2 小时……" },
  { platform: "tiktok", topic: "faceless 账号怎么做起来", score: 74, tag: "facelesscreator", example: "不露脸也能爆:旁白 + 屏幕演示 + 强对比,75% 完播。" },
  { platform: "tiktok", topic: "学生党时间管理", score: 98, tag: "studytok", example: "期末前 7 天我是这样安排的,GPA 直接拉满……" },
  { platform: "reddit", topic: "小众工具如何获得前 100 个用户", score: 95, tag: "SaaS", example: "没投广告,前 100 个用户全靠这 3 个动作:……" },
  { platform: "reddit", topic: "我用 48 小时做了个 side project", score: 71, tag: "SideProject", example: "纯复盘,数据都在正文。踩了 5 个坑,不卖东西。" },
];

export function mockTrendsByPlatform(): Record<string, TrendItem[]> {
  const m: Record<string, TrendItem[]> = {};
  for (const t of MOCK_TRENDS) (m[t.platform] = m[t.platform] || []).push(t);
  return m;
}
