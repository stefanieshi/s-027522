import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { useData, useUi } from "../store";
import { PLAT_LABEL } from "../lib/constants";
import { initial, xReplyUrl } from "../lib/utils";
import { generateReply } from "../lib/llm";
import { sendInboxReply } from "../lib/actions";
import { apiListMentions, apiMentionAction, type Mention } from "../lib/api";
import { InboxAddModal, PullInboxModal } from "../components/modals";
import type { InboxItem } from "../lib/types";

export default function Inbox() {
  const data = useData((s) => s.data);
  const setData = useData((s) => s.setData);
  const { toast, openModal } = useUi();
  const [genningAll, setGenningAll] = useState(false);

  const autoReply = data.settings.autoReply;

  const right = (
    <label className="toggle" onClick={() => setData((d) => void (d.settings.autoReply = !d.settings.autoReply))}>
      回复助手 <span className={"sw" + (autoReply ? " on" : "")} />
    </label>
  );

  async function genAll() {
    setGenningAll(true);
    const cur = useData.getState().data;
    const targets = cur.inbox.filter((x) => !x.reply && x.status !== "sent");
    const results: Record<string, { reply: string; flagged: boolean }> = {};
    for (const m of targets) {
      try {
        results[m.id] = await generateReply(cur.settings, cur.accounts, cur.templates, m);
      } catch {
        /* skip */
      }
    }
    setData((d) => {
      d.inbox.forEach((m) => {
        if (results[m.id]) {
          m.reply = results[m.id].reply;
          m.flagged = results[m.id].flagged;
        }
      });
    });
    setGenningAll(false);
    toast("回复已生成");
  }

  if (!data.inbox.length) {
    return (
      <>
        <TopBar view="inbox" right={right} />
        <div className="view">
          <MentionsRadar />
          <div className="empty">
            <b>收件箱是空的</b>对方主动发来的评论/私信会出现在这里。
            <br />
            <button className="btn ghost sm" style={{ marginTop: 12 }} onClick={() => openModal(<InboxAddModal />)}>
              + 手动加一条(测试)
            </button>
          </div>
        </div>
      </>
    );
  }

  const need = data.inbox.filter((m) => m.flagged && m.status !== "sent");
  const gen = data.inbox.filter((m) => m.reply && !m.flagged && m.status !== "sent");
  const pendingNoReply = data.inbox.filter((m) => !m.reply && !m.flagged && m.status !== "sent");
  const done = data.inbox.filter((m) => m.status === "sent");

  const block = (title: string, arr: InboxItem[]) =>
    arr.length ? (
      <div key={title}>
        <div className="sect">
          {title} · {arr.length}
        </div>
        {arr.map((m) => (
          <IbCard key={m.id} m={m} />
        ))}
      </div>
    ) : null;

  return (
    <>
      <TopBar view="inbox" right={right} />
      <div className="view">
        <MentionsRadar />
        <div className="banner">
          ℹ️ MVP:收件箱目前可手动添加;上线后接各平台 API 自动拉取真实互动。回复一律"一键打开原生发送框 + 你按发送",不走自动直发(冷自动 DM 会被封)。
        </div>
        <div className="row" style={{ marginBottom: 16 }}>
          <button className="btn" disabled={genningAll} onClick={genAll}>
            {genningAll ? <span className="spin" /> : "✨"} 一键生成所有回复
          </button>
          {data.settings.useBackend && (
            <button className="btn ghost" onClick={() => openModal(<PullInboxModal />)}>
              ⬇️ 拉取互动
            </button>
          )}
          <button className="btn ghost" onClick={() => openModal(<InboxAddModal />)}>
            + 加一条消息
          </button>
        </div>
        {block("需要你确认(敏感)", need)}
        {block("回复已生成", gen)}
        {block("待生成回复", pendingNoReply)}
        {block("已发送", done)}
      </div>
    </>
  );
}

function IbCard({ m }: { m: InboxItem }) {
  const setData = useData((s) => s.setData);
  const toast = useUi((s) => s.toast);
  const [genning, setGenning] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editVal, setEditVal] = useState("");

  async function gen() {
    setGenning(true);
    try {
      const cur = useData.getState().data;
      const r = await generateReply(cur.settings, cur.accounts, cur.templates, m);
      setData((d) => {
        const t = d.inbox.find((x) => x.id === m.id);
        if (t) {
          t.reply = r.reply;
          t.flagged = r.flagged;
        }
      });
    } catch (err: any) {
      toast("失败:" + err.message.slice(0, 40));
    }
    setGenning(false);
  }

  function saveEdit() {
    if (editing) {
      setData((d) => {
        const t = d.inbox.find((x) => x.id === m.id);
        if (t) t.reply = editVal;
      });
      setEditing(false);
      toast("已更新");
    } else {
      setEditVal(m.reply);
      setEditing(true);
    }
  }

  function send() {
    void sendInboxReply(m);
  }

  function ignore() {
    setData((d) => {
      const t = d.inbox.find((x) => x.id === m.id);
      if (t) t.status = "sent";
    });
  }

  return (
    <div className={"ibitem" + (m.flagged ? " flagged" : "")}>
      <div className="ih">
        <div className="av" style={{ background: m.color || "#888" }}>
          {initial(m.from.replace(/^@/, ""))}
        </div>
        <div>
          <div className="from">{m.from}</div>
        </div>
        <span className={"platTag p-" + m.platform} style={{ marginLeft: "auto" }}>
          {PLAT_LABEL[m.platform]}
        </span>
        {m.flagged && <span className="pill-s ps-warn">敏感 · 建议人工</span>}
      </div>
      <div className="msg">{m.msg}</div>
      {m.reply && <div className="reply">💬 {m.reply}</div>}
      {editing && <textarea className="redit" value={editVal} autoFocus onChange={(e) => setEditVal(e.target.value)} />}
      <div className="iacts">
        {!m.reply && (
          <button className="btn ghost sm" disabled={genning} onClick={gen}>
            {genning ? "…" : "✨ 生成回复"}
          </button>
        )}
        {m.reply && m.status !== "sent" && (
          <button className="btn sm" onClick={send}>
            ⚡ 一键发送
          </button>
        )}
        {m.reply && (
          <button className="btn ghost sm" onClick={saveEdit}>
            {editing ? "保存" : "编辑"}
          </button>
        )}
        {m.status !== "sent" ? (
          <button className="btn ghost sm" onClick={ignore}>
            忽略
          </button>
        ) : (
          <span className="pill-s ps-ready">已发送</span>
        )}
      </div>
    </div>
  );
}

/* ===================== 📡 大V雷达(后端监控 → AI 草稿 → 人工 approve) ===================== */
function MentionsRadar() {
  const { useBackend, apiBase } = useData((s) => s.data.settings);
  const setRadarCount = useUi((s) => s.setRadarCount);
  const toast = useUi((s) => s.toast);
  const [items, setItems] = useState<Mention[]>([]);

  async function load() {
    if (!useBackend) return;
    const { data } = await apiListMentions(apiBase, "drafted");
    setItems(data);
    setRadarCount(data.length);
  }
  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useBackend, apiBase]);

  if (!useBackend) return null;

  return (
    <div style={{ marginBottom: 18 }}>
      <div className="sect" style={{ marginTop: 0 }}>
        📡 大V雷达 {items.length ? `· ${items.length} 待回复` : ""}
      </div>
      {items.length ? (
        items.map((m) => <MentionCard key={m.id} m={m} apiBase={apiBase} onChange={load} toast={toast} />)
      ) : (
        <div className="hint">暂无大V新帖待回复。去「话术与人格 → 📡 追踪」添加大V;后端监控到新帖会在此草拟回复并通知你。</div>
      )}
    </div>
  );
}

function MentionCard({ m, apiBase, onChange, toast }: { m: Mention; apiBase: string; onChange: () => void; toast: (s: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(m.reply || "");

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
        <div className="av" style={{ background: "var(--ink)" }}>
          {initial((m.author || "?").replace(/^[@u/]+/, ""))}
        </div>
        <div>
          <div className="from">{m.author || "大V"}</div>
        </div>
        <span className={"platTag p-" + m.platform} style={{ marginLeft: "auto" }}>
          {PLAT_LABEL[m.platform]}
        </span>
        {m.flagged && <span className="pill-s ps-warn">敏感 · 建议人工</span>}
        {m.postUrl && (
          <a className="pill-s ps-blue" href={m.postUrl} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            🔗 原帖
          </a>
        )}
      </div>
      <div className="msg">{m.postText || "(无正文)"}</div>
      {!editing && m.reply && <div className="reply">💬 {m.reply}</div>}
      {editing && <textarea className="redit" value={val} autoFocus onChange={(e) => setVal(e.target.value)} />}
      <div className="iacts">
        <button className="btn sm" onClick={send}>
          ⚡ 一键发送
        </button>
        <button className="btn ghost sm" onClick={() => setEditing((v) => !v)}>
          {editing ? "完成" : "编辑"}
        </button>
        <button className="btn ghost sm" onClick={ignore}>
          忽略
        </button>
      </div>
    </div>
  );
}
