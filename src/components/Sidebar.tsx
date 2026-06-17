import { useData, useUi } from "../store";
import type { ViewId } from "../lib/types";

const NAV: { id: ViewId; icon: string; label: string }[] = [
  { id: "today", icon: "🏠", label: "今日任务" },
  { id: "calendar", icon: "📅", label: "日历排期" },
  { id: "inbox", icon: "✉️", label: "收件箱" },
  { id: "radar", icon: "📡", label: "雷达" },
  { id: "analytics", icon: "📊", label: "账号分析" },
  { id: "voice", icon: "🎭", label: "话术与人格" },
  { id: "settings", icon: "⚙️", label: "设置" },
];

export default function Sidebar() {
  const view = useUi((s) => s.view);
  const go = useUi((s) => s.go);
  const radarCount = useUi((s) => s.radarCount);
  const data = useData((s) => s.data);

  const ibCount = data.inbox.filter((m) => m.status === "new" || (m.reply && m.status !== "sent")).length;
  const hasKey = data.settings.apiKey.trim().length > 0;
  const runStatus = hasKey ? "运行正常 · Claude " + data.settings.model.replace("claude-", "") : "运行正常 · mock 模式";

  return (
    <aside>
      <div className="brand">
        <svg className="mascot" viewBox="0 0 48 48" fill="none">
          <rect x="6" y="10" width="36" height="30" rx="13" fill="#E8553D" />
          <circle cx="18" cy="25" r="4" fill="#fff" />
          <circle cx="30" cy="25" r="4" fill="#fff" />
          <circle cx="18" cy="26" r="2" fill="#2C2A26" />
          <circle cx="30" cy="26" r="2" fill="#2C2A26" />
          <path d="M19 33c2 2 8 2 10 0" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
          <rect x="22" y="3" width="4" height="8" rx="2" fill="#2C2A26" />
          <circle cx="24" cy="3" r="3" fill="#2FA36B" />
        </svg>
        <div>
          <div className="bn">Vibe Marketer</div>
          <div className="bt">你的社媒增长小助手</div>
        </div>
      </div>
      <nav>
        {NAV.map((n) => (
          <button key={n.id} className={view === n.id ? "active" : ""} onClick={() => go(n.id)}>
            <span className="ic">{n.icon}</span>
            {n.label}
            {n.id === "inbox" && ibCount > 0 && <span className="pill">{ibCount}</span>}
            {n.id === "radar" && radarCount > 0 && <span className="pill">{radarCount}</span>}
          </button>
        ))}
      </nav>
      <div className="side-spacer" />
      <div className="cheer">
        <svg className="m2" viewBox="0 0 48 48">
          <rect x="8" y="12" width="32" height="26" rx="12" fill="#FCE7E1" />
          <circle cx="19" cy="25" r="3" fill="#E8553D" />
          <circle cx="29" cy="25" r="3" fill="#E8553D" />
          <path d="M19 31c2 1.6 8 1.6 10 0" stroke="#E8553D" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="t">
          今天也把好内容
          <br />
          带给更多人 ✨
        </div>
      </div>
      <div className="status">
        <span className="dot" />
        <span>{runStatus}</span>
      </div>
    </aside>
  );
}
