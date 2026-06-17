import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { useData, useUi } from "../store";
import { PLAT_LABEL } from "../lib/constants";
import { initial, xReplyUrl } from "../lib/utils";
import { fmtNum } from "../lib/stats";
import { apiListMentions, apiMentionAction, apiListTracked, apiListInspiration, apiRunMonitor, apiStatus, type Mention, type Inspiration, type BackendStatus } from "../lib/api";

function ago(iso: string): { label: string; urgent: boolean } {
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.max(0, Math.floor(ms / 60000));
  if (m < 60) return { label: m + "m", urgent: m < 15 };
  const h = Math.floor(m / 60);
  if (h < 24) return { label: h + "h", urgent: false };
  return { label: Math.floor(h / 24) + "d", urgent: false };
}

export default function Radar() {
  const { useBackend, apiBase } = useData((s) => s.data.settings);
  const { go, setVoiceTab, setRadarCount, toast } = useUi();
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [counts, setCounts] = useState({ bigv: 0, competitor: 0 });
  const [insp, setInsp] = useState<Inspiration[]>([]);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<BackendStatus | null>(null);

  /** X 数据源是否接好:配了 APIFY_TOKEN,或 X 走免费 twscrape。 */
  const xReady = !!status && (status.apifyToken || status.xSource === "twscrape");

  async function load() {
    if (!useBackend) return;
    const [m, t, i, s] = await Promise.all([
      apiListMentions(apiBase, "drafted"), apiListTracked(apiBase), apiListInspiration(apiBase), apiStatus(apiBase),
    ]);
    setMentions(m.data);
    setRadarCount(m.data.length);
    setCounts({ bigv: t.data.filter((x) => x.kind === "bigv").length, competitor: t.data.filter((x) => x.kind === "competitor").length });
    setInsp(i.data.slice(0, 12));
    setStatus(s);
  }
  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useBackend, apiBase]);

  async function checkNow() {
    setChecking(true);
    const r = await apiRunMonitor(apiBase);
    await load();
    setChecking(false);
    if (r?.skipped === "NO_APIFY_TOKEN") toast("后端还没接 X 数据源:去 server/.env 填 APIFY_TOKEN 再重启");
    else toast(`已检查 · 新增 ${r?.mentions ?? 0} 条待回复 / ${r?.inspiration ?? 0} 条灵感`);
  }
  async function runDemo() {
    setChecking(true);
    await apiRunMonitor(apiBase, true);
    await load();
    setChecking(false);
    toast("已生成 demo 示例 · 这就是大V回复长的样子(可点忽略清掉)");
  }

  /** 没接数据源时的统一提示块 + 试跑 demo。 */
  const NoSource = () => (
    <div className="banner" style={{ marginBottom: 18 }}>
      ⚠️ 还没接 <b>X 数据源</b>,所以抓不到大V/对标账号的帖子。去 <code>server/.env</code> 填 <code>APIFY_TOKEN</code> 再重启 <code>npm run dev:all</code>,然后点右上「现在检查」。
      <div style={{ marginTop: 10 }}>
        <button className="btn sm" disabled={checking} onClick={runDemo}>🧪 先试跑 demo 看效果</button>
      </div>
    </div>
  );

  const right = useBackend ? (
    <div className="row" style={{ gap: 8 }}>
      <button className="btn ghost sm" disabled={checking} onClick={runDemo}>🧪 试跑 demo</button>
      <button className="btn ghost sm" disabled={checking} onClick={checkNow}>
        {checking ? <span className="spin" /> : "🛰️"} 现在检查
      </button>
    </div>
  ) : undefined;

  if (!useBackend) {
    return (
      <>
        <TopBar view="radar" right={right} />
        <div className="view">
          <div className="empty">
            <b>雷达需要后端</b>
            大V监控、自动草拟、灵感抓取都在后端跑。去「设置」开启「接后端真发布」并连上后端,再到「话术与人格 → 📡 追踪」添加大V。
            <br />
            <button className="btn" style={{ marginTop: 14 }} onClick={() => go("settings")}>
              去设置开启
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar view="radar" right={right} />
      <div className="view">
        {/* 追踪概览 */}
        <div className="row" style={{ gap: 12, marginBottom: 16 }}>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div className="display" style={{ fontSize: 24, color: "var(--brand)" }}>{counts.bigv}</div>
            <div className="hint">追踪大V</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div className="display" style={{ fontSize: 24 }}>{counts.competitor}</div>
            <div className="hint">对标账号</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div className="display" style={{ fontSize: 24, color: "var(--blue)" }}>{mentions.length}</div>
            <div className="hint">待回复</div>
          </div>
          <div className="card" style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <span className="hint">在「话术与人格 → 追踪」批量添加要追踪的账号</span>
            <button className="btn soft sm" onClick={() => { setVoiceTab("track"); go("voice"); }}>
              管理追踪
            </button>
          </div>
        </div>

        <div className="banner">
          📡 大V一发新帖,后端第一时间用对应人格 AI 草拟回复;<b>回复速度越快越吃流量红利</b>。你只需审一眼 → 一键打开原生回复框发出(reply 永远人工发)。
        </div>

        <div className="sect" style={{ marginTop: 0 }}>大V待回复 {mentions.length ? `· ${mentions.length}` : ""}</div>
        {mentions.length ? (
          mentions.map((m) => <MentionCard key={m.id} m={m} apiBase={apiBase} onChange={load} toast={toast} />)
        ) : !xReady ? (
          <NoSource />
        ) : (
          <div className="hint" style={{ marginBottom: 18 }}>暂无大V新帖待回复 · 监控每几分钟扫一次,也可点右上「现在检查」。</div>
        )}

        <div className="sect">💡 niche 灵感流</div>
        {insp.length ? (
          <>
            {insp.map((it, i) => (
              <div className="swrow" key={i} style={{ alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ gap: 7, marginBottom: 3 }}>
                    <span className={"platTag p-" + it.platform}>{PLAT_LABEL[it.platform]}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{it.source}</span>
                    {it.metrics && <span className="pill-s ps-mut">{it.metrics}</span>}
                  </div>
                  <div className="hint" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {(it.raw || it.topic || "").slice(0, 80)}
                  </div>
                </div>
                {it.url && (
                  <a className="btn ghost sm" href={it.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                    看原帖
                  </a>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="hint">{xReady ? "暂无灵感 · 监控会从对标账号抓热门帖,点右上「现在检查」试试" : "(接上 X 数据源后,这里会出现对标账号的热门帖,点「用它生成」一键复刻)"}</div>
        )}
      </div>
    </>
  );
}

function MentionCard({ m, apiBase, onChange, toast }: { m: Mention; apiBase: string; onChange: () => void; toast: (s: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(m.reply || "");
  const t = ago(m.createdAt);

  async function send() {
    const text = editing ? val : m.reply || "";
    navigator.clipboard?.writeText(text);
    if (m.platform === "x" && m.postUrl) window.open(xReplyUrl(text, m.postUrl), "_blank");
    else if (m.postUrl) window.open(m.postUrl, "_blank");
    await apiMentionAction(apiBase, m.id, "sent");
    toast(m.platform === "x" ? "已打开 X 回复框 · 按发送即可" : "回复已复制 · 去原帖粘贴发送");
    onChange();
  }
  async function ignore() {
    await apiMentionAction(apiBase, m.id, "ignore");
    onChange();
  }

  return (
    <div className={"ibitem" + (m.flagged ? " flagged" : "")}>
      <div className="ih">
        <div className="av" style={{ background: "var(--ink)" }}>{initial((m.author || "?").replace(/^[@u/]+/, ""))}</div>
        <div>
          <div className="from">{m.author || "大V"}</div>
        </div>
        <span className={"schip " + (t.urgent ? "ps-warn" : "ps-mut")} style={{ marginLeft: "auto" }} title="距后端检测到该帖的时间">
          {t.urgent ? "🔥 " : "⏱ "}待回复 {t.label}
        </span>
        <span className={"platTag p-" + m.platform}>{PLAT_LABEL[m.platform]}</span>
        {m.flagged && <span className="pill-s ps-warn">敏感 · 建议人工</span>}
        {m.postUrl && (
          <a className="pill-s ps-blue" href={m.postUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>🔗 原帖</a>
        )}
      </div>
      <div className="msg">{m.postText || "(无正文)"}</div>
      {!editing && m.reply && <div className="reply">💬 {m.reply}</div>}
      {editing && <textarea className="redit" value={val} autoFocus onChange={(e) => setVal(e.target.value)} />}
      <div className="iacts">
        <button className="btn sm" onClick={send}>⚡ 一键发送</button>
        <button className="btn ghost sm" onClick={() => setEditing((v) => !v)}>{editing ? "完成" : "编辑"}</button>
        <button className="btn ghost sm" onClick={ignore}>忽略</button>
      </div>
    </div>
  );
}
