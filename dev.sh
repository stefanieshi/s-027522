#!/usr/bin/env bash
# 一键起前后端(开发)。Ctrl-C 一起退出。
# 用法:./dev.sh   或   npm run dev:all
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

# 首次自动装依赖
[ -d "$ROOT/node_modules" ] || { echo "📦 安装前端依赖…"; npm --prefix "$ROOT" install; }
[ -d "$ROOT/server/node_modules" ] || { echo "📦 安装后端依赖…"; npm --prefix "$ROOT/server" install; }
# 首次自动创建后端 .env
[ -f "$ROOT/server/.env" ] || { cp "$ROOT/server/.env.example" "$ROOT/server/.env"; echo "📝 已创建 server/.env(记得填 ZERNIO_API_KEY / APIFY_TOKEN)"; }

pids=()
cleanup() { echo; echo "👋 停止前后端…"; kill "${pids[@]}" 2>/dev/null || true; }
trap cleanup EXIT INT TERM

echo "🚀 后端 → http://localhost:8787"
( cd "$ROOT/server" && npm run dev ) & pids+=($!)
echo "🚀 前端 → http://localhost:5173"
( cd "$ROOT" && npm run dev ) & pids+=($!)

wait
