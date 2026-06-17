"""
x-scraper — twscrape sidecar(Apify 的 X 部分的免费替代,只读)。
Node 后端按 X_SOURCE=twscrape 时调本服务;X 改动账号轮换/限流/代理由 twscrape 处理。
只读:search / user_tweets / replies —— 不含任何写能力。

启动:
  cd server/x-scraper
  python -m venv .venv && source .venv/bin/activate
  pip install -r requirements.txt
  # 加小号(别用主号),三选一登录方式见 twscrape 文档:
  twscrape add_accounts accounts.txt username:password:email:email_password
  twscrape login_accounts
  uvicorn main:app --port 8001
"""
import os
from fastapi import FastAPI
from twscrape import API, gather

app = FastAPI(title="vibe x-scraper (twscrape)")
api = API(os.getenv("TWSCRAPE_DB", "accounts.db"))


def _num(n) -> str:
    try:
        v = int(n or 0)
    except Exception:
        return "0"
    if v >= 1000:
        return (f"{v/1000:.0f}k" if v >= 10000 else f"{v/1000:.1f}k")
    return str(v)


def _candidate(t) -> dict:
    u = getattr(t, "user", None)
    return {
        "source": "@" + (getattr(u, "username", "") or "x"),
        "raw": getattr(t, "rawContent", "") or "",
        "metrics": f"❤{_num(getattr(t, 'likeCount', 0))}·🔁{_num(getattr(t, 'retweetCount', 0))}",
        "url": getattr(t, "url", "") or "",
    }


def _post(t) -> dict:
    u = getattr(t, "user", None)
    d = getattr(t, "date", None)
    return {
        "postId": str(getattr(t, "id", "") or ""),
        "url": getattr(t, "url", "") or "",
        "text": getattr(t, "rawContent", "") or "",
        "author": "@" + (getattr(u, "username", "") or "x"),
        "ts": d.isoformat() if d else None,
    }


@app.get("/health")
async def health():
    try:
        accts = await api.pool.accounts_info()
        active = sum(1 for a in accts if getattr(a, "active", False))
        return {"ok": True, "accounts": len(accts), "active": active}
    except Exception as e:  # noqa
        return {"ok": True, "accounts": None, "note": str(e)[:120]}


@app.get("/search")
async def search(q: str, limit: int = 20):
    tweets = await gather(api.search(q, limit=limit))
    return [_candidate(t) for t in tweets]


@app.get("/user_tweets")
async def user_tweets(login: str, limit: int = 10):
    user = await api.user_by_login(login.lstrip("@"))
    if not user:
        return []
    tweets = await gather(api.user_tweets(user.id, limit=limit))
    return [_post(t) for t in tweets]


@app.get("/replies")
async def replies(tweet_id: int, limit: int = 30):
    tweets = await gather(api.tweet_replies(tweet_id, limit=limit))
    out = []
    for t in tweets:
        u = getattr(t, "user", None)
        out.append({"from": "@" + (getattr(u, "username", "") or "x"), "msg": getattr(t, "rawContent", "") or ""})
    return out
