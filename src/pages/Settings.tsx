import { useState } from "react";
import TopBar from "../components/TopBar";
import { useData, useUi } from "../store";
import { MODELS, CHANNELS } from "../lib/constants";
import { apiHealth } from "../lib/api";
import type { AppData, Channel } from "../lib/types";

function localStorageWorks(): boolean {
  try {
    const k = "__vm_test__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export default function Settings() {
  const settings = useData((s) => s.data.settings);
  const setData = useData((s) => s.setData);
  const replace = useData((s) => s.replace);
  const resetSeed = useData((s) => s.resetSeed);
  const { toast, go } = useUi();
  const memOnly = !localStorageWorks();

  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [daily, setDaily] = useState(String(settings.dailyPerAccount));
  const [start, setStart] = useState(String(settings.postStartHour));
  const [end, setEnd] = useState(String(settings.postEndHour));
  const [gap, setGap] = useState(String(settings.minGapMin));
  const [sim, setSim] = useState(settings.simThreshold);
  const [useBackend, setUseBackend] = useState(settings.useBackend);
  const [apiBase, setApiBase] = useState(settings.apiBase);
  const [channel, setChannel] = useState<Channel>(settings.channel);
  const [testing, setTesting] = useState(false);

  function save() {
    setData((d) => {
      const s = d.settings;
      s.apiKey = apiKey;
      s.model = model;
      s.dailyPerAccount = Math.max(1, Math.min(6, parseInt(daily) || 2));
      s.postStartHour = Math.max(0, Math.min(23, parseInt(start) || 9));
      s.postEndHour = Math.max(1, Math.min(24, parseInt(end) || 22));
      s.minGapMin = Math.max(10, parseInt(gap) || 45);
      s.simThreshold = sim;
      s.useBackend = useBackend;
      s.apiBase = apiBase.trim();
      s.channel = channel;
    });
    toast("设置已保存");
  }

  async function testConn() {
    setTesting(true);
    const ok = await apiHealth(apiBase.trim());
    setTesting(false);
    toast(ok ? "后端连上了 ✓ " + apiBase.trim() : "连不上 · 确认后端已 npm run dev");
  }

  function exportData() {
    const b = new Blob([JSON.stringify(useData.getState().data, null, 2)], { type: "application/json" });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u;
    a.download = "vibe-marketer-backup.json";
    a.click();
    URL.revokeObjectURL(u);
  }

  function importData() {
    const i = document.createElement("input");
    i.type = "file";
    i.accept = ".json";
    i.onchange = () => {
      const f = i.files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = () => {
        try {
          replace(JSON.parse(r.result as string) as AppData);
          toast("已导入");
          go("today");
        } catch {
          toast("解析失败");
        }
      };
      r.readAsText(f);
    };
    i.click();
  }

  function reset() {
    if (confirm("清空并重置为示例?")) {
      resetSeed();
      go("today");
      toast("已重置");
    }
  }

  return (
    <>
      <TopBar view="settings" />
      <div className="view">
        <div className="card" style={{ maxWidth: 660 }}>
          <div className="sect" style={{ marginTop: 0 }}>
            Claude 接入
          </div>
          <label className="fld">
            <span className="lab">Anthropic API Key</span>
            <input className="in" type="password" value={apiKey} placeholder="sk-ant-…(留空用 mock)" onChange={(e) => setApiKey(e.target.value)} />
          </label>
          <div className="grid2">
            <label className="fld">
              <span className="lab">模型</span>
              <select className="in" value={model} onChange={(e) => setModel(e.target.value)}>
                {MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="fld">
              <span className="lab">每账号每天生成</span>
              <input className="in" type="number" min={1} max={6} value={daily} onChange={(e) => setDaily(e.target.value)} />
            </label>
          </div>
          <div className="hint" style={{ marginBottom: 6 }}>
            <b>安全</b>:key 只存本地浏览器,只直发 anthropic.com。(生产环境应改走后端代理,见 BUILD-WITH-CLAUDE-CODE.md)
          </div>

          <div className="sect">后端真发布</div>
          <label className="toggle" style={{ marginBottom: 12 }} onClick={() => setUseBackend((v) => !v)}>
            接后端真发布 <span className={"sw" + (useBackend ? " on" : "")} />
          </label>
          <div className="hint" style={{ marginBottom: 12 }}>
            关:发布动作只在本地标记 / 打开原生发送框(mock 友好)。开:走后端 <b>/api/publish</b>、X 帖批准走 <b>/api/schedule</b>。
          </div>
          <div className="grid2">
            <label className="fld">
              <span className="lab">后端地址</span>
              <input className="in" value={apiBase} placeholder="http://localhost:8787" onChange={(e) => setApiBase(e.target.value)} />
            </label>
            <label className="fld">
              <span className="lab">发布渠道</span>
              <select className="in" value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
                {CHANNELS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="hint" style={{ marginBottom: 10 }}>
            {CHANNELS.find((c) => c.value === channel)?.hint} · <b>reply / DM 永远强制 manual</b>(防封红线,后端写死)。
          </div>
          <button className="btn ghost sm" disabled={testing} onClick={testConn}>
            {testing ? <span className="spin" /> : "🔌"} 测试连接
          </button>

          <div className="sect">时间设置 · X 帖错峰防封</div>
          <div className="grid2">
            <label className="fld">
              <span className="lab">发布窗口起(时)</span>
              <input className="in" type="number" min={0} max={23} value={start} onChange={(e) => setStart(e.target.value)} />
            </label>
            <label className="fld">
              <span className="lab">发布窗口止(时)</span>
              <input className="in" type="number" min={1} max={24} value={end} onChange={(e) => setEnd(e.target.value)} />
            </label>
          </div>
          <label className="fld">
            <span className="lab">同账号最小间隔(分钟)</span>
            <input className="in" type="number" min={10} max={240} value={gap} onChange={(e) => setGap(e.target.value)} />
          </label>
          <label className="fld">
            <span className="lab">
              跨账号相似度阈值:<span>{sim}</span>
            </span>
            <input className="in" type="range" min={0.2} max={0.9} step={0.05} value={sim} onChange={(e) => setSim(parseFloat(e.target.value))} />
          </label>
          <button className="btn" onClick={save}>
            保存设置
          </button>

          <div className="sect">数据</div>
          <div className="row">
            <button className="btn ghost sm" onClick={exportData}>
              导出备份
            </button>
            <button className="btn ghost sm" onClick={importData}>
              导入
            </button>
            <button className="btn ghost sm" onClick={reset}>
              清空重置
            </button>
          </div>
          <div className="hint" style={{ marginTop: 10 }}>
            {memOnly ? (
              <>
                <b style={{ color: "var(--brand)" }}>注意</b>:此环境禁用了本地存储,数据仅在内存、刷新会丢。请用「导出备份」保存。
              </>
            ) : (
              "数据保存在本机浏览器,建议偶尔导出备份。"
            )}
          </div>
        </div>
      </div>
    </>
  );
}
