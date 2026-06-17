#!/usr/bin/env bash
# run.sh — 一键起 twscrape sidecar(幂等)。
# 首次会建 venv + 装依赖;之后直接复用。端口默认 8001(PORT 可覆盖)。
#
#   cd server/x-scraper && ./run.sh
#
# 起好后,首次需加 X 小号(别用主号):
#   source .venv/bin/activate
#   twscrape add_accounts accounts.txt username:password:email:email_password
#   twscrape login_accounts
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-8001}"

if [ ! -d .venv ]; then
  echo "→ 建 venv 并装依赖(首次,稍等)…"
  python3 -m venv .venv
  ./.venv/bin/pip install --quiet --upgrade pip
  ./.venv/bin/pip install --quiet -r requirements.txt
fi

# 没有任何账号时给个提醒(accounts.db 不存在 = 还没加小号)
if [ ! -f "${TWSCRAPE_DB:-accounts.db}" ]; then
  echo "⚠ 还没加 X 小号:起好后另开终端执行"
  echo "    source server/x-scraper/.venv/bin/activate"
  echo "    twscrape add_accounts accounts.txt user:pass:email:email_pass && twscrape login_accounts"
fi

echo "→ twscrape sidecar 启动于 http://127.0.0.1:${PORT}"
exec ./.venv/bin/uvicorn main:app --host 127.0.0.1 --port "${PORT}"
