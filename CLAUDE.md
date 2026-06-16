# Vibe Marketer — 多账号社媒增长助手

**核心原则(不可违反):AI 起草、人工把守发布。**
reply 和 DM 永远人工发,绝不程序化自动发(X 封号红线)。后端 `publishers.ts`
的 `resolveChannel()` 已把 `reply`/`dm` 强制走 `manual`,前端按钮也必须一致地
体现为"打开原生发送框、人工按发"。

- 每个账号独立 persona,发布前过跨账号查重(Jaccard 相似度阈值,见 Settings)。
- X 原创帖错峰排期(`assignSchedule`:同账号最小间隔 + 跨账号 15min 错开 + 随机抖动)。
- 收藏的爆款拆解成可复用 pattern,生成内容时只用结构、不抄原文。

## 技术栈

- **前端**:React 18 + Vite + TypeScript,状态用 zustand(persist 到 localStorage)。
  暖色 "paper" 设计系统在 `src/index.css`(CSS 变量 + 组件类)。
- **后端**(`server/`):Node + TS + Express。发布走 `publishers.ts` 三渠道:
  `manual`(默认,最安全)/ `zernio`(官方 API,原创帖+排期)/ `morelogin`(指纹浏览器矩阵号)。
- **调度**:`server/src/scheduler.ts` 用 node-cron 每分钟扫到点的 scheduled 帖。

## 目录结构

```
.
├── src/                  # 前端 React app
│   ├── pages/            # 今日任务 / 日历 / 收件箱 / 账号分析 / 话术与人格 / 设置
│   ├── components/       # Sidebar / TopBar / Modal / Toast / modals
│   ├── lib/              # types, constants, utils, llm, schedule, actions
│   ├── store.ts          # zustand:持久化数据 store + 临时 UI store
│   └── index.css         # 暖色设计系统(从原型 1:1 移植)
├── server/               # 后端 + 发布集成
│   └── src/{server,publishers,scheduler}.ts
├── BUILD-WITH-CLAUDE-CODE.md   # 从原型到真产品的接入指南
└── CLAUDE.md
```

## 数据模型(`src/lib/types.ts`)

`accounts`(含 persona)· `swipes`(爆款 + 拆解 pattern)· `drafts`(候选/已批准/已发布)·
`inbox`(评论/私信 + 回复)· `templates`(回复话术)· `settings`。

## LLM

`src/lib/llm.ts` 直连 Anthropic Messages API(MVP 模式,key 存浏览器本地)。
留空 key 走 mock,可体验全流程。**生产环境应改为后端代理,key 绝不进前端。**
默认模型 `claude-sonnet-4-6`,可选 `claude-opus-4-8` / `claude-haiku-4-5`。
