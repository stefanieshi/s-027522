import { useState } from "react";
import { Icon } from "../lib/icons";
import { useApp } from "../store";
import { Btn, Fingerprint, Pill } from "../components/widgets";

export default function Voice() {
  const { voice, voiceBusy, trainVoice } = useApp();
  const [samples, setSamples] = useState("");

  const cols: [string, string[], string][] = voice
    ? [
        ["Signature moves", voice.signature_moves, "var(--cyan)"],
        ["Vocabulary", voice.vocabulary, "var(--violet)"],
        ["Avoid", voice.avoid, "var(--ember)"],
      ]
    : [];

  return (
    <div className="tabwrap">
      <div className="glass" style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
          <Icon name="mic" size={18} color="var(--cyan)" />
          <span style={{ fontSize: 16, fontWeight: 600 }}>Train your voice</span>
        </div>
        <div style={{ color: "var(--low)", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
          Paste 3–5 of your best posts. Every reply and post is then matched to your voice — and gets a
          "sounds like you" score so one-tap approve feels safe.
        </div>
        <textarea
          className="ta"
          style={{ minHeight: 150, marginBottom: 14 }}
          placeholder="Paste a few posts, one per line…"
          value={samples}
          onChange={(e) => setSamples(e.target.value)}
        />
        <Btn
          label={voice ? "Re-analyze voice" : "Analyze my voice"}
          accent="var(--cyan)"
          busy={voiceBusy}
          icon="sparkles"
          onClick={() => trainVoice(samples)}
        />
        <div className="mono" style={{ color: "var(--low)", fontSize: 11.5, marginTop: 10 }}>
          Tip: paste some posts, or just click analyze to see a sample profile.
        </div>
      </div>

      {voice ? (
        <div className="glass" style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
            <div>
              <div className="mono" style={{ fontSize: 10.5, color: "var(--cyan)", letterSpacing: 1.5, marginBottom: 6 }}>
                VOICE FINGERPRINT
              </div>
              <Fingerprint seed={voice.voice_dna} />
            </div>
            <Pill label={voice.tone} color="var(--mint)" icon="check" />
          </div>
          <div
            style={{
              color: "var(--hi)",
              fontSize: 14.5,
              lineHeight: 1.5,
              fontStyle: "italic",
              paddingLeft: 12,
              borderLeft: "2px solid var(--cyan)",
              marginBottom: 18,
            }}
          >
            “{voice.voice_dna}”
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {cols.map(([title, items, color]) => (
              <div key={title}>
                <div className="mono" style={{ fontSize: 10.5, color, letterSpacing: 0.5, marginBottom: 9, textTransform: "uppercase" }}>
                  {title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(items || []).map((x, i) => (
                    <div key={i} style={{ color: "var(--mid)", fontSize: 12.5, lineHeight: 1.4, display: "flex", gap: 6 }}>
                      <span style={{ color }}>·</span> {x}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
