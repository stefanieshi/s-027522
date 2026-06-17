import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { useData, useUi } from "../store";
import { PLAT_LABEL, PLATFORMS } from "../lib/constants";
import { initial } from "../lib/utils";
import { tearSwipe } from "../lib/actions";
import { generateDraft } from "../lib/llm";
import { DEFAULT_TYPE } from "../lib/constants";
import { recomputeSim } from "../lib/schedule";
import {
  apiListTracked, apiImportTracked, apiDeleteTracked, UNREACHABLE, type TrackedAccount,
  apiListTwscrapeAccounts, apiAddTwscrapeAccount, apiLoginTwscrapeAccounts, apiDeleteTwscrapeAccount, type TwscrapeAccount,
} from "../lib/api";
import { AccountModal, SwipeModal, RadarModal, BulkUploadModal } from "../components/modals";
import type { Platform, Draft, Swipe } from "../lib/types";

export default function Voice() {
  const voiceTab = useUi((s) => s.voiceTab);
  const setVoiceTab = useUi((s) => s.setVoiceTab);

  const right = (
    <div className="subtabs" style={{ margin: 0, border: "none" }}>
      <button className={voiceTab === "persona" ? "active" : ""} onClick={() => setVoiceTab("persona")}>
        人格
      </button>
      <button className={voiceTab === "tmpl" ? "active" : ""} onClick={() => setVoiceTab("tmpl")}>
        回复话术
      </button>
      <button className={voiceTab === "swipe" ? "active" : ""} onClick={() => setVoiceTab("swipe")}>
        爆款库
      </button>
      <button className={voiceTab === "track" ? "active" : ""} onClick={() => setVoiceTab("track")}>
        📡 追踪
      </button>
    </div>
  );

  return (
    <>
      <TopBar view="voice" right={right} />
      <div className="view">
        {voiceTab === "persona" && <PersonaTab />}
        {voiceTab === "tmpl" && <TemplateTab />}
        {voiceTab === "swipe" && <SwipeTab />}
        {voiceTab === "track" && <TrackTab />}
      </div>
    </>
  );
}

function TrackTab() {
  const { useBackend, apiBase } = useData((s) => s.data.settings);
  const accounts = useData((s) => s.data.accounts);
  const toast = useUi((s) => s.toast);
  const [list, setList] = useState<TrackedAccount[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!useBackend) return;
    const { data } = await apiListTracked(apiBase);
    setList(data);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useBackend, apiBase]);

  if (!useBackend) {
    return (
      <div className="empty">
        <b>追踪需要后端</b>
        去「设置 → 后端真发布」开启并连上后端,即可批量追踪对标账号、监控大V。
      </div>
    );
  }

  const competitors = list.filter((t) => t.kind === "competitor");
  const bigvs = list.filter((t) => t.kind === "bigv");

  async function del(id: string) {
    if (await apiDeleteTracked(apiBase, id)) {
      setList((l) => l.filter((t) => t.id !== id));
    }
  }

  return (
    <>
      <div className="banner">
        ℹ️ 批量追踪:<b>对标账号</b>用于自动抓你 niche 的热门内容喂「今日趋势」;<b>大V账号</b>会被后端监控,新帖第一时间 AI 草拟回复 + 通知你审核(reply 永远人工发)。
      </div>
      <div className="grid2" style={{ alignItems: "start" }}>
        <ImportCard kind="competitor" title="🎯 对标账号(找灵感)" accounts={accounts} apiBase={apiBase} onDone={load} toast={toast} />
        <ImportCard kind="bigv" title="📡 大V账号(监控+回复)" accounts={accounts} apiBase={apiBase} onDone={load} toast={toast} />
      </div>

      <div className="sect">已追踪 · 对标 {competitors.length}</div>
      <TrackedList rows={competitors} onDelete={del} loading={loading} />
      <div className="sect">已追踪 · 大V {bigvs.length}</div>
      <TrackedList rows={bigvs} onDelete={del} loading={loading} />

      <div className="sect">🐦 X 抓取小号(免费源)</div>
      <TwscrapeCard apiBase={apiBase} toast={toast} />
    </>
  );
}

/** 在网页里管理免费 X 抓取(twscrape)用的小号 —— 加号/登录/删除,凭据只到本机后端。 */
function TwscrapeCard({ apiBase, toast }: { apiBase: string; toast: (m: string) => void }) {
  const [list, setList] = useState<TwscrapeAccount[]>([]);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({ username: "", password: "", email: "", emailPassword: "" });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function load() {
    const { data, error } = await apiListTwscrapeAccounts(apiBase);
    if (error) {
      setList([]);
      setStatus(error === UNREACHABLE ? "后端未连上" : "sidecar 未启动 · 在终端 cd server/x-scraper && ./run.sh");
    } else {
      setList(data);
      const active = data.filter((a) => a.active).length;
      setStatus(`${data.length} 个小号 · ${active} 个可用` + (data.length && !active ? "(都未登录,点「重新登录」)" : ""));
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  async function add() {
    if (!f.username || !f.password || !f.email || !f.emailPassword) return toast("用户名/密码/邮箱/邮箱密码都要填");
    setBusy(true);
    const r = await apiAddTwscrapeAccount(apiBase, f);
    setBusy(false);
    if (r.error) return toast(r.error === UNREACHABLE ? "后端未连上 · 确认 npm run dev:all" : "添加失败:" + r.error.slice(0, 60));
    if (r.ok === false) return toast("添加失败:" + (r as any).error?.slice?.(0, 60));
    toast(r.logged_in ? "已添加并登录 ✅" : "已添加,但登录未成功:" + ((r.login_error || "").slice(0, 50) || "稍后点重新登录"));
    setF({ username: "", password: "", email: "", emailPassword: "" });
    load();
  }
  async function relogin() {
    setBusy(true);
    const r = await apiLoginTwscrapeAccounts(apiBase);
    setBusy(false);
    if (r.error) return toast("登录失败:" + r.error.slice(0, 60));
    toast(`登录完成 · ${r.active}/${r.total} 可用`);
    load();
  }
  async function del(username: string) {
    if (!confirm(`删除小号 @${username}?`)) return;
    if (await apiDeleteTwscrapeAccount(apiBase, username)) { toast("已删除"); load(); }
    else toast("删除失败");
  }

  return (
    <div className="card">
      <div className="banner" style={{ marginTop: 0 }}>
        ⚠️ 只用 <b>小号</b>(burner),别用主号。凭据只发到你<b>本机</b>后端、存进 sidecar 的 <code>accounts.db</code>,<b>不入库、不上传</b>。
        需先在终端起 sidecar(<code>cd server/x-scraper && ./run.sh</code>)并在 <code>server/.env</code> 设 <code>X_SOURCE=twscrape</code>;建议配代理(见 x-scraper/README)。
      </div>
      <div className="row" style={{ gap: 8, margin: "4px 0 10px", color: "var(--ink-soft)" }}>
        状态:{status || "检查中…"} <button className="btn ghost sm" disabled={busy} onClick={relogin} style={{ marginLeft: "auto" }}>重新登录</button>
      </div>
      <div className="grid2">
        <label className="fld"><span className="lab">用户名(@handle)</span><input className="in" value={f.username} onChange={set("username")} placeholder="burner_handle" /></label>
        <label className="fld"><span className="lab">密码</span><input className="in" type="password" value={f.password} onChange={set("password")} /></label>
        <label className="fld"><span className="lab">邮箱</span><input className="in" value={f.email} onChange={set("email")} placeholder="burner@mail.com" /></label>
        <label className="fld"><span className="lab">邮箱密码(或应用专用密码)</span><input className="in" type="password" value={f.emailPassword} onChange={set("emailPassword")} /></label>
      </div>
      <div className="mfoot" style={{ marginTop: 8 }}>
        <button className="btn" disabled={busy} onClick={add}>{busy ? "处理中…" : "添加并登录"}</button>
      </div>
      {list.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {list.map((a) => (
            <div className="row" key={a.username} style={{ gap: 8, padding: "4px 0", alignItems: "center" }}>
              <span className="pill-s">@{a.username}</span>
              <span style={{ color: a.active ? "var(--ok, green)" : "var(--bad, #c0392b)" }}>{a.active ? "可用" : a.error_msg ? "出错" : "未登录"}</span>
              {a.error_msg && <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>{String(a.error_msg).slice(0, 40)}</span>}
              <button className="btn ghost sm" style={{ marginLeft: "auto" }} onClick={() => del(a.username)}>删除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImportCard({
  kind,
  title,
  accounts,
  apiBase,
  onDone,
  toast,
}: {
  kind: "competitor" | "bigv";
  title: string;
  accounts: { id: string; handle: string }[];
  apiBase: string;
  onDone: () => void;
  toast: (m: string) => void;
}) {
  const [platform, setPlatform] = useState<Platform>("x");
  const [handles, setHandles] = useState("");
  const [niche, setNiche] = useState("");
  const [replyAccountId, setReplyAccountId] = useState(accounts[0]?.id || "");
  const [guideline, setGuideline] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    const arr = handles.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    if (!arr.length) {
      toast("贴一些账号(每行一个)");
      return;
    }
    setBusy(true);
    const r = await apiImportTracked(apiBase, { platform, kind, handles: arr, niche: niche.trim() || undefined, replyAccountId: kind === "bigv" ? replyAccountId : undefined, guideline: kind === "bigv" ? guideline.trim() || undefined : undefined });
    setBusy(false);
    if ("error" in r) {
      toast(r.error === UNREACHABLE ? "后端未连上" : "导入失败:" + r.error.slice(0, 40));
      return;
    }
    setHandles("");
    toast(`已加入 ${r.added} 个`);
    onDone();
  }

  return (
    <div className="card">
      <div className="sect" style={{ marginTop: 0 }}>
        {title}
      </div>
      <label className="fld">
        <span className="lab">平台</span>
        <select className="in" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {PLAT_LABEL[p]}
            </option>
          ))}
        </select>
      </label>
      <label className="fld">
        <span className="lab">账号(每行一个 handle / URL)</span>
        <textarea className="in" style={{ minHeight: 80 }} value={handles} placeholder={"@levelsio\n@naval"} onChange={(e) => setHandles(e.target.value)} />
      </label>
      {kind === "competitor" ? (
        <label className="fld">
          <span className="lab">niche 关键词(选填,辅助找灵感)</span>
          <input className="in" value={niche} placeholder="buildinpublic / indie hackers" onChange={(e) => setNiche(e.target.value)} />
        </label>
      ) : (
        <>
          <label className="fld">
            <span className="lab">以哪个号的人格回复</span>
            <select className="in" value={replyAccountId} onChange={(e) => setReplyAccountId(e.target.value)}>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.handle}
                </option>
              ))}
            </select>
          </label>
          <label className="fld">
            <span className="lab">回复基调(选填)</span>
            <input className="in" value={guideline} placeholder="真诚、给具体经验、不奉承" onChange={(e) => setGuideline(e.target.value)} />
          </label>
        </>
      )}
      <button className="btn" disabled={busy} onClick={submit}>
        {busy ? <span className="spin" /> : "＋"} 批量导入
      </button>
    </div>
  );
}

function TrackedList({ rows, onDelete }: { rows: TrackedAccount[]; onDelete: (id: string) => void; loading?: boolean }) {
  if (!rows.length) return <div className="hint" style={{ marginBottom: 8 }}>还没有,用上面批量导入。</div>;
  return (
    <div className="row" style={{ gap: 8 }}>
      {rows.map((t) => (
        <span key={t.id} className="pill-s ps-mut" style={{ gap: 7 }}>
          <span className={"platTag p-" + t.platform} style={{ fontSize: 9 }}>
            {PLAT_LABEL[t.platform as Platform] || t.platform}
          </span>
          @{t.handle}
          <button onClick={() => onDelete(t.id)} style={{ border: "none", background: "none", color: "var(--ink-3)", cursor: "pointer" }} title="移除">
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}

function PersonaTab() {
  const accounts = useData((s) => s.data.accounts);
  const setData = useData((s) => s.setData);
  const openModal = useUi((s) => s.openModal);

  function del(id: string) {
    if (confirm("删除该账号?")) setData((d) => void (d.accounts = d.accounts.filter((a) => a.id !== id)));
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 14 }}>
        <button className="btn" onClick={() => openModal(<AccountModal />)}>
          ＋ 新增账号
        </button>
      </div>
      {accounts.length ? (
        <div className="acct-grid">
          {accounts.map((a) => (
            <div className="acct" key={a.id}>
              <button className="x" title="删除账号" aria-label="删除账号" onClick={() => del(a.id)}>
                ✕
              </button>
              <div className="hd">
                <div className="av" style={{ background: a.color }}>
                  {initial(a.handle)}
                </div>
                <div>
                  <div className="h">{a.handle}</div>
                  <span className={"platTag p-" + a.platform}>{PLAT_LABEL[a.platform]}</span>
                </div>
              </div>
              <div className="meta">
                <b>语气</b> {a.persona.voice}
                <br />
                <b>立场</b> {a.persona.stance}
                <br />
                <b>禁用</b> {a.persona.taboo}
                <br />
                <b>格式</b> {a.persona.format}
              </div>
              <div style={{ marginTop: 11 }}>
                <button className="btn ghost sm" onClick={() => openModal(<AccountModal id={a.id} />)}>
                  编辑
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">
          <b>还没有账号</b>给每个号设一套独立人格。
        </div>
      )}
    </>
  );
}

function TemplateTab() {
  const templates = useData((s) => s.data.templates);
  const setData = useData((s) => s.setData);
  const toast = useUi((s) => s.toast);
  const [comment, setComment] = useState(templates.comment);
  const [dm, setDm] = useState(templates.dm);

  function save() {
    setData((d) => {
      d.templates.comment = comment;
      d.templates.dm = dm;
    });
    toast("话术已保存");
  }

  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <div className="hint" style={{ marginBottom: 14 }}>
        收件箱回复的基调模板。支持变量 <b>{"{name} {platform} {content}"}</b>。助手会按账号人格在此基础上个性化。
      </div>
      <label className="fld">
        <span className="lab">公开评论话术</span>
        <textarea className="in" style={{ minHeight: 90 }} value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <label className="fld">
        <span className="lab">私信话术</span>
        <textarea className="in" style={{ minHeight: 90 }} value={dm} onChange={(e) => setDm(e.target.value)} />
      </label>
      <button className="btn" onClick={save}>
        保存话术
      </button>
    </div>
  );
}

function SwipeTab() {
  const swipes = useData((s) => s.data.swipes);
  const setData = useData((s) => s.setData);
  const useBackend = useData((s) => s.data.settings.useBackend);
  const openModal = useUi((s) => s.openModal);
  const toast = useUi((s) => s.toast);
  const go = useUi((s) => s.go);
  const [busyId, setBusyId] = useState<string | null>(null);

  function del(id: string) {
    if (confirm("删除?")) setData((d) => void (d.swipes = d.swipes.filter((s) => s.id !== id)));
  }

  /** 用这条爆款的 pattern,给同平台的每个账号各生成一条草稿,进「今日任务」。 */
  async function genFromSwipe(s: Swipe) {
    if (!s.pattern) return toast("先点「拆解」,有了 pattern 才能生成");
    const cur = useData.getState().data;
    const accts = cur.accounts.filter((a) => a.platform === s.platform);
    if (!accts.length) return toast(`先加一个 ${PLAT_LABEL[s.platform]} 账号(话术与人格 → 人格)`);
    setBusyId(s.id);
    const made: Draft[] = [];
    let err = "";
    for (const a of accts) {
      try {
        const d = await generateDraft(cur.settings, [...cur.drafts, ...made], a, DEFAULT_TYPE[a.platform], "", s.pattern.template);
        d.patternId = s.pattern.id;
        made.push(d);
      } catch (e: any) {
        err = e?.message || String(e);
      }
    }
    setBusyId(null);
    if (!made.length) return toast("生成失败:" + (/NO_KEY/.test(err) ? "先在设置填 AI key" : err.slice(0, 40)));
    setData((d) => {
      d.drafts.push(...made);
      recomputeSim(d.drafts, d.accounts);
    });
    toast(`已为 ${made.length} 个账号生成草稿 → 去「今日任务」审核`);
    go("today");
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 14 }}>
        <button className="btn" onClick={() => openModal(<SwipeModal />)}>
          ＋ 收藏爆款
        </button>
        <button className="btn ghost" onClick={() => openModal(<BulkUploadModal />)}>
          ⬆️ 批量上传素材
        </button>
        {useBackend && (
          <button className="btn ghost" onClick={() => openModal(<RadarModal />)}>
            🔭 爆款雷达
          </button>
        )}
      </div>
      <div className="hint" style={{ marginBottom: 12 }}>
        收藏的爆款会被拆解成可复用 pattern,自动生成内容时轮流套用(只用结构、不抄原文)。
      </div>
      {swipes.length ? (
        swipes.map((s) => (
          <div className="swrow" key={s.id}>
            <div style={{ flex: 1 }}>
              <div className="row" style={{ gap: 7, marginBottom: 6 }}>
                <span className={"platTag p-" + s.platform}>{PLAT_LABEL[s.platform]}</span>
                <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{s.source}</span>
              </div>
              <div className="raw">{s.raw}</div>
              {s.pattern ? (
                <div className="pat">
                  ♻ {s.pattern.id} · {s.pattern.template}
                </div>
              ) : (
                <div className="hint" style={{ marginTop: 6 }}>
                  未拆解
                </div>
              )}
            </div>
            <div className="row" style={{ gap: 6, flexDirection: "column" }}>
              <button className="btn ghost sm" onClick={() => tearSwipe(s.id)}>
                {s.pattern ? "重拆" : "拆解"}
              </button>
              {s.pattern && (
                <button className="btn sm" disabled={busyId === s.id} onClick={() => genFromSwipe(s)}>
                  {busyId === s.id ? "…" : "✍️ 生成草稿"}
                </button>
              )}
              <button className="btn ghost sm" onClick={() => del(s.id)}>
                删除
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="empty">
          <b>爆款库空</b>粘进想学的爆款,一键拆成 pattern。
        </div>
      )}
    </>
  );
}
