import { useState } from "react";
import { useData, useUi } from "../store";
import { AV, PLATFORMS, PLAT_LABEL } from "../lib/constants";
import { uid } from "../lib/utils";
import { tearSwipe } from "../lib/actions";
import type { Account, Platform } from "../lib/types";

export function AccountModal({ id }: { id?: string }) {
  const setData = useData((s) => s.setData);
  const existing = useData((s) => (id ? s.data.accounts.find((a) => a.id === id) : undefined));
  const accountsLen = useData((s) => s.data.accounts.length);
  const { closeModal, toast } = useUi();

  const e: Account = existing || ({ handle: "", platform: "x", persona: { voice: "", stance: "", taboo: "", format: "" } } as Account);
  const [handle, setHandle] = useState(e.handle);
  const [platform, setPlatform] = useState<Platform>(e.platform);
  const [voice, setVoice] = useState(e.persona.voice);
  const [stance, setStance] = useState(e.persona.stance);
  const [taboo, setTaboo] = useState(e.persona.taboo);
  const [format, setFormat] = useState(e.persona.format);
  const [externalId, setExternalId] = useState(e.externalId || "");

  function save() {
    if (!handle.trim()) {
      toast("handle 不能为空");
      return;
    }
    setData((d) => {
      const persona = { voice, stance, taboo, format };
      const ext = externalId.trim() || undefined;
      if (id) {
        const t = d.accounts.find((a) => a.id === id);
        if (t) {
          t.handle = handle.trim();
          t.platform = platform;
          t.persona = persona;
          t.externalId = ext;
        }
      } else {
        d.accounts.push({ id: uid(), handle: handle.trim(), platform, color: AV[accountsLen % AV.length], persona, externalId: ext });
      }
    });
    closeModal();
    toast("已保存");
  }

  return (
    <>
      <h3>{id ? "编辑账号" : "新增账号"}</h3>
      <div className="grid2">
        <label className="fld">
          <span className="lab">handle</span>
          <input className="in" value={handle} placeholder="@yourhandle" onChange={(ev) => setHandle(ev.target.value)} />
        </label>
        <label className="fld">
          <span className="lab">平台</span>
          <select className="in" value={platform} onChange={(ev) => setPlatform(ev.target.value as Platform)}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLAT_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="fld">
        <span className="lab">语气</span>
        <input className="in" value={voice} onChange={(ev) => setVoice(ev.target.value)} />
      </label>
      <label className="fld">
        <span className="lab">立场</span>
        <input className="in" value={stance} onChange={(ev) => setStance(ev.target.value)} />
      </label>
      <label className="fld">
        <span className="lab">禁用</span>
        <input className="in" value={taboo} onChange={(ev) => setTaboo(ev.target.value)} />
      </label>
      <label className="fld">
        <span className="lab">格式</span>
        <input className="in" value={format} onChange={(ev) => setFormat(ev.target.value)} />
      </label>
      <label className="fld">
        <span className="lab">外部账号 ID(选填 · zernio account_id / morelogin profile)</span>
        <input className="in" value={externalId} placeholder="真发布时用;留空则仅 manual" onChange={(ev) => setExternalId(ev.target.value)} />
      </label>
      <div className="mfoot">
        <button className="btn ghost" onClick={closeModal}>
          取消
        </button>
        <button className="btn" onClick={save}>
          保存
        </button>
      </div>
    </>
  );
}

export function SwipeModal() {
  const setData = useData((s) => s.setData);
  const { closeModal, toast, setVoiceTab } = useUi();
  const [platform, setPlatform] = useState<Platform>("x");
  const [source, setSource] = useState("");
  const [raw, setRaw] = useState("");

  function save() {
    if (!raw.trim()) {
      toast("内容不能为空");
      return;
    }
    const newId = uid();
    setData((d) => {
      d.swipes.unshift({ id: newId, platform, source: source.trim() || "unknown", metrics: "", raw: raw.trim(), teardown: null, pattern: null });
    });
    closeModal();
    setVoiceTab("swipe");
    tearSwipe(newId);
  }

  return (
    <>
      <h3>收藏爆款</h3>
      <div className="grid2">
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
          <span className="lab">来源</span>
          <input className="in" value={source} placeholder="@竞品 / self" onChange={(e) => setSource(e.target.value)} />
        </label>
      </div>
      <label className="fld">
        <span className="lab">内容</span>
        <textarea className="in" style={{ minHeight: 100 }} value={raw} placeholder="把爆款文案/字幕粘进来…" onChange={(e) => setRaw(e.target.value)} />
      </label>
      <div className="mfoot">
        <button className="btn ghost" onClick={closeModal}>
          取消
        </button>
        <button className="btn" onClick={save}>
          保存并拆解
        </button>
      </div>
    </>
  );
}

export function InboxAddModal() {
  const setData = useData((s) => s.setData);
  const { closeModal, toast } = useUi();
  const [from, setFrom] = useState("");
  const [platform, setPlatform] = useState<Platform>("x");
  const [msg, setMsg] = useState("");

  function save() {
    if (!msg.trim()) {
      toast("内容不能为空");
      return;
    }
    setData((d) => {
      d.inbox.unshift({
        id: uid(),
        from: from.trim() || "@user",
        platform,
        color: AV[Math.floor(Math.random() * AV.length)],
        msg: msg.trim(),
        reply: "",
        status: "new",
        flagged: false,
      });
    });
    closeModal();
  }

  return (
    <>
      <h3>加一条互动消息</h3>
      <div className="grid2">
        <label className="fld">
          <span className="lab">来自</span>
          <input className="in" value={from} placeholder="@someone" onChange={(e) => setFrom(e.target.value)} />
        </label>
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
      </div>
      <label className="fld">
        <span className="lab">消息内容</span>
        <textarea className="in" style={{ minHeight: 80 }} value={msg} onChange={(e) => setMsg(e.target.value)} />
      </label>
      <div className="mfoot">
        <button className="btn ghost" onClick={closeModal}>
          取消
        </button>
        <button className="btn" onClick={save}>
          加入
        </button>
      </div>
    </>
  );
}
