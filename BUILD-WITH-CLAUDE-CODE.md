# 用 Claude Code 把 Vibe Marketer 做成真产品 + 接入真实发布

这份指南配套两件代码:`vibe-marketer-server/`(后端 + 发布集成)。照着做,你就能从单文件原型走到能真发布的产品。

---

## 0. 为什么现在必须有一个后端

单文件 HTML 原型验证流程已经够了,但**真发布必须有后端**,三个硬原因:

1. **密钥安全** — zernio API key、MoreLogin 凭证绝不能放浏览器里(任何人 F12 就能看到)。
2. **真发布是服务端动作** — zernio 是 server-to-server 的 REST API;MoreLogin 的本地 API + Playwright 自动化只能在装了 MoreLogin 的机器上跑,浏览器里根本跑不了。
3. **排期要常驻进程** — X 帖错峰、定时发布需要一个一直在跑的调度器(cron),浏览器一关就没了。

**目标架构:前端(你现有的 UI)+ Node/TS 后端 + 数据库 + 调度器。**

---

## 1. 架构与文件结构

```
vibe-marketer/
├── vibe-marketer-web/                 # 前端:把 vibe-marketer.html 迁成 React/Vite(或先保持静态)
│   └── ...                     # 发布/发送动作改成调后端 /api/publish
├── vibe-marketer-server/              # 后端(本指南附带了起步代码)
│   ├── .env                    # 密钥(不进 git)
│   ├── package.json
│   └── src/
│       ├── server.ts           # Express:/api/publish、/api/analytics
│       ├── publishers.ts       # ★ 三个发布适配器 + 安全策略路由
│       ├── scheduler.ts        # node-cron:到点扫 scheduled 帖去发(让 Claude Code 生成)
│       └── db.ts               # SQLite 持久化(让 Claude Code 生成)
└── CLAUDE.md                   # 给 Claude Code 的项目上下文
```

- **数据库**:先用 SQLite(`better-sqlite3`),够用;规模化再换 Postgres。
- **调度**:`node-cron` 每分钟扫一遍到点的 `scheduled` 帖 → 调 `publish()`。

---

## 2. 安装并启动 Claude Code

需要 **Node.js 18+**。

```bash
# 方式一:npm(需 Node 18+)
npm install -g @anthropic-ai/claude-code
# 方式二:原生安装(免 Node)
# curl -fsSL https://claude.ai/install.sh | bash
```

> ⚠️ 别用 `sudo`。遇到 EACCES 权限错误,设一个属于你的 npm 目录:
> `mkdir ~/.npm-global && npm config set prefix '~/.npm-global'`,再把 `~/.npm-global/bin` 加进 PATH。

进项目目录启动,首次会弹浏览器做 OAuth 登录(Claude Pro/Max 订阅或 Anthropic API key 都行):

```bash
mkdir vibe-marketer && cd vibe-marketer
claude
```

在仓库根建一个 `CLAUDE.md`,把项目背景写进去(Claude Code 每次都会读它),例如:

```markdown
# Vibe Marketer — 多账号社媒增长助手
核心原则(不可违反):AI 起草、人工把守发布。reply 和 DM 永远人工发,绝不程序化自动发(X 封号红线)。
每个账号独立 persona,发布前过跨账号查重。X 原创帖错峰排期。
技术栈:前端 React/Vite,后端 Node+TS+Express+SQLite,发布走 publishers.ts 的三渠道。
```

---

## 3. 一步步驱动 Claude Code(可直接复制的 prompts)

把这些**按顺序**喂给 Claude Code,一步做完再下一步:

**① 搭后端骨架**
```
在 vibe-marketer-server/ 里搭一个 TypeScript + Express 后端。用我放在 src/ 里的 publishers.ts 和 server.ts 作为起点,补上 package.json 的依赖安装、tsconfig、和 dotenv 加载。让 npm run dev 能起来。
```

**② 迁移前端**
```
读取 vibe-marketer.html,把它的数据模型(accounts/personas/swipes/drafts/inbox)和 6 个页面(今日任务/日历/收件箱/账号分析/话术与人格/设置)迁移成 vibe-marketer-web 里的 React + Vite 应用,保持同样的 UI 和暖色设计。状态先用 zustand + SQLite 后端,不要用 localStorage。
```

**③ 接发布**
```
把前端"发布队列里标记已发/一键发送"和"今日任务里批准"接到后端 POST /api/publish。请求体传 { input, channel }。channel 从设置页选(manual/zernio/morelogin)。注意:reply 和 dm 不管选什么,后端会强制走 manual,前端按钮也要体现"打开原生发送框"。
```

**④ 加调度器**
```
在 vibe-marketer-server 加 src/scheduler.ts,用 node-cron 每分钟扫数据库里 status=scheduled 且 scheduledFor<=now 的帖,调 publishers.publish() 用 zernio 渠道发出,成功后更新状态并存 externalPostId。
```

**⑤ 接真实数据看板**
```
发布成功存的 externalPostId,写个定时任务调 publishers.zernioAnalytics(postId) 拉 views/likes/engagementRate,写回数据库,让"账号分析"看板和"测量飞轮"用真实互动数据替代手动打分。
```

Claude Code 是 agentic 的,会直接改文件、跑命令、装依赖。建议默认用 **Ask 权限**(每次写文件/跑命令都确认),熟了再放开。

---

## 4. 发布集成怎么用(三渠道 + 写死的安全策略)

代码在 `vibe-marketer-server/src/publishers.ts`,三个渠道:

| 渠道 | 用途 | 风险 |
|---|---|---|
| **manual**(默认) | 返回原生发送框 deeplink,人工按发 | 最安全 |
| **zernio** | 官方 API,适合**原创帖 + 自动排期** | 低(守限额即可) |
| **morelogin** | 指纹浏览器 + Playwright,适合**矩阵号 / 无 API 的平台** | 中高,需自己控速 |

**代码里硬编码了一条安全策略,别改**:`resolveChannel()` 强制 `reply` 和 `dm` 永远走 manual——因为自动化 DM 被 X 明令禁止、自动群发回复触发 spam 检测。这是我们整套设计的防封地基。

- **zernio**:`createPost` 传 `publishNow:true` 立即发,或 `scheduledFor`(ISO 时间)排期——正好对接你的错峰逻辑。多账号必须传 `accountId`(先 `accounts_list` 拿 ID)。
- **morelogin**:`/api/env/start` 启动指纹浏览器 → 拿到动态 CDP 端口 → Playwright `connectOverCDP` 驱动平台 composer。默认 `autoSubmit=false`(打开预填、人工按发,最安全);要全自动把 env 里 `MORELOGIN_AUTO_SUBMIT=true`(自担风险)。MoreLogin 客户端必须在本机运行且已登录。

环境变量见 `vibe-marketer-server/.env.example`。

---

## 5. 上线前清单

- [ ] 密钥进 `.env` / secret manager,**绝不进 git**(`.gitignore` 加 `.env`)。
- [ ] 守平台限额:X DM 500/天、发帖 2400/天(含回复);zernio 套餐也有账号数/调用限额。
- [ ] reply / DM 保持人工发(代码已强制,前端也要一致)。
- [ ] 错峰 + 随机抖动保留;跨账号查重在发布前跑。
- [ ] 先用 1–2 个号灰度,稳了再扩到 4–5 个。
- [ ] morelogin 路线:一账号一指纹一代理(住宅静态),新号先养 2–3 周。

---

附:`vibe-marketer-server/src/publishers.ts` 和 `server.ts` 已经是可运行的起步代码,Claude Code 在它基础上补全各平台 composer 流程即可。
