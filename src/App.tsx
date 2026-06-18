import { useState } from "react";
import Rail from "./components/Rail";
import { Icon } from "./lib/icons";
import { useApp } from "./store";
import Briefing from "./views/Briefing";
import Triage from "./views/Triage";
import Queue from "./views/Queue";
import Studio from "./views/Studio";
import Voice from "./views/Voice";
import type { Platform, Tab } from "./lib/types";

const TITLES: Record<Tab, string> = {
  briefing: "Daily briefing",
  triage: "Triage",
  queue: "Approval queue",
  studio: "Content studio",
  voice: "Voice training",
};

const PLATFORMS: [Platform, string, string][] = [
  ["x", "𝕏", "var(--cyan)"],
  ["reddit", "Reddit", "var(--ember)"],
];

function ApiKeyPopover() {
  const { apiKey, setApiKey } = useApp();
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(apiKey);
  const set = !!apiKey;
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => {
          setVal(apiKey);
          setOpen((o) => !o);
        }}
        className="mono"
        style={{
          cursor: "pointer",
          background: "transparent",
          color: set ? "var(--mint)" : "var(--amber)",
          border: `1px solid ${set ? "var(--mint)" : "var(--amber)"}`,
          borderRadius: 999,
          padding: "2px 8px",
          letterSpacing: 1,
          fontSize: 10,
        }}
      >
        {set ? "API KEY SET" : "DEMO DATA"}
      </button>
      {open ? (
        <div
          className="glass"
          style={{ position: "absolute", top: 26, left: 0, zIndex: 20, padding: 14, width: 320 }}
        >
          <div style={{ fontSize: 12.5, color: "var(--mid)", marginBottom: 10, lineHeight: 1.5 }}>
            Paste an Anthropic API key to generate live. Empty = offline demo data. Stored only in this
            browser.
          </div>
          <input
            className="ipt"
            type="password"
            placeholder="sk-ant-…"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn"
              style={{ background: "linear-gradient(135deg,var(--mint),var(--mint))", color: "#04060d" }}
              onClick={() => {
                setApiKey(val.trim());
                setOpen(false);
              }}
            >
              Save
            </button>
            <button className="ghost" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NicheBar() {
  const { niche, setNiche, voice, setTab } = useApp();
  const [val, setVal] = useState(niche);
  return (
    <div
      className="glass"
      style={{ padding: 14, marginBottom: 22, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}
    >
      <Icon name="target" size={17} color="var(--violet)" />
      <span className="mono" style={{ fontSize: 11, color: "var(--low)", letterSpacing: 1 }}>
        NICHE
      </span>
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => setNiche(val)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setNiche(val);
        }}
        style={{ flex: 1, minWidth: 160, background: "transparent", border: "none", outline: "none", color: "var(--hi)", fontSize: 14 }}
      />
      <div
        onClick={() => setTab("voice")}
        style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", paddingLeft: 14, borderLeft: "1px solid var(--border)" }}
      >
        <Icon name="mic" size={14} color={voice ? "var(--mint)" : "var(--low)"} />
        <span className="mono" style={{ fontSize: 11, color: voice ? "var(--mint)" : "var(--low)" }}>
          {voice ? "VOICE TRAINED" : "VOICE NOT SET"}
        </span>
      </div>
    </div>
  );
}

const VIEWS: Record<Tab, () => JSX.Element> = {
  briefing: Briefing,
  triage: Triage,
  queue: Queue,
  studio: Studio,
  voice: Voice,
};

export default function App() {
  const tab = useApp((s) => s.tab);
  const platform = useApp((s) => s.platform);
  const setPlatform = useApp((s) => s.setPlatform);
  const View = VIEWS[tab];

  return (
    <>
      <div className="aurora">
        <div className="orb" style={{ top: "-15%", left: "-10%", width: 620, height: 620, background: "radial-gradient(circle,rgba(139,92,246,.2),transparent 65%)", animation: "drift 22s ease-in-out infinite" }} />
        <div className="orb" style={{ bottom: "-20%", right: "-8%", width: 560, height: 560, background: "radial-gradient(circle,rgba(45,212,255,.15),transparent 65%)", animation: "drift 26s ease-in-out infinite reverse" }} />
        <div className="orb" style={{ top: "30%", right: "30%", width: 420, height: 420, background: "radial-gradient(circle,rgba(52,224,161,.09),transparent 65%)", animation: "drift 30s ease-in-out infinite" }} />
        <div className="grid" />
      </div>

      <div className="shell">
        <Rail />
        <div className="main">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 22 }}>
            <div>
              <div className="mono" style={{ fontSize: 11, color: "var(--cyan)", letterSpacing: 3, marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
                RESONANCE ◈ REPLY COPILOT
                <ApiKeyPopover />
              </div>
              <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: "-.5px" }}>{TITLES[tab]}</div>
            </div>
            <div style={{ display: "flex", gap: 4, padding: 4, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: 13, backdropFilter: "blur(20px)" }}>
              {PLATFORMS.map(([id, label, color]) => {
                const on = platform === id;
                return (
                  <button
                    key={id}
                    onClick={() => setPlatform(id)}
                    className="mono"
                    style={{
                      padding: "8px 15px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      color: on ? "#04060d" : "var(--mid)",
                      background: on ? `linear-gradient(135deg,${color},${color})` : "transparent",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <NicheBar />
          <View />

          <div className="mono" style={{ marginTop: 34, paddingTop: 18, borderTop: "1px solid var(--border)", color: "var(--low)", fontSize: 11.5, lineHeight: 1.6 }}>
            ◈ Copilot, not autopilot — AI drafts, you approve, nothing posts on its own. Runs fully offline
            on built-in samples; add an API key to generate in real time. Feeds &amp; metrics are
            AI-simulated composites. Brand-safety flags possible investment-advice language but isn't
            legal/financial compliance review. Live X / Reddit listening + posting needs their official
            APIs + a backend.
          </div>
        </div>
      </div>
    </>
  );
}
