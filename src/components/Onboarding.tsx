import { useData, useUi } from "../store";
import { isToday } from "../lib/utils";

/** 3 步上手清单:确认人格 → 一键生成 → 批准并排期。全完成或已忽略则隐藏。 */
export default function Onboarding({ onGenerate, generating }: { onGenerate: () => void; generating: boolean }) {
  const data = useData((s) => s.data);
  const setData = useData((s) => s.setData);
  const go = useUi((s) => s.go);

  const s1 = data.accounts.length > 0;
  const s2 = data.drafts.some((d) => isToday(d.created));
  const s3 = data.drafts.some((d) => d.status === "approved" || d.status === "published");
  const dismissed = !!data.settings.onboardingDismissed;
  if (dismissed || (s1 && s2 && s3)) return null;

  const done = [s1, s2, s3].filter(Boolean).length;

  const row = (ok: boolean, n: number, title: string, cta?: { label: string; onClick: () => void; primary?: boolean }) => (
    <div className="row" style={{ alignItems: "center", gap: 10, padding: "8px 0" }}>
      <span
        style={{
          width: 22, height: 22, borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 700,
          background: ok ? "var(--ready)" : "var(--surface-2)", color: ok ? "#fff" : "var(--ink-3)", border: ok ? "none" : "1.5px solid var(--line)",
        }}
      >
        {ok ? "✓" : n}
      </span>
      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: ok ? "var(--ink-3)" : "var(--ink)", textDecoration: ok ? "line-through" : "none" }}>{title}</span>
      {!ok && cta && (
        <button className={"btn sm " + (cta.primary ? "" : "soft")} disabled={generating && cta.label.includes("生成")} onClick={cta.onClick}>
          {generating && cta.label.includes("生成") ? <span className="spin" /> : cta.label}
        </button>
      )}
    </div>
  );

  return (
    <div className="card" style={{ marginBottom: 16, borderColor: "#CFD8FB", background: "linear-gradient(160deg,var(--blue-soft),#fff)" }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <b className="display" style={{ fontSize: 15 }}>
          🚀 3 步上手 · {done}/3
        </b>
        <button className="btn ghost sm" onClick={() => setData((d) => void (d.settings.onboardingDismissed = true))}>
          跳过
        </button>
      </div>
      {row(s1, 1, "为每个账号设好独立人格", { label: "去设人格", onClick: () => go("voice") })}
      {row(s2, 2, "一键生成今天的候选内容", { label: "✨ 一键生成", onClick: onGenerate, primary: !s2 && s1 })}
      {row(s3, 3, "审一眼 → 批准 → 自动错峰排期", { label: "下方批准", onClick: () => {} })}
    </div>
  );
}
