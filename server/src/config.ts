/**
 * config.ts — 运行期配置(密钥/开关)本地存储,让用户在网页里填、不必改 .env。
 * 读取顺序:**存储优先,回退环境变量**(老用户的 .env 仍然有效)。
 * 存到 DB 同目录的 config.json(server/data,已 gitignore)——仅本机、不入库、不上传。
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const DATA_DIR = dirname(process.env.DB_PATH || "./data/vibe-marketer.db");
const FILE = join(DATA_DIR, "config.json");

/** 可在网页里配置的键。密钥类 GET 时只回布尔,绝不回明文。 */
export const CONFIG_KEYS = [
  "APIFY_TOKEN", "ZERNIO_API_KEY", "ANTHROPIC_API_KEY", "X_SOURCE", "REDDIT_SOURCE", "TWSCRAPE_URL", "REDDIT_USER_AGENT",
] as const;
export type ConfigKey = (typeof CONFIG_KEYS)[number];
const SECRET_KEYS: ConfigKey[] = ["APIFY_TOKEN", "ZERNIO_API_KEY", "ANTHROPIC_API_KEY"];

let store: Partial<Record<ConfigKey, string>> | null = null;
function load(): Partial<Record<ConfigKey, string>> {
  if (store) return store;
  try {
    store = JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    store = {};
  }
  return store!;
}

/** 取某项配置:存储优先,回退 process.env。空串视为未设。 */
export function cfg(name: ConfigKey): string | undefined {
  const v = load()[name];
  if (v != null && v !== "") return v;
  const e = process.env[name];
  return e != null && e !== "" ? e : undefined;
}

/** 写入(空串/缺省=删除该项,回退到 env)。 */
export function setConfig(patch: Record<string, unknown>): void {
  const s = load();
  for (const k of CONFIG_KEYS) {
    if (!(k in patch)) continue;
    const v = patch[k];
    if (v == null || v === "") delete s[k];
    else s[k] = String(v);
  }
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify(s, null, 2));
  store = s;
}

/** GET 用:密钥只暴露"是否已配 + 末4位掩码",非密钥回真实值。绝不回明文密钥。 */
export function publicConfig() {
  const mask = (k: ConfigKey) => {
    const v = cfg(k);
    return v ? { set: true, hint: "••••" + v.slice(-4) } : { set: false, hint: "" };
  };
  return {
    apify: mask("APIFY_TOKEN"),
    zernio: mask("ZERNIO_API_KEY"),
    anthropic: mask("ANTHROPIC_API_KEY"),
    xSource: cfg("X_SOURCE") || "apify",
    redditSource: cfg("REDDIT_SOURCE") || "apify",
    twscrapeUrl: cfg("TWSCRAPE_URL") || "http://127.0.0.1:8001",
    // 兼容 /api/status 既有字段名
    apifyToken: !!cfg("APIFY_TOKEN"),
  };
}

export { SECRET_KEYS };
