#!/usr/bin/env node
/**
 * smoke.mjs — 免费源冒烟测试(零依赖)。
 * 对运行中的后端逐个打 /api/discover · /api/inbox/pull · /api/trends,验证 X / Reddit 走通。
 * 自驱动:discover 拿到首条 url 后,直接喂给 pull 拉评论 —— 不用手填帖子链接。
 *
 * 用法(先 `npm run dev` 起后端):
 *   npm run smoke                       # 测 reddit + x(用各自默认 query/handle)
 *   PLATFORMS=reddit npm run smoke      # 只测 reddit
 *   TWSCRAPE_URL=http://127.0.0.1:8001 npm run smoke   # 顺带探 twscrape sidecar 健康
 *
 * env:
 *   API_BASE      后端地址(默认 http://localhost:8787)
 *   PLATFORMS     逗号分隔,默认 "reddit,x"
 *   REDDIT_QUERY  默认 "r/startups"
 *   X_HANDLE      默认 "@naval"
 *   TWSCRAPE_URL  传了就探 sidecar /health
 *   LIMIT         每步条数(默认 5)
 */
const API_BASE = (process.env.API_BASE || "http://localhost:8787").replace(/\/$/, "");
const PLATFORMS = (process.env.PLATFORMS || "reddit,x").split(",").map((s) => s.trim()).filter(Boolean);
const LIMIT = Math.max(1, Number(process.env.LIMIT) || 5);
const QUERY = { reddit: process.env.REDDIT_QUERY || "r/startups", x: process.env.X_HANDLE || "@naval" };

const C = { g: "\x1b[32m", r: "\x1b[31m", y: "\x1b[33m", d: "\x1b[2m", x: "\x1b[0m" };
const ok = (m) => console.log(`${C.g}  ✓${C.x} ${m}`);
const bad = (m) => console.log(`${C.r}  ✗${C.x} ${m}`);
const info = (m) => console.log(`${C.d}    ${m}${C.x}`);
let failures = 0;

async function call(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

/** 把后端错误翻译成"下一步怎么修"。 */
function diagnose(platform, err) {
  if (err === "NO_APIFY_TOKEN")
    return platform === "reddit"
      ? "没走免费源 → server/.env 设 REDDIT_SOURCE=public 并重启"
      : "没走免费源 → server/.env 设 X_SOURCE=twscrape(并起 sidecar)并重启";
  if (/twscrape/.test(err)) return "sidecar 没起或没加小号 → cd server/x-scraper && ./run.sh,再 twscrape add_accounts/login_accounts";
  if (/限流|429/.test(err)) return "Reddit 限流 → 稍后再试,或设 REDDIT_USER_AGENT / 用官方 OAuth";
  if (/不可达|UNREACHABLE|ECONN|fetch failed|allowlist|egress|出站|\b403\b/i.test(err))
    return "网络/出站被挡 → 本地跑,或把 reddit.com/x.com(+sidecar)加进出站白名单";
  return null;
}

async function probeSidecar() {
  const url = process.env.TWSCRAPE_URL;
  if (!url) return;
  console.log(`\n${C.y}● twscrape sidecar${C.x} ${url}`);
  try {
    const res = await fetch(url.replace(/\/$/, "") + "/health");
    const j = await res.json().catch(() => ({}));
    if (j.ok) ok(`sidecar 健康(accounts=${j.accounts ?? "?"} active=${j.active ?? "?"})`);
    else bad(`sidecar 响应异常: ${JSON.stringify(j)}`);
    if (j.active === 0) info("⚠ active=0 → 还没登录可用小号,X 抓取会空。twscrape add_accounts + login_accounts");
  } catch {
    failures++;
    bad("sidecar 不可达 → cd server/x-scraper && ./run.sh");
  }
}

async function testPlatform(platform) {
  const query = QUERY[platform] || "ai";
  console.log(`\n${C.y}● ${platform}${C.x} (query="${query}")`);

  // 1) discover
  const d = await call("/api/discover", { platform, query, limit: LIMIT });
  if (d.status !== 200) {
    failures++;
    bad(`discover 失败 [${d.status}] ${d.json.error || ""}`);
    const tip = diagnose(platform, d.json.error || "");
    if (tip) info("→ " + tip);
    return; // discover 不通,后面没意义
  }
  const rows = Array.isArray(d.json) ? d.json : [];
  ok(`discover 拿到 ${rows.length} 条`);
  rows.slice(0, 3).forEach((r) => info(`${r.source}  ${String(r.raw || "").replace(/\s+/g, " ").slice(0, 60)}  ${r.metrics}`));
  if (!rows.length) info("⚠ 返回 0 条(query 太窄?或源没数据)");

  // 2) pull(自驱动:用首条 url)
  const firstUrl = rows.find((r) => r.url)?.url;
  if (firstUrl) {
    const p = await call("/api/inbox/pull", { platform, postUrls: [firstUrl], limit: LIMIT });
    if (p.status === 200) {
      const cs = Array.isArray(p.json) ? p.json : [];
      ok(`pull 评论 ${cs.length} 条(@ ${firstUrl.slice(0, 48)}…)`);
      cs.slice(0, 2).forEach((c) => info(`${c.from}: ${String(c.msg || "").replace(/\s+/g, " ").slice(0, 60)}`));
    } else {
      failures++;
      bad(`pull 失败 [${p.status}] ${p.json.error || ""}`);
      const tip = diagnose(platform, p.json.error || "");
      if (tip) info("→ " + tip);
    }
  } else {
    info("（discover 无 url,跳过 pull）");
  }

  // 3) trends
  const t = await call("/api/trends", { platform, query, limit: LIMIT });
  if (t.status === 200) ok(`trends ${Array.isArray(t.json) ? t.json.length : 0} 个选题`);
  else {
    failures++;
    bad(`trends 失败 [${t.status}] ${t.json.error || ""}`);
  }
}

async function main() {
  console.log(`${C.y}vibe 免费源冒烟测试${C.x}  →  ${API_BASE}  [${PLATFORMS.join(", ")}]`);
  // 后端存活检查
  try {
    const h = await fetch(API_BASE + "/health");
    if (!h.ok) throw new Error(String(h.status));
    ok("后端在线 /health");
  } catch {
    bad(`后端不可达 ${API_BASE} → 先 cd server && npm run dev`);
    process.exit(1);
  }

  await probeSidecar();
  for (const p of PLATFORMS) await testPlatform(p);

  console.log("");
  if (failures) {
    console.log(`${C.r}✗ 冒烟未全绿:${failures} 个检查失败(看上面 → 提示)${C.x}`);
    process.exit(1);
  }
  console.log(`${C.g}✓ 全绿:${PLATFORMS.join("/")} 的 discover/pull/trends 都通了${C.x}`);
}

main().catch((e) => {
  bad("脚本异常: " + (e?.message || e));
  process.exit(1);
});
