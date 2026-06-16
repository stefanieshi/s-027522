/**
 * publishers.ts — 发布层入口(barrel)。
 * 实现已拆分到 ./publishers/ 下的渠道适配器,这里保持原有对外签名不变,
 * 让 server.ts / scheduler.ts / analytics.ts / db.ts 的 `from './publishers.js'` 零改动。
 *
 * 三渠道:manual(安全默认)/ zernio(官方 API)/ morelogin(指纹浏览器)
 * 安全地基:reply / dm 永远走 manual(见 publishers/index.ts 的 resolveChannel)。
 */
export * from "./publishers/index.js";
