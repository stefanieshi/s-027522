import { useState } from "react";
import TopBar from "../components/TopBar";
import { useData, useUi } from "../store";
import { PLAT_LABEL } from "../lib/constants";
import { initial } from "../lib/utils";
import { tearSwipe } from "../lib/actions";
import { AccountModal, SwipeModal } from "../components/modals";

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
    </div>
  );

  return (
    <>
      <TopBar view="voice" right={right} />
      <div className="view">
        {voiceTab === "persona" && <PersonaTab />}
        {voiceTab === "tmpl" && <TemplateTab />}
        {voiceTab === "swipe" && <SwipeTab />}
      </div>
    </>
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
              <button className="x" onClick={() => del(a.id)}>
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
  const openModal = useUi((s) => s.openModal);

  function del(id: string) {
    if (confirm("删除?")) setData((d) => void (d.swipes = d.swipes.filter((s) => s.id !== id)));
  }

  return (
    <>
      <div className="row" style={{ marginBottom: 14 }}>
        <button className="btn" onClick={() => openModal(<SwipeModal />)}>
          ＋ 收藏爆款
        </button>
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
