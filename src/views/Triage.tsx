import { useEffect } from "react";
import { Icon } from "../lib/icons";
import { useApp } from "../store";
import { fmt } from "../lib/utils";
import { Btn, CopyBtn, DecayBar, Ghost, Meter, Pill, SafetyPill, ScoreRing } from "../components/widgets";

export default function Triage() {
  const {
    platform,
    ops,
    sel,
    scanning,
    drafts,
    draftBusy,
    setSel,
    scan,
    genDrafts,
    approve,
    dismiss,
    snooze,
  } = useApp();
  const accent = platform === "reddit" ? "var(--ember)" : "var(--cyan)";
  const reddit = platform === "reddit";

  // Keyboard shortcuts: J/K move, D dismiss, S snooze, Enter draft.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!ops.length) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "j" || e.key === "ArrowDown") {
        setSel(Math.min(ops.length - 1, sel + 1));
        e.preventDefault();
      } else if (e.key === "k" || e.key === "ArrowUp") {
        setSel(Math.max(0, sel - 1));
        e.preventDefault();
      } else if (e.key === "d") {
        dismiss(sel);
      } else if (e.key === "s") {
        snooze(sel);
      } else if (e.key === "Enter") {
        const op = ops[sel];
        if (op && !drafts[op._id]) genDrafts(op._id);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [ops, sel, drafts, setSel, dismiss, snooze, genDrafts]);

  // Keep the selected card in view.
  useEffect(() => {
    document.querySelector(`[data-card="${sel}"]`)?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const head = (
    <div className="glass" style={{ padding: 16, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
      <div style={{ color: "var(--mid)", fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="eye" size={15} color={accent} /> Scored opportunities on{" "}
        <b style={{ color: "var(--hi)" }}>{reddit ? "Reddit" : "X"}</b>, ranked by fit
      </div>
      <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
        <span className="mono" style={{ fontSize: 10.5, color: "var(--low)", display: "flex", gap: 8, alignItems: "center" }}>
          <span className="kbd">J/K</span>move <span className="kbd">D</span>dismiss <span className="kbd">S</span>snooze
        </span>
        <Btn label={ops.length ? "Re-scan" : "Scan"} accent={accent} busy={scanning} icon="refresh" onClick={scan} />
      </div>
    </div>
  );

  if (scanning) {
    return (
      <div className="tabwrap">
        {head}
        {[0, 1, 2].map((z) => (
          <div key={z} className="glass skel" style={{ padding: 18, height: 150, marginBottom: 14 }} />
        ))}
      </div>
    );
  }

  if (!ops.length) {
    return (
      <div className="tabwrap">
        {head}
        <div className="glass" style={{ padding: 50, textAlign: "center" }}>
          <Icon name="inbox" size={30} color={accent} />
          <div style={{ marginTop: 14, fontSize: 15, fontWeight: 600 }}>Inbox zero</div>
          <div style={{ color: "var(--low)", fontSize: 13, marginTop: 6 }}>
            Scan to surface threads where a smart reply is worth your time.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tabwrap">
      {head}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {ops.map((op, i) => {
          const dlist = drafts[op._id];
          return (
            <div key={op._id} data-card={i} onClick={() => setSel(i)}>
              <div className={"glass hov" + (i === sel ? " sel" : "")} style={{ padding: 18 }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <ScoreRing score={op.fit || 0} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ color: "var(--hi)", fontSize: 13.5, fontWeight: 600 }}>
                        {reddit ? op.subreddit : op.author}{" "}
                        <span className="mono" style={{ color: "var(--low)", fontSize: 11, fontWeight: 400 }}>
                          {reddit ? `· u/${op.author}` : op.handle}
                        </span>
                      </span>
                      <Pill label={reddit ? "REDDIT" : "X"} color={accent} />
                    </div>

                    {reddit && op.title ? (
                      <div style={{ color: "var(--hi)", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{op.title}</div>
                    ) : null}

                    <div style={{ color: "var(--mid)", fontSize: 13, lineHeight: 1.5, marginBottom: 11 }}>{op.text}</div>

                    <div className="mono" style={{ display: "flex", gap: 14, fontSize: 11.5, color: "var(--low)", marginBottom: 12, flexWrap: "wrap" }}>
                      {reddit ? (
                        <>
                          <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                            <Icon name="arrowup" size={12} color="var(--ember)" />
                            {fmt(op.upvotes || 0)}
                          </span>
                          <span>💬 {fmt(op.comments || 0)}</span>
                        </>
                      ) : (
                        <>
                          <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                            <Icon name="heart" size={12} color="var(--magenta)" />
                            {fmt(op.likes || 0)}
                          </span>
                          <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
                            <Icon name="repeat" size={12} color="var(--cyan)" />
                            {fmt(op.reposts || 0)}
                          </span>
                          <span>💬 {fmt(op.replies || 0)}</span>
                        </>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                      <DecayBar hours={op.decay_hours || 24} />
                      <span style={{ color: "var(--mid)", fontSize: 11.5, display: "flex", gap: 6, alignItems: "center", flex: 1, minWidth: 180 }}>
                        <Icon name="zap" size={12} color="var(--amber)" /> {op.why_now}
                      </span>
                    </div>

                    {!dlist ? (
                      <div style={{ display: "flex", gap: 9 }}>
                        <Btn label="Draft replies" accent={accent} busy={draftBusy === op._id} icon="send" onClick={() => genDrafts(op._id)} />
                        <Ghost label="Dismiss" icon="x" onClick={() => dismiss(i)} />
                        <Ghost label="Snooze" icon="clock" onClick={() => snooze(i)} />
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 4 }}>
                        {dlist.map((d, k) => (
                          <div key={k} style={{ background: "rgba(255,255,255,.03)", border: "1px solid var(--border)", borderRadius: 12, padding: 13 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7, gap: 8, flexWrap: "wrap" }}>
                              <span className="mono" style={{ fontSize: 10.5, color: accent, letterSpacing: 0.5, textTransform: "uppercase" }}>
                                {d.angle}
                              </span>
                              <SafetyPill level={d.safety} note={d.note} />
                            </div>
                            <div style={{ color: "var(--hi)", fontSize: 13.5, lineHeight: 1.55, marginBottom: 10, whiteSpace: "pre-wrap" }}>{d.reply}</div>
                            {typeof d.sounds === "number" ? (
                              <div style={{ marginBottom: 10 }}>
                                <Meter value={d.sounds} label="sounds like you" />
                              </div>
                            ) : null}
                            <div style={{ display: "flex", gap: 8 }}>
                              <Btn label="Approve → Queue" accent="var(--mint)" icon="check" onClick={() => approve(op._id, k)} />
                              <CopyBtn text={d.reply} />
                            </div>
                          </div>
                        ))}
                        <div>
                          <Ghost label="Skip this thread" icon="x" onClick={() => dismiss(i)} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
