# Vibe Marketer · 你的社媒增长小助手

多账号社媒增长助手。一个原则贯穿始终:**AI 起草、人工把守发布**——
reply / DM 永远人工发,绝不程序化自动发(防 X 封号的安全主线)。

由原 `vibe-marketer.html` 单文件原型迁移而来的 **React + Vite + TypeScript** 产品,
外加一个可真发布的 **Node/Express 后端**(`server/`)。

![pages](https://img.shields.io/badge/pages-6-E8553D) 今日任务 · 日历排期 · 收件箱 · 账号分析 · 话术与人格 · 设置

## 功能

- **今日任务** — 按每个账号的人格 + 爆款 pattern 一键自动起草今日候选,审一眼 → 批准 → 发送。
- **日历排期** — 已发布 / 已排期一目了然,X 帖自动错峰。
- **收件箱** — 评论/私信 AI 草好回复,你确认后一键打开原生发送框发出(不自动直发)。
- **账号分析** — 各账号产出、爆款率、人格契合度;爆款打分喂回起草记忆(测量飞轮)。
- **话术与人格** — 每账号独立 persona、通用回复话术、爆款 pattern 库(一键拆解)。
- **设置** — 接 Anthropic key、模型选择、X 错峰时间窗、跨账号查重阈值、数据导入导出。

> 不填 Anthropic key 也能用:自动进入 **mock 模式**,可完整体验全流程。

## 快速开始

需要 Node.js 18+。

**一键起前后端**(自动装依赖 + 建 `server/.env`):

```bash
./dev.sh          # 或 npm run dev:all  → 前端 :5173 · 后端 :8787
```

或只起前端:

```bash
npm install
npm run dev       # → http://localhost:5173
```

到「设置」里填入 Anthropic API Key(`sk-ant-…`)即可让 Claude 真正起草;留空则用 mock。
后端配置见 [`server/README.md`](./server/README.md)。

## 后端(真发布 + 排期)

前端原型用于验证流程;**真发布必须有后端**(密钥安全、server-to-server 发布、常驻调度)。

```bash
cd server
cp .env.example .env     # 填入 ZERNIO_API_KEY 等
npm install
npm run dev              # → http://localhost:8787
```

三个发布渠道(安全策略写死,见 `server/src/publishers.ts`):

| 渠道 | 用途 | 风险 |
|---|---|---|
| **manual**(默认) | 返回原生发送框 deeplink,人工按发 | 最安全 |
| **zernio** | 官方 API,原创帖 + 自动排期 | 低 |
| **morelogin** | 指纹浏览器 + Playwright,矩阵号 / 无 API 平台 | 中高 |

接前端发布、加调度器、接真实数据看板的分步指南见 **[BUILD-WITH-CLAUDE-CODE.md](./BUILD-WITH-CLAUDE-CODE.md)**。

## 技术栈

React 18 · Vite · TypeScript · zustand(persist)· Node + Express · node-cron ·
@zernio/node · Playwright。设计系统(暖色 "paper")在 `src/index.css`。

## 安全须知

- 密钥进 `.env` / secret manager,**绝不进 git**(`.gitignore` 已忽略 `.env`)。
- reply / DM 保持人工发(代码已强制)。
- 守平台限额;X 原创帖错峰 + 随机抖动;发布前跑跨账号查重。
- 前端直连 Anthropic 仅为 MVP 体验,生产应改走后端代理。
