/** Left navigation rail. */
import { Icon } from "../lib/icons";
import { useApp } from "../store";
import type { Tab } from "../lib/types";

const NAV: [Tab, string, string][] = [
  ["briefing", "Briefing", "radar"],
  ["triage", "Triage", "inbox"],
  ["queue", "Queue", "list"],
  ["studio", "Studio", "wand"],
  ["voice", "Voice", "mic"],
];

export default function Rail() {
  const tab = useApp((s) => s.tab);
  const setTab = useApp((s) => s.setTab);
  const queueReady = useApp((s) => s.queue.filter((q) => q.status === "ready").length);

  return (
    <div className="rail">
      <div className="logo">
        <Icon name="radar" size={22} color="#04060d" />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", alignItems: "center" }}>
        {NAV.map(([id, label, icon]) => {
          const on = tab === id;
          return (
            <button key={id} className={"navbtn" + (on ? " on" : "")} onClick={() => setTab(id)}>
              <Icon name={icon} size={19} color={on ? "var(--cyan)" : "var(--low)"} />
              <span>{label}</span>
              {id === "queue" && queueReady > 0 ? <span className="badge">{queueReady}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
