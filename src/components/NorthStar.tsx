import { useData } from "../store";
import { weeklyStats, streak, flywheel, fmtNum } from "../lib/stats";

/** 顶部增长北极星:本周触达/互动 + 连续日更 streak + 飞轮闭环。 */
export default function NorthStar() {
  const data = useData((s) => s.data);
  const w = weeklyStats(data.drafts);
  const days = streak(data.drafts);
  const fw = flywheel(data.swipes, data.drafts);

  const stat = (n: string, l: string, color?: string, est?: boolean) => (
    <div className="card" style={{ flex: 1, minWidth: 120, textAlign: "center", padding: "14px 10px" }}>
      <div className="display" style={{ fontSize: 24, color: color || "var(--ink)", lineHeight: 1 }}>
        {n}
      </div>
      <div className="hint" style={{ marginTop: 5 }}>
        {l}
        {est && <span style={{ opacity: 0.7 }}> · 估算</span>}
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: 16 }}>
      <div className="row" style={{ gap: 12 }}>
        <div className="card" style={{ flex: 1, minWidth: 130, textAlign: "center", padding: "14px 10px", background: "linear-gradient(160deg,var(--brand-soft),#FFF6F1)", borderColor: "#F3D8CF" }}>
          <div className="display" style={{ fontSize: 24, color: "var(--brand-deep)", lineHeight: 1 }}>
            🔥 {days}
          </div>
          <div className="hint" style={{ marginTop: 5, color: "var(--brand-deep)" }}>
            连续日更(天)
          </div>
        </div>
        {stat(fmtNum(w.reach), "本周触达", "var(--blue)", w.reachEstimated)}
        {stat(fmtNum(w.likes), "本周互动", "var(--brand)")}
        {stat(w.engagementRate == null ? "—" : (w.engagementRate * 100).toFixed(1) + "%", "互动率", "var(--ready)")}
        {stat(String(w.published), "本周已发")}
      </div>

      {/* 飞轮闭环 */}
      <div className="row" style={{ gap: 6, marginTop: 10, alignItems: "center", fontSize: 12, color: "var(--ink-2)", flexWrap: "wrap" }}>
        <span className="hint">飞轮:</span>
        <FlyStep label="灵感" n={fw.ideas} />
        <span className="hint">→</span>
        <FlyStep label="起草" n={fw.drafted} />
        <span className="hint">→</span>
        <FlyStep label="已发" n={fw.published} />
        <span className="hint">→</span>
        <FlyStep label="复盘" n={fw.tagged} />
        {fw.wins > 0 && <span className="pill-s ps-ready" style={{ marginLeft: 4 }}>🔥 {fw.wins} 个赢家 · 可复用到别的号</span>}
      </div>
    </div>
  );
}

function FlyStep({ label, n }: { label: string; n: number }) {
  return (
    <span className="pill-s ps-mut">
      {label} <b style={{ color: "var(--ink)" }}>{n}</b>
    </span>
  );
}
