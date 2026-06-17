import { useData, useUi } from "../store";
import { teardownSwipe } from "./llm";
import { apiPublish, apiSchedule, apiTrack, apiGetMetrics, apiRefreshMetrics, UNREACHABLE, type PublishInput } from "./api";
import { composerUrl, xDmUrl } from "./utils";
import type { Account, Draft, InboxItem } from "./types";

const toast = (m: string) => useUi.getState().toast(m);

function draftText(d: Draft): string {
  return [d.hook, d.body, d.cta].filter(Boolean).join("\n");
}
function draftInput(d: Draft, acct?: Account): PublishInput {
  return {
    accountId: d.account_id,
    externalAccountId: acct?.externalId || undefined,
    platform: d.platform,
    kind: "post",
    text: draftText(d),
    ...(d.mediaUrls?.length ? { mediaUrls: d.mediaUrls } : {}),
    ...(d.options ? { options: d.options } : {}),
  };
}

/** 「标记已发 / 一键发送」一条已批准的帖。useBackend 关 → 本地标记(原行为)。 */
export async function publishDraftNow(id: string): Promise<void> {
  const { data } = useData.getState();
  const d = data.drafts.find((x) => x.id === id);
  if (!d) return;
  const acct = data.accounts.find((a) => a.id === d.account_id);
  const s = data.settings;
  const markPublished = (externalPostId?: string, publishedUrl?: string) =>
    useData.getState().setData((dd) => {
      const t = dd.drafts.find((x) => x.id === id);
      if (t) {
        t.status = "published";
        t.publishedAt = Date.now();
        if (externalPostId) t.externalPostId = externalPostId;
        if (publishedUrl) t.publishedUrl = publishedUrl;
      }
    });

  if (!s.useBackend) {
    markPublished();
    toast("已标记发布 · 记得真的发出去 🙂");
    return;
  }

  const r = await apiPublish(s.apiBase, draftInput(d, acct), s.channel);
  if (r.status === "manual") {
    if (r.openUrl) window.open(r.openUrl, "_blank");
    markPublished();
    toast("已打开原生发送框 · 按发送即可");
  } else if (r.status === "published" || r.status === "scheduled") {
    markPublished(r.externalPostId, r.publishedUrl);
    if (r.externalPostId) void apiTrack(s.apiBase, r.externalPostId, d.account_id, d.platform);
    toast("已通过 " + s.channel + " 发布 ✓");
  } else if (r.error === UNREACHABLE) {
    window.open(composerUrl[d.platform], "_blank");
    markPublished();
    toast("后端未连上 · 已打开原生发送框");
  } else {
    toast("发布失败:" + (r.error || "").slice(0, 50));
  }
}

/** 批准后:若开了后端且渠道非 manual,把已排期的 X 帖交后端 DB 排期(scheduler 到点真发)。 */
export async function scheduleDraftBackend(id: string): Promise<void> {
  const { data } = useData.getState();
  const s = data.settings;
  if (!s.useBackend || s.channel === "manual") return;
  const d = data.drafts.find((x) => x.id === id);
  if (!d || d.type !== "x_post" || !d.scheduledAt) return;
  const acct = data.accounts.find((a) => a.id === d.account_id);
  const r = await apiSchedule(s.apiBase, draftInput(d, acct), s.channel, new Date(d.scheduledAt).toISOString());
  if (r.status === "scheduled" && r.id) {
    useData.getState().setData((dd) => {
      const t = dd.drafts.find((x) => x.id === id);
      if (t) t.scheduleId = r.id;
    });
    toast("已交后端排期 · scheduler 到点自动发");
  } else if (r.error && r.error !== UNREACHABLE) {
    toast("后端排期失败:" + r.error.slice(0, 50));
  }
}

/** 刷新真实互动数据:触发后端回收 → 拉回已发布帖的 metrics → 写回 drafts。 */
export async function refreshMetrics(): Promise<void> {
  const { data } = useData.getState();
  const s = data.settings;
  if (!s.useBackend) {
    toast("先在设置里开启「接后端真发布」");
    return;
  }
  const ids = data.drafts.filter((d) => d.status === "published" && d.externalPostId).map((d) => d.externalPostId!) as string[];
  if (!ids.length) {
    toast("还没有带外部 ID 的已发布帖");
    return;
  }
  await apiRefreshMetrics(s.apiBase);
  const metrics = await apiGetMetrics(s.apiBase, ids);
  const byId = new Map(metrics.map((m) => [m.externalPostId, m]));
  let n = 0;
  useData.getState().setData((dd) => {
    dd.drafts.forEach((d) => {
      const m = d.externalPostId && byId.get(d.externalPostId);
      if (m && m.status === "ok") {
        d.metrics = { views: m.views, likes: m.likes, engagementRate: m.engagementRate, fetchedAt: m.fetchedAt };
        n++;
      }
    });
  });
  toast(n ? `已更新 ${n} 条真实数据 📊` : "暂无可用互动数据(等回收或确认 zernio key)");
}

/** 收件箱回复发送。reply/dm 后端强制 manual → 打开原生发送框。useBackend 关 → 本地行为。 */
export async function sendInboxReply(item: InboxItem): Promise<void> {
  const { data } = useData.getState();
  const s = data.settings;
  const acct = data.accounts.find((a) => a.platform === item.platform);
  const markSent = () =>
    useData.getState().setData((dd) => {
      const t = dd.inbox.find((x) => x.id === item.id);
      if (t) t.status = "sent";
    });
  navigator.clipboard?.writeText(item.reply);

  const localFallback = () => {
    const url = item.platform === "x" ? xDmUrl(item.reply) : "";
    if (url) window.open(url, "_blank");
    markSent();
    toast(url ? "已打开 X 发送框 · 按发送即可" : "回复已复制 · 去平台粘贴发送");
  };

  if (!s.useBackend) {
    localFallback();
    return;
  }

  const r = await apiPublish(
    s.apiBase,
    { accountId: acct?.id || "", externalAccountId: acct?.externalId, platform: item.platform, kind: "dm", text: item.reply },
    s.channel
  );
  if (r.status === "manual" && r.openUrl) {
    window.open(r.openUrl, "_blank");
    markSent();
    toast("已打开原生发送框 · 按发送即可");
  } else if (r.error === UNREACHABLE) {
    localFallback();
    toast("后端未连上 · 已用本地发送框");
  } else if (r.status === "manual") {
    markSent();
    toast("回复已复制 · 去平台粘贴发送");
  } else {
    toast("发送失败:" + (r.error || "").slice(0, 50));
  }
}

/** Tear down a swipe into a reusable pattern (shared by Voice page + swipe modal). */
export async function tearSwipe(id: string): Promise<void> {
  const cur = useData.getState().data;
  const sw = cur.swipes.find((s) => s.id === id);
  if (!sw) return;
  useUi.getState().toast("拆解中…");
  try {
    const r = await teardownSwipe(cur.settings, sw);
    useData.getState().setData((d) => {
      const t = d.swipes.find((x) => x.id === id);
      if (t) {
        t.teardown = r.teardown;
        t.pattern = r.pattern;
      }
    });
    useUi.getState().toast("拆解完成");
  } catch (e: any) {
    useUi.getState().toast("拆解失败:" + e.message.slice(0, 40));
  }
}
