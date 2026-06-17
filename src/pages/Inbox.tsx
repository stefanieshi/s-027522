import { useState } from "react";
import TopBar from "../components/TopBar";
import { useData, useUi } from "../store";
import { PLAT_LABEL, AV } from "../lib/constants";
import { initial, uid } from "../lib/utils";
import { generateReply } from "../lib/llm";
import { sendInboxReply } from "../lib/actions";
import { apiPullInbox } from "../lib/api";
import { InboxAddModal, PullInboxModal } from "../components/modals";
import type { InboxItem } from "../lib/types";

export default function Inbox() {
  const data = useData((s) => s.data);
  const setData = useData((s) => s.setData);
  const { toast, openModal } = useUi();
  const [genningAll, setGenningAll] = useState(false);
  const [pulling, setPulling] = useState(false);

  /** 拉「我用本工具发过的帖」下面的真实评论(按平台分组调 /api/inbox/pull)。 */
  async function pullMine() {
    const cur = useData.getState().data;
    if (!cur.settings.useBackend) return toast("先在「设置」开启接后端");
    const byPlat: Record<string, string[]> = {};
    cur.drafts.forEach((d) => {
      if (d.publishedUrl) (byPlat[d.platform] = byPlat[d.platform] || []).push(d.publishedUrl);
    });
    const plats = Object.keys(byPlat);
    if (!plats.length) return toast("还没用本工具发过帖 · 可用「拉取互动」手动贴帖链接");
    setPulling(true);
    let added = 0;
    let lastErr = "";
    for (const p of plats) {
      const { data: comments, error } = await apiPullInbox(cur.settings.apiBase, p, byPlat[p], 20);
      if (error) { lastErr = error; continue; }
      setData((d) => {
        const seen = new Set(d.inbox.map((m) => m.from + "|" + m.msg));
        comments.forEach((c) => {
          const k = c.from + "|" + c.msg;
          if (c.msg && !seen.has(k)) {
            seen.add(k);
            added++;
            d.inbox.unshift({ id: uid(), from: c.from, platform: c.platform, color: AV[Math.floor(Math.random() * AV.length)], msg: c.msg, reply: "", status: "new", flagged: false });
          }
        });
      });
    }
    setPulling(false);
    toast(added ? `已拉入 ${added} 条真实评论` : lastErr ? "拉取失败:" + lastErr.slice(0, 40) : "暂无新评论");
  }

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
        <div className="banner">
          ℹ️ 这里是<b>真实评论</b>:你<b>用本工具发过的帖</b>下的留言(点「🔄 拉我的帖评论」),或你手动贴帖链接抓取(「拉取互动」)。
          <b>私信(DM)平台禁止抓取</b>,只能你在原 App 看。回复一律"打开原生发送框 + 你按发送",不自动直发(防封)。
        </div>
        <div className="row" style={{ marginBottom: 16 }}>
          <button className="btn" disabled={genningAll} onClick={genAll}>
            {genningAll ? <span className="spin" /> : "✨"} 一键生成所有回复
          </button>
          {data.settings.useBackend && (
            <>
              <button className="btn ghost" disabled={pulling} onClick={pullMine}>
                {pulling ? <span className="spin" /> : "🔄"} 拉我的帖评论
              </button>
              <button className="btn ghost" onClick={() => openModal(<PullInboxModal />)}>
                ⬇️ 贴链接拉评论
              </button>
            </>
          )}
          <button className="btn ghost" onClick={() => openModal(<InboxAddModal />)}>
            + 手动加一条
          </button>
        </div>
        {data.inbox.length ? (
          <>
            {block("需要你确认(敏感)", need)}
            {block("回复已生成", gen)}
            {block("待生成回复", pendingNoReply)}
            {block("已发送", done)}
          </>
        ) : (
          <div className="empty">
            <b>收件箱是空的</b>用上面的「🔄 拉我的帖评论」或「贴链接拉评论」把真实留言拉进来。
          </div>
        )}
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
