import { useState } from "react";
import { Icon } from "../lib/icons";
import { useApp } from "../store";
import { Btn, CopyBtn, SafetyPill, Skel } from "../components/widgets";

export default function Studio() {
  const { platform, niche, voice, studio, studioBusy, studioGen, studioQueue } = useApp();
  const [seed, setSeed] = useState("");
  const reddit = platform === "reddit";

  return (
    <div className="tabwrap">
      <div className="glass" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
          <Icon name="wand" size={18} color="var(--violet)" />
          <span style={{ fontSize: 16, fontWeight: 600 }}>Original content</span>
        </div>
        <div style={{ color: "var(--low)", fontSize: 13, marginBottom: 16 }}>
          {reddit ? "Reddit" : "X"} · {niche} ·{" "}
          {voice ? "in your trained voice" : "generic voice — train Voice for on-brand output"}
        </div>
        <input
          className="ipt"
          style={{ marginBottom: 14 }}
          placeholder="Optional angle — e.g. why retail investors misread earnings"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
        <Btn
          label="Generate 3 posts"
          full
          accent="var(--violet)"
          busy={studioBusy}
          icon="sparkles"
          onClick={() => studioGen(seed)}
        />
      </div>

      {studioBusy ? (
        <Skel />
      ) : studio ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {studio.map((s, i) => (
            <div key={i} className="glass hov" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9, alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <span className="mono" style={{ fontSize: 10.5, color: "var(--violet)", letterSpacing: 1, textTransform: "uppercase" }}>
                  {s.format}
                </span>
                <SafetyPill level={s.safety} note={s.note} />
              </div>
              <div style={{ color: "var(--hi)", fontSize: 13.5, lineHeight: 1.55, marginBottom: 11, whiteSpace: "pre-wrap" }}>
                {s.text}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn label="Queue" accent="var(--mint)" icon="check" onClick={() => studioQueue(i)} />
                <CopyBtn text={s.text} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
