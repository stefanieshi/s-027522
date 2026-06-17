# 跑通免费源:X(twscrape)+ Reddit(public)

把 X 和 Reddit 的抓取从 Apify 切到**免费源**,并验证 `发现爆款 / 拉评论 / 趋势` 都通。
全程只读,不自动发帖;reply/DM 仍人工。

> 一句话:**Reddit 零账号、改一行 env 就能跑**;**X 需要你自备小号 + 起一个 sidecar**。

---

## 0. 准备
```bash
cd server
cp .env.example .env     # 已有就跳过
npm install
```
> 🔐 `server/.env` 已 gitignore(连同 `ZERNIO_API_KEY` 等密钥),不会进库。泄露过的 key 请去 zernio.com 轮换。

---

## 1. Reddit(最快,无需账号)
在 `server/.env`:
```
REDDIT_SOURCE=public
# 可选,降被限概率(Reddit 建议带可识别标识):
# REDDIT_USER_AGENT=你的应用名/1.0 (read-only)
```
起后端 + 冒烟:
```bash
npm run dev            # 终端 A,:8787
npm run smoke          # 终端 B
```
看到 `● reddit … ✓ discover/✓ pull/✓ trends` 即通。
> 高频被 429?设 `REDDIT_USER_AGENT`,或改用官方 OAuth(限额更高)。

---

## 2. X(twscrape,需要你的小号)
**别用主号**,用 burner;建议配住宅代理、低频抓。

### 2.1 起 sidecar
```bash
cd server/x-scraper
./run.sh               # 首次自动建 venv + 装依赖,然后跑在 :8001
```
### 2.2 加小号(首次,另开一个终端)
```bash
cd server/x-scraper
source .venv/bin/activate
twscrape add_accounts accounts.txt username:password:email:email_password
twscrape login_accounts
```
### 2.3 切到 twscrape
在 `server/.env`:
```
X_SOURCE=twscrape
TWSCRAPE_URL=http://127.0.0.1:8001
```
重启后端,再冒烟(带上 sidecar 地址,顺便探活):
```bash
npm run dev                                    # 重启
TWSCRAPE_URL=http://127.0.0.1:8001 npm run smoke
```
看到 `● twscrape sidecar … ✓ 健康(active≥1)` 和 `● x … ✓ discover/✓ pull/✓ trends` 即通。
> `active=0` = 还没登录可用小号;回到 2.2 重做 `login_accounts`。

---

## 3. 前端实测
前端 `apiBase` 默认就指向 `http://localhost:8787`(`src/store.ts`),无需配置:
```bash
# 回到仓库根目录
npm run dev:all        # 前端 :5173 + 后端一起起
```
- **今日任务 / 雷达**:点「发现爆款」,平台选 `x` 或 `reddit`,query 填关键词 / `@handle` / `r/子版块`。
- **收件箱**:点「拉评论」,粘贴一条帖子链接 → 看到评论被拉回(回复仍人工发)。
- **大V监控**:在追踪雷达加 `x`/`reddit` 账号;后端每 `MONITOR_INTERVAL_MIN` 分钟扫新帖、AI 起草、待你审批。

---

## 4. 冒烟脚本速查(`npm run smoke`)
| env | 默认 | 说明 |
|---|---|---|
| `API_BASE` | `http://localhost:8787` | 后端地址 |
| `PLATFORMS` | `reddit,x` | 只测某个:`PLATFORMS=reddit npm run smoke` |
| `REDDIT_QUERY` | `r/startups` | Reddit 关键词或 `r/子版块` |
| `X_HANDLE` | `@naval` | X 测试 handle(或关键词) |
| `TWSCRAPE_URL` | 无 | 传了就额外探 sidecar `/health` |
| `LIMIT` | `5` | 每步条数 |

脚本会**自驱动**:discover 拿到首条 url 后直接喂给 pull,不用手填链接。失败时给「→ 下一步怎么修」提示。

---

## 5. 常见问题
- **`NO_APIFY_TOKEN`**:开关没生效 → 确认 `.env` 设了 `REDDIT_SOURCE=public` / `X_SOURCE=twscrape` 并**重启**了后端。
- **`twscrape 不可达`**:sidecar 没起 → `cd server/x-scraper && ./run.sh`。
- **`Reddit 不可达 / 出站被挡`**:在受限网络(如 Claude Code web 沙箱)里,需把 `www.reddit.com` / `x.com`(+ sidecar)加进**网络出站白名单**;否则在本地机器跑。
- **只切了 X 没切 Reddit(或反之)**:两个开关独立,互不影响;TikTok/IG 始终走 Apify。
