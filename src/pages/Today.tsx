import { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import NorthStar from "../components/NorthStar";
import Onboarding from "../components/Onboarding";
import { useData, useUi } from "../store";
import { DEFAULT_TYPE, PLAT_LABEL, PLAT_TIME, TYPES } from "../lib/constants";
import { composerUrl, fmtTime, initial, isToday, uid } from "../lib/utils";
import { generateDraft } from "../lib/llm";
import { assignSchedule, recomputeSim } from "../lib/schedule";
import { publishDraftNow, scheduleDraftBackend, tearSwipe } from "../lib/actions";
import { apiListInspiration, apiRunMonitor } from "../lib/api";
import { type TrendItem } from "../lib/mockTrends";
import type { Account, Draft, Platform, ResultTier, PublishPostOptions } from "../lib/types";

function isTodayish(d: Draft) {
  return isToday(d.created) || isToday(d.scheduledAt) || isToday(d.publishedAt);
}

/** 把 LLM 报错翻成人话(给「再生成」反馈用)。 */
function friendlyGenErr(msg: string): string {
  if (/401|authentication|invalid x-api-key|invalid api key/i.test(msg)) return "AI key 无效 · 去设置检查 Anthropic key";
  if (/429|rate|overloaded/i.test(msg)) return "AI 暂时限流 · 稍后再试";
  if (/Failed to fetch|NetworkError|load failed/i.test(msg)) return "连不上 anthropic.com · 检查网络";
  if (/NO_KEY/.test(msg)) return "没填 AI key(走的是 mock 占位文案)";
  return msg.slice(0, 50);
}

export default function Today() {
  const data = useData((s) => s.data);
  const setData = useData((s) => s.setData);
  const { toast, setExpanded } = useUi();
  const radarCount = useUi((s) => s.radarCount);
  const go = useUi((s) => s.go);
  const [showTag, setShowTag] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [seedTopics, setSeedTopics] = useState<string[]>([]);

  const acctOf = (id: string) => data.accounts.find((a) => a.id === id);
  const pending = data.drafts.filter((d) => d.status === "pending");
  const untagged = data.drafts.filter((d) => d.status === "published" && !d.result);
  const hasTodayApproved = data.drafts.some((d) => d.status === "approved" && isTodayish(d));
  const showBigGen = !pending.length && !hasTodayApproved;

  async function genToday() {
    setGenerating(true);
    const cur = useData.getState().data;
    const pats = cur.swipes.filter((s) => s.teardown);
    const newDrafts: Draft[] = [];
    let i = 0;
    let made = 0;
    let fail = 0;
    let err: Error | null = null;
    for (const a of cur.accounts) {
      for (let k = 0; k < (cur.settings.dailyPerAccount || 2); k++) {
        const pat = pats.length ? pats[i++ % pats.length] : null;
        const topic = seedTopics.length ? seedTopics[made % seedTopics.length] : "";
        made++;
        try {
          const d = await generateDraft(cur.settings, [...cur.drafts, ...newDrafts], a, DEFAULT_TYPE[a.platform], topic, pat ? pat.pattern!.template : "");
          d.patternId = pat ? pat.pattern!.id : null;
          newDrafts.push(d);
        } catch (e: any) {
          err = e;
          fail++;
        }
      }
    }
    setGenerating(false);
    if (!newDrafts.length) {
      toast(err ? "生成失败:" + friendlyGenErr(err.message) : "没生成内容 · 先在「话术与人格」加账号");
      return;
    }
    setData((d) => {
      d.drafts.push(...newDrafts);
      recomputeSim(d.drafts, d.accounts);
    });
    toast(fail ? `生成 ${newDrafts.length} 条 · ${fail} 条失败(${friendlyGenErr(err?.message || "")})` : `生成 ${newDrafts.length} 条 ✨`);
  }

  function approvePlat(p: Platform) {
    const approvedIds: string[] = [];
    setData((d) => {
      d.drafts
        .filter((x) => x.platform === p && x.status === "pending" && !((x.sim?.score || 0) >= d.settings.simThreshold || x.disclosure_required))
        .forEach((x) => {
          x.status = "approved";
          assignSchedule(x, d.drafts, d.settings);
          approvedIds.push(x.id);
        });
    });
    setExpanded(p, true);
    const leftover = useData.getState().data.drafts.some((x) => x.platform === p && x.status === "pending");
    toast(`已批准 ${approvedIds.length} 条` + (leftover ? "(带旗标的留你手动处理)" : ""));
    approvedIds.forEach((id) => void scheduleDraftBackend(id));
  }

  if (!data.accounts.length) {
    return (
      <>
        <TopBar view="today" />
        <div className="view">
          <div className="empty">
            <b>先去「话术与人格」加账号</b>给每个号设一套人格,我才能为它生成内容。
          </div>
        </div>
      </>
    );
  }

  const right = showBigGen ? (
    <div className="date-chip">📅 {new Date().toLocaleDateString("zh-CN")} · 本地时间</div>
  ) : (
    <div className="row">
      <div className="date-chip">📅 {new Date().toLocaleDateString("zh-CN")}</div>
      <button className="btn ghost sm" disabled={generating} onClick={genToday}>
        {generating ? <span className="spin" /> : "✨"} 再生成一批
      </button>
    </div>
  );

  const plats = [...new Set(data.accounts.map((a) => a.platform))];

  return (
    <>
      <TopBar view="today" right={right} />
      <div className="view">
        <NorthStar />
        <Onboarding onGenerate={genToday} generating={generating} />

        {radarCount > 0 && (
          <div className="card" style={{ marginBottom: 16, padding: "12px 16px", borderColor: "#F3D8CF", background: "linear-gradient(160deg,var(--brand-soft),#FFF6F1)" }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <b style={{ fontSize: 13.5, color: "var(--brand-deep)" }}>📡 {radarCount} 条大V新帖待回复 · 越快回越吃流量</b>
              <button className="btn sm" onClick={() => go("radar")}>
                去雷达处理
              </button>
            </div>
          </div>
        )}

        <PersonaStrip />

        {showBigGen && !generating && (
          <div className="card" style={{ textAlign: "center", padding: 34, marginBottom: 16 }}>
            <div className="display" style={{ fontSize: 20, marginBottom: 6 }}>
              今天还没生成内容 🌱
            </div>
            <div className="hint" style={{ marginBottom: 16 }}>
              点一下,我按每个账号的人格 + 爆款 pattern 自动起草今天的候选内容。
            </div>
            <button className="btn" disabled={generating} onClick={genToday}>
              {generating ? <span className="spin" /> : "✨"} 一键生成今日内容
            </button>
          </div>
        )}

        {generating && (
          <div className="dgrid" style={{ marginBottom: 16 }}>
            {Array.from({ length: Math.max(2, data.accounts.length) }).map((_, i) => (
              <div className="draft" key={i} style={{ padding: 14 }}>
                <div className="skeleton" style={{ height: 14, width: "55%", marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 12, marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 12, width: "85%", marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 12, width: "70%" }} />
              </div>
            ))}
          </div>
        )}

        {!!untagged.length && (
          <div className="card" style={{ marginBottom: 16, borderColor: "#E8D6A8", background: "#FFFDF7" }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <b className="display" style={{ fontSize: 15 }}>
                  昨天发的 {untagged.length} 条,效果怎么样?
                </b>
                <div className="hint">标一下,赢家会自动喂回起草记忆,越用越准。</div>
              </div>
              <button className="btn ghost sm" onClick={() => setShowTag((v) => !v)}>
                去标记表现
              </button>
            </div>
            {showTag && (
              <div style={{ marginTop: 12 }}>
                {untagged.map((d) => (
                  <TagRow key={d.id} d={d} acctOf={acctOf} />
                ))}
              </div>
            )}
          </div>
        )}

        {plats.map((p) => (
          <PlatformCard key={p} p={p} acctOf={acctOf} onApprove={approvePlat} />
        ))}

        <TrendsBar selected={seedTopics} setSelected={setSeedTopics} />
      </div>
    </>
  );
}

function PersonaStrip() {
  const accounts = useData((s) => s.data.accounts);
  if (!accounts.length) return null;
  return (
    <div className="pstrip">
      {accounts.map((a) => (
        <div className="pchip" key={a.id}>
          <div className="top">
            <div className="acct-av" style={{ background: a.color, width: 28, height: 28, fontSize: 11 }}>
              {initial(a.handle)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.handle}</div>
              <span className={"platTag p-" + a.platform} style={{ fontSize: 9 }}>
                {PLAT_LABEL[a.platform]}
              </span>
            </div>
          </div>
          <div className="st">{a.persona.stance || a.persona.voice || ""}</div>
        </div>
      ))}
    </div>
  );
}

function TrendsBar({ selected, setSelected }: { selected: string[]; setSelected: (t: string[]) => void }) {
  const useBackend = useData((s) => s.data.settings.useBackend);
  const apiBase = useData((s) => s.data.settings.apiBase);
  const setData = useData((s) => s.setData);
  const toast = useUi((s) => s.toast);
  const [groups, setGroups] = useState<Record<string, TrendItem[]>>({});
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);

  async function load(refresh: boolean) {
    if (!useBackend) {
      setGroups({});
      setLive(false);
      if (refresh) toast("趋势来自真实数据 · 去「设置」开启后端 + 加对标账号");
      return;
    }
    setLoading(true);
    if (refresh) await apiRunMonitor(apiBase);
    const { data } = await apiListInspiration(apiBase);
    setLoading(false);
    const m: Record<string, TrendItem[]> = {};
    (data || []).forEach((d) => {
      const topic = (d.topic || d.raw || "").split("\n")[0].trim().slice(0, 60);
      if (!topic) return;
      (m[d.platform] = m[d.platform] || []).push({ platform: d.platform as Platform, topic, score: d.score ?? 0, example: d.raw || topic });
    });
    setGroups(m);
    setLive(Object.keys(m).length > 0);
    if (refresh && !Object.keys(m).length) toast("暂无真实趋势 · 在「话术与人格 → 追踪」加对标账号,并确保已接 X 数据源");
  }

  useEffect(() => {
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useBackend, apiBase]);

  function toggle(topic: string) {
    setSelected(selected.includes(topic) ? selected.filter((x) => x !== topic) : [...selected, topic]);
  }
  function save(it: TrendItem, key: string) {
    const id = uid();
    setData((d) => {
      d.swipes.unshift({ id, platform: it.platform, source: "趋势·" + (it.tag || it.platform), metrics: "🔥" + it.score, raw: it.example || it.topic, teardown: null, pattern: null });
    });
    setSaved((s) => ({ ...s, [key]: true }));
    tearSwipe(id);
    toast("已存入爆款库 · 拆解中…");
  }

  const plats = Object.keys(groups);

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: open || selected.length ? 12 : 0 }}>
        <div className="row" style={{ alignItems: "center", gap: 9 }}>
          <b className="display" style={{ fontSize: 15 }}>
            📈 今日趋势 Scout · 找灵感
          </b>
          <span className="pill-s ps-blue">蹭趋势:{selected.length ? "开 (" + selected.length + ")" : "关"}</span>
          {open && live && <span className="pill-s ps-mut">真实数据</span>}
        </div>
        <div className="row" style={{ gap: 7 }}>
          {open && (
            <button className="btn ghost sm" disabled={loading} onClick={() => load(true)}>
              {loading ? <span className="spin" /> : "⟳"} 刷新
            </button>
          )}
          <button className="btn ghost sm" onClick={() => setOpen((v) => !v)}>
            {open ? "收起" : "展开找灵感"}
          </button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="row" style={{ gap: 6, marginBottom: open ? 12 : 0 }}>
          {selected.map((t) => (
            <button key={t} className="pill-s ps-brand" style={{ border: "none", cursor: "pointer" }} onClick={() => toggle(t)} title="点掉移除">
              {t.slice(0, 24)} ✕
            </button>
          ))}
        </div>
      )}

      {open && plats.map((p) => (
        <div key={p} style={{ marginBottom: 10 }}>
          <span className={"platTag p-" + p} style={{ display: "inline-block", marginBottom: 8 }}>
            {PLAT_LABEL[p as Platform]}
          </span>
          {groups[p].map((it, i) => {
            const key = p + "-" + i;
            const sel = selected.includes(it.topic);
            return (
              <div className="swrow" key={key} style={{ alignItems: "center", marginBottom: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 13.5 }}>
                    {it.topic} {it.tag && <span style={{ color: "var(--blue)" }}>#{it.tag}</span>}
                  </div>
                  <div className="hint" style={{ marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    🔥 热度 {it.score} · 例:{(it.example || "").slice(0, 44)}…
                  </div>
                </div>
                <div className="row" style={{ gap: 7 }}>
                  <button className={"btn sm " + (sel ? "" : "soft")} onClick={() => toggle(it.topic)}>
                    {sel ? "✓ 已选" : "用它生成"}
                  </button>
                  <button className="btn ghost sm" disabled={!!saved[key]} onClick={() => save(it, key)}>
                    {saved[key] ? "✓" : "存入爆款库"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {open && !plats.length && (
        <div className="hint" style={{ marginTop: 4 }}>
          {loading ? "加载中…" : "还没真实趋势 · 在「话术与人格 → 追踪」加对标账号,接好 X 数据源后点「刷新」(或雷达「现在检查」)。"}
        </div>
      )}
    </div>
  );
}

function PlatformCard({ p, acctOf, onApprove }: { p: Platform; acctOf: (id: string) => Account | undefined; onApprove: (p: Platform) => void }) {
  const data = useData((s) => s.data);
  const open = useUi((s) => !!s.expanded[p]);
  const toggleExpanded = useUi((s) => s.toggleExpanded);

  const cand = data.drafts.filter((d) => d.platform === p && d.status === "pending");
  const appr = data.drafts.filter((d) => d.platform === p && d.status === "approved");
  const sent = data.drafts.filter((d) => d.platform === p && d.status === "published" && isToday(d.publishedAt));
  const ibN = data.inbox.filter((m) => m.platform === p && m.status === "new").length;
  const ready = cand.length > 0;
  const total = cand.length + appr.length + sent.length;

  return (
    <div className={"pcard" + (open ? " open" : "")}>
      <div className="ph">
        <div className={"picon p-" + p}>{PLAT_LABEL[p][0]}</div>
        <div>
          <div className="pname">{PLAT_LABEL[p]}</div>
          <div className="ptime">
            建议发布 {PLAT_TIME[p]}
            {p === "x" ? " · 已自动错峰" : ""}
          </div>
        </div>
        <div className="pmetrics">
          <div className="pm">
            <div className="n">{cand.length}</div>
            <div className="l">候选</div>
          </div>
          <div className="pm">
            <div className="n" style={{ color: "var(--blue)" }}>
              {ibN}
            </div>
            <div className="l">新互动</div>
          </div>
          <div className="pm">
            <div className="n" style={{ color: "var(--ready)" }}>
              {sent.length}/{total || 0}
            </div>
            <div className="l">已发</div>
          </div>
        </div>
        <div className="pactions">
          {ready ? (
            <span className="pill-s ps-ready">● 已就绪</span>
          ) : appr.length ? (
            <span className="pill-s ps-brand">待发送</span>
          ) : (
            <span className="pill-s ps-mut">无候选</span>
          )}
          <button className="btn ghost sm" onClick={() => toggleExpanded(p)}>
            {open ? "收起" : "查看 / 编辑"}
          </button>
          {ready && (
            <button className="btn sm" onClick={() => onApprove(p)}>
              批准 {PLAT_LABEL[p]} 全部
            </button>
          )}
        </div>
      </div>
      <div className="pbody">
        {!!cand.length && (
          <>
            <div className="mini" style={{ marginBottom: 10 }}>
              候选内容 · 审一眼可单条编辑/重生成,或上面一键批准全部:
            </div>
            <div className="dgrid">
              {cand.map((d) => (
                <DraftCard key={d.id} d={d} acctOf={acctOf} />
              ))}
            </div>
          </>
        )}
        {!!appr.length && (
          <>
            <div className="sect" style={{ marginTop: 16, fontSize: 14 }}>
              待发送 / 已排期
            </div>
            {appr.map((d) => (
              <SendRow key={d.id} d={d} acctOf={acctOf} />
            ))}
          </>
        )}
        {!cand.length && !appr.length && <div className="hint">这个平台今天没有候选,点上方「再生成一批」。</div>}
      </div>
    </div>
  );
}

function DraftCard({ d, acctOf }: { d: Draft; acctOf: (id: string) => Account | undefined }) {
  const setData = useData((s) => s.setData);
  const simThreshold = useData((s) => s.data.settings.simThreshold);
  const { toast, setExpanded } = useUi();
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState("");
  const [mediaVal, setMediaVal] = useState("");
  const [opts, setOpts] = useState<PublishPostOptions>({});
  const [regenning, setRegenning] = useState(false);

  const a = acctOf(d.account_id) || ({ handle: "?", color: "#888", persona: {} } as Account);
  const simHigh = (d.sim?.score || 0) >= simThreshold;
  const flag = simHigh || d.disclosure_required;

  function startEdit() {
    if (editing) {
      const L = editVal.split("\n");
      const media = mediaVal.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
      setData((dd) => {
        const t = dd.drafts.find((x) => x.id === d.id);
        if (t) {
          t.hook = L[0] || "";
          t.body = L.slice(1).join("\n");
          t.cta = "";
          t.mediaUrls = media.length ? media : undefined;
          t.options = Object.values(opts).some((v) => v) ? opts : undefined;
        }
        recomputeSim(dd.drafts, dd.accounts);
      });
      setExpanded(d.platform, true);
      setEditing(false);
      toast("已更新");
    } else {
      setEditVal([d.hook, d.body, d.cta].filter(Boolean).join("\n"));
      setMediaVal((d.mediaUrls || []).join("\n"));
      setOpts(d.options || {});
      setEditing(true);
    }
  }

  async function regen() {
    setRegenning(true);
    try {
      const cur = useData.getState().data;
      const nd = await generateDraft(cur.settings, cur.drafts, a, d.type, d.topic, "");
      setData((dd) => {
        const t = dd.drafts.find((x) => x.id === d.id);
        if (t) Object.assign(t, { hook: nd.hook, body: nd.body, cta: nd.cta, disclosure_required: nd.disclosure_required, self: nd.self });
        recomputeSim(dd.drafts, dd.accounts);
      });
      setExpanded(d.platform, true);
      toast("已重生成");
    } catch (err: any) {
      toast("失败:" + err.message.slice(0, 40));
    }
    setRegenning(false);
  }

  function approve() {
    setData((dd) => {
      const t = dd.drafts.find((x) => x.id === d.id);
      if (t) {
        t.status = "approved";
        assignSchedule(t, dd.drafts, dd.settings);
      }
    });
    setExpanded(d.platform, true);
    const t = useData.getState().data.drafts.find((x) => x.id === d.id);
    toast(d.type === "x_post" && t?.scheduledAt ? "已批准 · 排期 " + fmtTime(t.scheduledAt) : "已批准");
    void scheduleDraftBackend(d.id);
  }

  function reject() {
    setData((dd) => {
      const t = dd.drafts.find((x) => x.id === d.id);
      if (t) t.status = "rejected";
    });
    setExpanded(d.platform, true);
  }

  return (
    <div className={"draft" + (flag ? " flagged" : "")}>
      <div className="dh">
        <div className="av" style={{ background: a.color }}>
          {initial(a.handle)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.handle}</div>
        </div>
        <span className="pill-s ps-mut" style={{ marginLeft: "auto" }}>
          {TYPES[d.type]}
        </span>
      </div>
      <div className="hk">{d.hook || <span style={{ color: "var(--ink-3)" }}>(无独立钩子)</span>}</div>
      <div className="bd">{d.body}</div>
      {d.cta && <div className="ct">↳ {d.cta}</div>}
      {editing && (
        <>
          <textarea className="edit" value={editVal} autoFocus onChange={(e) => setEditVal(e.target.value)} />
          <textarea
            className="edit"
            style={{ minHeight: 48 }}
            value={mediaVal}
            placeholder="媒体 URL(每行一条 / 逗号分隔,TikTok·IG 需要)"
            onChange={(e) => setMediaVal(e.target.value)}
          />
          {d.platform === "tiktok" && (
            <div className="row" style={{ gap: 12, padding: "0 13px 10px", fontSize: 12, color: "var(--ink-2)" }}>
              {(["disableComment", "disableDuet", "disableStitch"] as const).map((k) => (
                <label key={k} style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
                  <input type="checkbox" checked={!!opts[k]} onChange={(e) => setOpts((o) => ({ ...o, [k]: e.target.checked }))} />
                  {k.replace("disable", "禁")}
                </label>
              ))}
            </div>
          )}
        </>
      )}
      <div className="fl">
        {simHigh && <span className="pill-s ps-warn">⚠ 与 {d.sim!.peer} 相似 {d.sim!.score.toFixed(2)}</span>}
        {d.disclosure_required && <span className="pill-s ps-warn">⚠ 含推广 · 需披露 #ad</span>}
        {!!d.mediaUrls?.length && <span className="pill-s ps-blue">📎 {d.mediaUrls.length} 媒体</span>}
        {!flag && <span className="pill-s ps-ready">✓ persona {(d.self.persona || 0).toFixed(2)}</span>}
      </div>
      <div className="acts">
        <button onClick={startEdit}>{editing ? "保存" : "编辑"}</button>
        <button onClick={regen} disabled={regenning}>
          {regenning ? "…" : "重生成"}
        </button>
        <button className="no" onClick={reject}>
          删
        </button>
        <button className="ok" onClick={approve}>
          批准 ✓
        </button>
      </div>
    </div>
  );
}

function SendRow({ d, acctOf }: { d: Draft; acctOf: (id: string) => Account | undefined }) {
  const toast = useUi((s) => s.toast);
  const setExpanded = useUi((s) => s.setExpanded);
  const useBackend = useData((s) => s.data.settings.useBackend);
  const channel = useData((s) => s.data.settings.channel);
  const a = acctOf(d.account_id) || ({ handle: "?" } as Account);
  const now = Date.now();
  const ready = !d.scheduledAt || now >= d.scheduledAt;
  const [publishing, setPublishing] = useState(false);

  function copyText() {
    navigator.clipboard?.writeText([d.hook, d.body, d.cta].filter(Boolean).join("\n")).then(
      () => toast("已复制"),
      () => toast("复制失败")
    );
  }
  async function publish() {
    setPublishing(true);
    await publishDraftNow(d.id);
    setExpanded(d.platform, true);
    setPublishing(false);
  }
  const sendLabel = useBackend && channel !== "manual" ? "通过 " + channel + " 发布" : "标记已发";

  return (
    <div className="swrow" style={{ alignItems: "center" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row" style={{ gap: 7, alignItems: "center" }}>
          <span className={"platTag p-" + d.platform}>{PLAT_LABEL[d.platform]}</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{a.handle}</span>
          {d.type === "x_post" &&
            (ready ? (
              <span className="schip ps-ready">✓ 到点可发</span>
            ) : (
              <span className="schip ps-warn">⏳ {fmtTime(d.scheduledAt!)}</span>
            ))}
        </div>
        <div style={{ fontSize: 13, marginTop: 5 }}>
          {d.hook} <span style={{ color: "var(--ink-3)" }}>{d.body.slice(0, 50)}…</span>
        </div>
      </div>
      <div className="row" style={{ gap: 7 }}>
        <button className="btn ghost sm" onClick={copyText}>
          复制
        </button>
        <a className="btn ghost sm" href={composerUrl[d.platform]} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
          打开 {PLAT_LABEL[d.platform]}
        </a>
        <button className="btn sm" onClick={publish} disabled={!ready || publishing}>
          {publishing ? <span className="spin" /> : sendLabel}
        </button>
      </div>
    </div>
  );
}

function TagRow({ d, acctOf }: { d: Draft; acctOf: (id: string) => Account | undefined }) {
  const setData = useData((s) => s.setData);
  const toast = useUi((s) => s.toast);
  const a = acctOf(d.account_id) || ({ handle: "?" } as Account);
  const tier = d.result?.tier;

  function setTier(t: ResultTier) {
    setData((dd) => {
      const x = dd.drafts.find((y) => y.id === d.id);
      if (x) x.result = { tier: t, loggedAt: Date.now() };
    });
    toast(t === "win" ? "标为爆款 · 已喂回起草记忆 🔥" : "已记录");
  }

  return (
    <div className="swrow" style={{ alignItems: "center" }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span className={"platTag p-" + d.platform}>{PLAT_LABEL[d.platform]}</span>{" "}
        <b style={{ fontSize: 13 }}>{d.hook || d.topic}</b>
      </div>
      <div className="row" style={{ gap: 5 }}>
        <button className={"btn " + (tier === "win" ? "" : "ghost") + " sm"} onClick={() => setTier("win")}>
          🔥
        </button>
        <button className={"btn " + (tier === "mid" ? "dark" : "ghost") + " sm"} onClick={() => setTier("mid")}>
          还行
        </button>
        <button className={"btn " + (tier === "flop" ? "dark" : "ghost") + " sm"} onClick={() => setTier("flop")}>
          🥶
        </button>
      </div>
    </div>
  );
}
