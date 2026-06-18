import { Icon } from "../lib/icons";
import { useApp } from "../store";
import { Btn, RadarDial } from "../components/widgets";
import type { Tab } from "../lib/types";

export default function Briefing() {
  const { platform, niche, ops, voice, queue, setTab } = useApp();
  const accent = platform === "reddit" ? "var(--ember)" : "var(--cyan)";
  const queueReady = queue.filter((q) => q.status === "ready").length;

  const stats: [string, string | number, string, string][] = [
    ["flame", ops.length, "to triage", "var(--cyan)"],
    ["list", queueReady || "—", "queued", "var(--mint)"],
    ["mic", voice ? "ON" : "OFF", "voice", voice ? "var(--mint)" : "var(--low)"],
  ];

  const loop: [string, string, string, Tab][] = [
    ["Train voice", "Paste your best posts so drafts sound like you", "mic", "voice"],
    ["Triage", "Approve value-first replies to the hottest threads", "inbox", "triage"],
    ["Queue & post", "Review compliance, then ship on your schedule", "list", "queue"],
  ];

  return (
    <div className="tabwrap" style={{ display: "grid", gridTemplateColumns: "1.05fr 1.45fr", gap: 18 }}>
      <div className="glass hov" style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <RadarDial count={ops.length} />
        <div style={{ textAlign: "center", marginTop: 16, color: "var(--mid)", fontSize: 12.5, lineHeight: 1.5 }}>
          Reply opportunities surfaced in
          <br />
          <b style={{ color: "var(--hi)" }}>{niche}</b>
        </div>
        <div style={{ marginTop: 16 }}>
          <Btn label="Start triage" full accent={accent} icon="inbox" onClick={() => setTab("triage")} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="glass" style={{ padding: 20 }}>
          <div className="mono" style={{ fontSize: 11, color: "var(--low)", letterSpacing: 1, marginBottom: 4 }}>
            NORTH STAR
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span className="mono" style={{ fontSize: 34, fontWeight: 700, color: "var(--mint)" }}>
              +41%
            </span>
            <span style={{ color: "var(--mid)", fontSize: 13 }}>est. relevant reach / active hour</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 18 }}>
            {stats.map(([icon, val, label, color], i) => (
              <div key={i}>
                <Icon name={icon} size={15} color={color} />
                <div className="mono" style={{ fontSize: 22, fontWeight: 700, marginTop: 8 }}>
                  {val}
                </div>
                <div style={{ color: "var(--low)", fontSize: 11 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 13, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="sparkles" size={15} color="var(--cyan)" /> Today's loop
          </div>
          {loop.map(([title, desc, icon, target], i) => {
            const hot = !voice && target === "voice";
            return (
              <div
                key={target}
                onClick={() => setTab(target)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 0",
                  borderTop: i ? "1px solid var(--border)" : undefined,
                  cursor: "pointer",
                }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={icon} size={15} color={hot ? "var(--amber)" : "var(--cyan)"} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {title}
                    {hot ? (
                      <span className="mono" style={{ color: "var(--amber)", fontSize: 10, marginLeft: 8 }}>
                        START HERE
                      </span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--low)" }}>{desc}</div>
                </div>
                <Icon name="chevron" size={16} color="var(--low)" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
