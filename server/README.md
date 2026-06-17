# Vibe Marketer · 后端

Node + Express 后端:三渠道发布 + 排期调度 + 真实互动数据回收 + 抓取摄入。
**安全地基:reply / DM 永远走 manual(人工发),`resolveChannel()` 写死。**

## 快速开始

```bash
cp .env.example .env     # 填 ZERNIO_API_KEY / APIFY_TOKEN(都可留空,功能会优雅降级)
npm install
npm run dev              # → http://localhost:8787
```

> 想一键同时起前端+后端:在仓库根目录跑 `./dev.sh`(或 `npm run dev:all`)。

## 目录

```
src/
├── server.ts            # Express 入口 + 所有路由
├── publishers/          # 发布渠道适配器(可插拔)
│   ├── index.ts         #   注册表 + resolveChannel(reply/dm→manual) + publish()
│   ├── manual.ts        #   原生发送框 deeplink(默认,最安全)
│   ├── zernio.ts        #   官方 API:原创帖 + 排期 + analytics
│   └── morelogin.ts     #   指纹浏览器 + Playwright(矩阵号/无 API 平台)
├── scheduler.ts         # node-cron 每分钟扫到点的排期帖去发
├── analytics.ts         # 定时调 zernioAnalytics 回收 views/likes/互动率
├── sources/apify.ts     # 抓取摄入:爆款雷达 / 真收件箱 / 趋势选题
└── db.ts                # SQLite(better-sqlite3):scheduled_posts + post_metrics
```

## API

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/health` | 健康检查 |
| POST | `/api/publish` | `{ input, channel }` 立即发(manual 返回 deeplink) |
| POST | `/api/schedule` | `{ input, channel, scheduledFor }` 持久化排期,scheduler 到点发 |
| GET | `/api/schedule?status=` | 列排期帖 |
| DELETE | `/api/schedule/:id` | 取消未发的排期 |
| GET | `/api/analytics/:postId` | zernio 实时互动数据 |
| GET | `/api/metrics?ids=a,b` | 已回收的互动数据 |
| POST | `/api/metrics/track` | `{ externalPostId, accountId, platform }` 登记追踪 |
| POST | `/api/metrics/refresh` | 立刻回收所有追踪帖 |
| POST | `/api/discover` | `{ platform, query, limit }` 发现爆款(Apify) |
| POST | `/api/inbox/pull` | `{ platform, postUrls, limit }` 拉评论/回复(Apify) |
| POST | `/api/trends` | `{ platform, query }` 趋势选题(Apify) |

## 环境变量(见 `.env.example`)

- `ZERNIO_API_KEY` — zernio 官方发布/分析(留空则 zernio 渠道报错,manual 不受影响)。
- `APIFY_TOKEN` — 抓取摄入(留空则 discover/pull/trends 返回 `NO_APIFY_TOKEN`,前端会提示)。
- `X_SOURCE` — `apify`(默认)或 `twscrape`(免费 X 抓取,需跑 `x-scraper/` sidecar + 加 X 小号;见 [x-scraper/README](./x-scraper/README.md))。设为 twscrape 后 X 走免费源,TikTok/IG/Reddit 仍用 Apify。
- `MORELOGIN_*` — 指纹浏览器渠道(需本机 MoreLogin 客户端 + Playwright)。
- `DB_PATH` — SQLite 路径(默认 `./data`,已 gitignore)。
- `ANALYTICS_REFRESH_MIN` — 互动数据回收频率(分钟)。
- `FRONTEND_ORIGIN` — CORS 允许来源(默认 `*`)。

## 渠道与覆盖

| 渠道 | 用途 | 风险 |
|---|---|---|
| manual(默认) | 返回原生发送框 deeplink,人工按发 | 最安全 |
| zernio | 官方 API,原创帖 + 自动排期 + analytics | 低 |
| morelogin | 指纹浏览器矩阵号 / 无 API 平台 | 中高 |

抓取覆盖(v1,actor 均 env 可换):发现=TikTok/X/Reddit · 评论=Instagram/X/TikTok/Reddit · 趋势=TikTok/X/Reddit。

> 换发布供应商(Ayrshare/WoopSocial)= 在 `publishers/` 加一个实现 `Publisher` 的文件并登记进 `index.ts` 的注册表,其余零改动。
