import { useEffect, useState } from "react";
import { Icon } from "../lib/icons";
import { useApp } from "../store";
import { Btn, CopyBtn, Ghost, Meter, Pill, SafetyPill } from "../components/widgets";

export default function Queue() {
  const { queue, editId, setTab, markPosted, removeQueued, startEdit, commitEdit } = useApp();
  const [draftText, setDraftText] = useState("");

  // Seed the editor with the item's current text when an edit begins.
  useEffect(() => {
    if (editId) {
      const q = queue.find((x) => x.id === editId);
      setDraftText(q ? q.text : "");
    }
  }, [editId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!queue.length) {
    return (
      <div className="tabwrap">
        <div className="glass" style={{ padding: 50, textAlign: "center" }}>
          <Icon name="list" size={30} color="var(--mint)" />
          <div style={{ marginTop: 14, fontSize: 15, fontWeight: 600 }}>Nothing queued yet</div>
          <div style={{ color: "var(--low)", fontSize: 13, marginTop: 6 }}>
            Approve replies in Triage and they'll land here for a final compliance check before posting.
          </div>
          <div style={{ marginTop: 18 }}>
            <Btn label="Go to triage" accent="var(--cyan)" icon="inbox" onClick={() => setTab("triage")} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tabwrap">
      <div className="glass" style={{ padding: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 10, color: "var(--mid)", fontSize: 12.5 }}>
        <Icon name="shield" size={15} color="var(--mint)" /> Copilot mode — nothing posts automatically.
        Review, then ship. Amber items flag possible investment-advice language.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {queue.map((q) => {
          const col = q.platform === "reddit" ? "var(--ember)" : "var(--cyan)";
          const editing = editId === q.id;
          const posted = q.status === "posted";
          return (
            <div key={q.id} className="glass hov" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 9, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Pill label={q.platform === "reddit" ? "REDDIT" : "X"} color={col} />
                  <SafetyPill level={q.safety} note={q.note} />
                  {posted ? <Pill label="POSTED" color="var(--mint)" icon="check" /> : null}
                </div>
                <span className="mono" style={{ fontSize: 11, color: "var(--low)" }}>
                  ↪ {q.target}…
                </span>
              </div>

              {editing ? (
                <textarea
                  className="ta"
                  style={{ minHeight: 70, marginBottom: 10 }}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                />
              ) : (
                <div style={{ color: "var(--hi)", fontSize: 13.5, lineHeight: 1.55, marginBottom: 10, whiteSpace: "pre-wrap", opacity: posted ? 0.55 : 1 }}>
                  {q.text}
                </div>
              )}

              {typeof q.sounds === "number" && !posted ? (
                <div style={{ marginBottom: 11 }}>
                  <Meter value={q.sounds} label="sounds like you" />
                </div>
              ) : null}

              {!posted ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Btn label="Mark as posted" accent="var(--mint)" icon="send" onClick={() => markPosted(q.id)} />
                  <Ghost
                    label={editing ? "Done" : "Edit"}
                    icon="pencil"
                    onClick={() => (editing ? commitEdit(q.id, draftText) : startEdit(q.id))}
                  />
                  <CopyBtn text={q.text} />
                  <Ghost label="Remove" icon="trash" onClick={() => removeQueued(q.id)} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
