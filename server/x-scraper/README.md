# x-scraper · twscrape sidecar(免费 X 抓取)

X 的爆款雷达 / 大V监控 / 拉评论 / 趋势的**免费**数据源,替代 Apify 的 X 部分。
只读(search / user_tweets / replies),不含任何写能力。其余平台(TikTok/IG/Reddit)仍走 Apify。

> ⚠️ 用 X **小号**(burner),**别用你的发帖主号**;建议配住宅代理、低频抓取。封号风险在小号上。

## 启动
```bash
cd server/x-scraper
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

uvicorn main:app --port 8001
```

加小号有两种方式,**任选其一**:
- **网页里加(推荐,免命令行)**:sidecar 起来后,打开 app 的「话术与人格 → 📡 追踪 → 🐦 X 抓取小号」,
  填用户名/密码/邮箱/邮箱密码点「添加并登录」即可(凭据只到本机,存进 `accounts.db`)。
- **命令行加**:
  ```bash
  # 每行: username:password:email:email_password
  twscrape add_accounts accounts.txt username:password:email:email_password
  twscrape login_accounts
  ```

## 让后端用它
在 `server/.env`:
```
X_SOURCE=twscrape
TWSCRAPE_URL=http://127.0.0.1:8001
```
然后照常 `npm run dev`。`X_SOURCE=apify`(默认)即切回 Apify。

## 端点(Node 后端内部调用)
- `GET /health`
- `GET /search?q=&limit=` → `[{source,raw,metrics,url}]`
- `GET /user_tweets?login=&limit=` → `[{postId,url,text,author,ts}]`
- `GET /replies?tweet_id=&limit=` → `[{from,msg}]`

## 代理(可选,降低封号)
twscrape 支持每账号 / 全局代理,见 https://github.com/vladkens/twscrape 文档(add_accounts 时带 proxy,或 `TWS_PROXY` 环境变量)。
