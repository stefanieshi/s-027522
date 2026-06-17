# 快速上手(给非技术使用者)

这份是"照着做就能跑起来"的最短路径。三步:**装 → 配 → 跑**。
全程在你自己的电脑上;社媒的 reply/私信永远是 AI 起草、你人工按发(不会自动发,避免封号)。

---

## 0. 准备(只做一次)
装 [Node.js](https://nodejs.org)(LTS 版即可)。装完在终端能跑 `node -v`。

## 1. 安装依赖(只做一次)
在项目根目录依次跑:
```bash
npm install
cd server && npm install && cd ..
```

## 2. 配置后端钥匙
```bash
cp server/.env.example server/.env
```
然后用文本编辑器打开 `server/.env`,按需填(都可留空,留空就用对应的"安全/mock"模式):

| 变量 | 作用 | 不填会怎样 |
|---|---|---|
| `ANTHROPIC_API_KEY` | AI 起草文案/回复 | 用 mock 草稿,仍可走流程 |
| `ZERNIO_API_KEY` | **真发布 / 排期**(原创帖) | 只能用 manual(打开原生框人工发) |
| `APIFY_TOKEN` | 抓取爆款/评论/趋势 | 相关功能提示未配置 |
| `X_SOURCE=twscrape` | 用**免费**方式抓 X(替代 Apify) | 默认用 Apify |
| `REDDIT_SOURCE=public` | 用**免费**官方接口抓 Reddit | 默认用 Apify |

> 🔒 `server/.env` 已被 git 忽略,钥匙不会进仓库。别把钥匙发到聊天/截图里。

## 3. 启动
在根目录:
```bash
npm run dev:all
```
浏览器打开 **http://localhost:5173**。前后端都起来了(后端在 :8787,前端自动连它)。

---

## 用 Zernio 真发布 / 排期(可选)
1. 先在 `server/.env` 填好 `ZERNIO_API_KEY`,重启 `npm run dev:all`。
2. 前端「设置」里把**发布渠道**选 `zernio`。
3. 「设置 → 账号」新增/编辑账号时,点 **"从 Zernio 拉取"** 按钮 —— 会自动列出你在 Zernio 连接的对应平台账号,选一个即可(自动填好"外部账号 ID")。
4. 在「今日任务」里批准草稿 → **立即发**;或在「日历」里**排期**(到点后端自动发)。
5. **reply / 私信**:不管选什么渠道,都只会帮你打开原生发送框,由你人工按发。这是写死的防封号红线。

## 用免费数据源(可选,省 Apify 的钱)
- **Reddit(零成本、最稳)**:`server/.env` 设 `REDDIT_SOURCE=public`,重启即可。官方公开接口,无需账号。
- **X(免费,需你的小号)**:见 [`server/x-scraper/README.md`](server/x-scraper/README.md) —— 跑一个本地小服务 + 加 X 小号(别用主号),再设 `X_SOURCE=twscrape`。
- TikTok / Instagram 暂时仍走 Apify(开源方案不稳,不建议)。

## 出问题时
- 页面显示"后端未连上" → 确认 `npm run dev:all` 在跑,且没报错。
- "后端未配 XXX_KEY" → 去 `server/.env` 填对应钥匙,重启。
- Zernio 报错 → 多半是钥匙没填或没选已连接的账号(用上面"从 Zernio 拉取"挑一个)。

更细的后端接口与变量见 [`server/README.md`](server/README.md)。
