/**
 * Anthropic client for Resonance. Calls the Messages API directly from the
 * browser (MVP mode — key lives in localStorage). For production this should
 * be proxied through a backend so the key never ships to the client.
 *
 * Every generator throws on failure (including a missing key); callers fall
 * back to bundled demo data and flag demo mode — matching the mockup.
 */
import type { Draft, Op, Platform, StudioPost, Voice } from "./types";

export class NoKeyError extends Error {
  constructor() {
    super("NO_KEY");
    this.name = "NoKeyError";
  }
}

async function callClaude(
  apiKey: string,
  model: string,
  system: string,
  user: string,
  maxTokens = 1000
): Promise<string> {
  const key = apiKey.trim();
  if (!key) throw new NoKeyError();
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: model || "claude-sonnet-4-6",
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });
  if (!res.ok) throw new Error("API " + res.status + ": " + (await res.text()).slice(0, 160));
  const data = await res.json();
  return (data.content || [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("")
    .trim();
}

/** Extract the first JSON value (object or array) from a model response. */
export function parseJSON<T>(txt: string): T {
  const clean = txt.replace(/```json/gi, "").replace(/```/g, "").trim();
  const a = clean.indexOf("[");
  const o = clean.indexOf("{");
  const s = a === -1 ? o : o === -1 ? a : Math.min(a, o);
  const e = Math.max(clean.lastIndexOf("}"), clean.lastIndexOf("]"));
  return JSON.parse(clean.slice(s, e + 1)) as T;
}

const platLabel = (p: Platform) => (p === "x" ? "X" : "Reddit");

export async function scanOps(
  apiKey: string,
  model: string,
  niche: string,
  platform: Platform
): Promise<Omit<Op, "_id">[]> {
  const system =
    "You simulate an engagement-opportunity radar for someone marketing an AI stock research SaaS. Surface representative recent threads worth replying to, scored. Illustrative composites. Return ONLY valid JSON.";
  const prompt =
    platform === "x"
      ? `Niche:"${niche}". Platform:X. JSON array of 6: {author,handle(@),verified,text,likes,reposts,replies,fit(0-100),why_now,decay_hours(2-48),angle}.`
      : `Niche:"${niche}". Platform:Reddit. JSON array of 6: {subreddit(r/),author,title,text,upvotes,comments,fit(0-100),why_now,decay_hours(2-48),angle}.`;
  const out = parseJSON<Omit<Op, "_id">[]>(await callClaude(apiKey, model, system, prompt));
  return out.slice().sort((a, b) => (b.fit || 0) - (a.fit || 0));
}

export async function genReplies(
  apiKey: string,
  model: string,
  platform: Platform,
  op: Op,
  voiceDna: string | null
): Promise<Draft[]> {
  const body = platform === "x" ? op.text : `${op.title} — ${op.text}`;
  const system =
    "You are an engagement strategist for a founder marketing an AI stock research tool. Value-first replies, native, no spam.\nCOMPLIANCE: never give buy/sell calls, price targets, or guarantees. safety \"amber\" if it could read as investment advice; \"green\" if clearly educational." +
    (voiceDna
      ? `\nVOICE DNA:"${voiceDna}". Score "sounds" 0-100.`
      : '\nNo voice profile; set "sounds" to null.') +
    "\nReturn ONLY valid JSON.";
  const prompt = `Platform:${platLabel(platform)}. Thread:"${body}". Angle:${op.angle}. 3 reply options. JSON array of {angle,reply,sounds,safety,note}.`;
  return parseJSON<Draft[]>(await callClaude(apiKey, model, system, prompt));
}

export async function analyzeVoice(
  apiKey: string,
  model: string,
  samples: string
): Promise<Voice> {
  if (samples.trim().length < 20) throw new Error("short");
  const system =
    "You analyze a writer's social voice from samples so an AI can match it. Return ONLY valid JSON.";
  const prompt = `Samples:"""${samples.slice(
    0,
    2500
  )}""" Return JSON {voice_dna,tone,signature_moves(3),vocabulary(4-6),avoid(2-3)}.`;
  return parseJSON<Voice>(await callClaude(apiKey, model, system, prompt));
}

export async function genStudio(
  apiKey: string,
  model: string,
  niche: string,
  platform: Platform,
  seed: string,
  voiceDna: string | null
): Promise<StudioPost[]> {
  const system =
    "Viral content creator for a founder marketing an AI stock research tool. Credible.\nCOMPLIANCE: no buy/sell calls, price targets, guarantees." +
    (voiceDna ? ` Match VOICE DNA:"${voiceDna}".` : "") +
    " Return ONLY valid JSON.";
  const prompt = `Niche:"${niche}". Platform:${platLabel(platform)}.${
    seed ? ` Angle:"${seed}".` : ""
  } 3 original posts, different formats. JSON array of {format,text,safety,note}.`;
  return parseJSON<StudioPost[]>(await callClaude(apiKey, model, system, prompt));
}
