/** Reusable visual primitives, ported 1:1 from the mockup helpers. */
import type { CSSProperties } from "react";
import { Icon } from "../lib/icons";
import type { Safety } from "../lib/types";

export function Btn({
  label,
  accent = "var(--cyan)",
  disabled,
  busy,
  icon,
  full,
  onClick,
}: {
  label: string;
  accent?: string;
  disabled?: boolean;
  busy?: boolean;
  icon?: string;
  full?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={"btn" + (full ? " full" : "")}
      style={{ ["--a" as string]: accent, background: `linear-gradient(135deg,${accent},${accent})` } as CSSProperties}
      disabled={disabled || busy}
      onClick={onClick}
    >
      {busy ? (
        <Icon name="refresh" size={15} color="#04060d" className="spin" />
      ) : icon ? (
        <Icon name={icon} size={14} color="#04060d" />
      ) : null}
      {label}
    </button>
  );
}

export function Ghost({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon?: string;
  onClick?: () => void;
}) {
  return (
    <button className="ghost" onClick={onClick}>
      {icon ? <Icon name={icon} size={13} /> : null}
      {label}
    </button>
  );
}

export function Pill({ label, color, icon }: { label: string; color: string; icon?: string }) {
  return (
    <span
      className="pill"
      style={{ color, background: "rgba(255,255,255,.04)", border: `1px solid ${color}` }}
    >
      {icon ? <Icon name={icon} size={11} color={color} /> : null} {label}
    </span>
  );
}

const SAFETY: Record<Safety, [string, string, string, string]> = {
  green: ["var(--mint)", "shieldcheck", "Compliant", "rgba(52,224,161,.1)"],
  amber: ["var(--amber)", "shieldalert", "Review", "rgba(255,182,72,.1)"],
  red: ["var(--ember)", "shieldalert", "Risk", "rgba(255,91,46,.1)"],
};

export function SafetyPill({ level, note }: { level: Safety; note?: string }) {
  const [color, icon, label, bg] = SAFETY[level] || SAFETY.amber;
  return (
    <div
      className="pill"
      title={note || ""}
      style={{ color, background: bg, border: `1px solid ${color}`, cursor: note ? "help" : "default" }}
    >
      <Icon name={icon} size={12} color={color} /> {label}
    </div>
  );
}

export function Meter({ value, label }: { value: number; label: string }) {
  const col = value >= 80 ? "var(--mint)" : value >= 55 ? "var(--cyan)" : "var(--amber)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, maxWidth: 220 }}>
      <span className="mono" style={{ fontSize: 10, color: "var(--low)", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <div
        style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,.07)", minWidth: 50 }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            borderRadius: 4,
            background: col,
            boxShadow: `0 0 6px ${col}`,
          }}
        />
      </div>
      <span className="mono" style={{ fontSize: 11, color: col, fontWeight: 600 }}>
        {value}
      </span>
    </div>
  );
}

export function ScoreRing({ score }: { score: number }) {
  const col = score >= 75 ? "var(--mint)" : score >= 50 ? "var(--cyan)" : "var(--low)";
  const r = 46 / 2 - 4;
  const circ = 2 * Math.PI * r;
  const off = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 46, height: 46, flexShrink: 0 }}>
      <svg width={46} height={46} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={23} cy={23} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={3} />
        <circle
          cx={23}
          cy={23}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={off}
          style={{ filter: `drop-shadow(0 0 4px ${col})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: col }}>
          {score}
        </span>
      </div>
    </div>
  );
}

export function DecayBar({ hours }: { hours: number }) {
  const pct = Math.max(4, Math.min(100, (hours / 48) * 100));
  const urgent = hours <= 8;
  const col = urgent ? "var(--ember)" : hours <= 20 ? "var(--amber)" : "var(--cyan)";
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span className="mono" style={{ fontSize: 10, color: "var(--low)", letterSpacing: 0.5 }}>
          VIRAL WINDOW
        </span>
        <span className="mono" style={{ fontSize: 10.5, color: col, fontWeight: 600 }}>
          ~{hours}h left
        </span>
      </div>
      <div
        style={{ height: 5, borderRadius: 5, background: "rgba(255,255,255,.07)", overflow: "hidden" }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: 5,
            background: col,
            boxShadow: `0 0 8px ${col}`,
            animation: urgent ? "pulse 1.6s infinite" : undefined,
          }}
        />
      </div>
    </div>
  );
}

export function Fingerprint({ seed }: { seed: string }) {
  const src = seed || "resonance";
  let acc = 0;
  const bars: number[] = [];
  for (let i = 0; i < 46; i++) {
    acc = (acc * 31 + src.charCodeAt(i % src.length) + i * 7) % 997;
    bars.push(0.2 + (acc % 80) / 100);
  }
  const w = 240;
  const h = 54;
  const bw = w / bars.length;
  return (
    <svg width={w} height={h}>
      <defs>
        <linearGradient id="vf" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--cyan)" />
          <stop offset="1" stopColor="var(--violet)" />
        </linearGradient>
      </defs>
      {bars.map((b, i) => (
        <rect
          key={i}
          x={i * bw + 1}
          y={h / 2 - (b * h) / 2}
          width={bw - 2}
          height={b * h}
          rx={bw / 2}
          fill="url(#vf)"
          opacity={0.5 + b / 2}
          style={{ animation: `vbar 2.4s ease-in-out ${i * 0.04}s infinite` }}
        />
      ))}
    </svg>
  );
}

export function RadarDial({ count }: { count: number }) {
  const rs = [58, 42, 26];
  const bp: [number, number][] = [
    [30, 35],
    [-44, 18],
    [12, -50],
    [-22, -28],
    [50, -8],
  ];
  return (
    <div style={{ position: "relative", width: 170, height: 170, margin: "0 auto" }}>
      {rs.map((r, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            margin: "auto",
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            border: `1px solid rgba(45,212,255,${i === 0 ? 0.13 : 0.1})`,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 170,
          height: 170,
          borderRadius: "50%",
          background:
            "conic-gradient(from 0deg,transparent 0deg,rgba(45,212,255,0) 250deg,rgba(45,212,255,.33) 340deg,rgba(45,212,255,.67) 360deg)",
          animation: "sweep 3.2s linear infinite",
          WebkitMaskImage: "radial-gradient(circle,transparent 8%,#000 9%)",
          maskImage: "radial-gradient(circle,transparent 8%,#000 9%)",
        }}
      />
      {bp.map(([x, y], i) => {
        const c = i % 2 ? "var(--ember)" : "var(--cyan)";
        return (
          <div
            key={i}
            style={
              {
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: c,
                transform: `translate(${x}px,${y}px)`,
                boxShadow: `0 0 10px ${c}`,
                ["--x" as string]: `${x}px`,
                ["--y" as string]: `${y}px`,
                animation: `blip 2.6s ease-in-out ${i * 0.4}s infinite`,
              } as CSSProperties
            }
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className="mono" style={{ fontSize: 30, fontWeight: 700, color: "var(--hi)" }}>
          {count}
        </span>
        <span
          className="mono"
          style={{ fontSize: 10, color: "var(--cyan)", letterSpacing: 1.5, marginTop: 4 }}
        >
          TO TRIAGE
        </span>
      </div>
    </div>
  );
}

export function Skel({ height = 150 }: { height?: number }) {
  return <div className="glass skel" style={{ padding: 18, height, marginBottom: 14 }} />;
}

/** A small "Copy" button with built-in copied feedback. */
export function CopyBtn({ text }: { text: string }) {
  return (
    <button
      className="copy"
      onClick={async (e) => {
        const el = e.currentTarget;
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* ignore */
        }
        const old = el.innerHTML;
        el.innerHTML = "✓ Copied";
        el.style.color = "var(--mint)";
        setTimeout(() => {
          el.innerHTML = old;
          el.style.color = "";
        }, 1300);
      }}
    >
      <Icon name="copy" size={12} /> Copy
    </button>
  );
}
