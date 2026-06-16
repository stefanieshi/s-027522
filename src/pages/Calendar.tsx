import TopBar from "../components/TopBar";
import { useData, useUi } from "../store";
import { PLAT_LABEL } from "../lib/constants";
import type { Draft } from "../lib/types";

interface CalEv {
  kind: "pub" | "sch";
  dr: Draft;
  ts: number;
}

export default function Calendar() {
  const data = useData((s) => s.data);
  const calMonth = useUi((s) => s.calMonth);
  const setCalMonth = useUi((s) => s.setCalMonth);
  const openModal = useUi((s) => s.openModal);
  const closeModal = useUi((s) => s.closeModal);

  const acctOf = (id: string) => data.accounts.find((a) => a.id === id);

  const map: Record<string, CalEv[]> = {};
  const add = (ts: number, kind: "pub" | "sch", dr: Draft) => {
    const k = new Date(ts);
    const key = k.getFullYear() + "_" + k.getMonth() + "_" + k.getDate();
    (map[key] = map[key] || []).push({ kind, dr, ts });
  };
  data.drafts.forEach((d) => {
    if (d.status === "published" && d.publishedAt) add(d.publishedAt, "pub", d);
    else if (d.status === "approved" && d.scheduledAt) add(d.scheduledAt, "sch", d);
  });

  const now = new Date();
  const cm = calMonth || { y: now.getFullYear(), m: now.getMonth() };
  const { y, m } = cm;
  const first = new Date(y, m, 1);
  const lead = (first.getDay() + 6) % 7;
  const dim = new Date(y, m + 1, 0).getDate();

  let mp = 0,
    ms = 0;
  Object.keys(map).forEach((k) => {
    const [ky, km] = k.split("_").map(Number);
    if (ky === y && km === m) map[k].forEach((e) => (e.kind === "pub" ? mp++ : ms++));
  });

  const dow = ["一", "二", "三", "四", "五", "六", "日"];

  function openDay(day: number) {
    const evs = (map[y + "_" + m + "_" + day] || []).slice().sort((a, b) => a.ts - b.ts);
    const label = new Date(y, m, day).toLocaleDateString("zh-CN", { month: "long", day: "numeric", weekday: "long" });
    openModal(
      <>
        <h3>{label}</h3>
        {evs.length ? (
          evs.map((e, i) => {
            const a = acctOf(e.dr.account_id) || ({ handle: "?" } as any);
            return (
              <div className="swrow" style={{ alignItems: "center" }} key={i}>
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 7, marginBottom: 4, alignItems: "center" }}>
                    <span className={"platTag p-" + e.dr.platform}>{PLAT_LABEL[e.dr.platform]}</span>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{a.handle}</span>
                    <span className={"schip " + (e.kind === "pub" ? "ps-ready" : "ps-warn")}>
                      {e.kind === "pub" ? "已发布" : "排期 " + new Date(e.ts).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div style={{ fontSize: 13 }}>{e.dr.hook || e.dr.topic}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="hint">这天没有内容。</div>
        )}
        <div className="mfoot">
          <button className="btn ghost" onClick={closeModal}>
            关闭
          </button>
        </div>
      </>
    );
  }

  const cells: JSX.Element[] = [];
  for (let i = 0; i < lead; i++) cells.push(<div className="cal-cell out" key={"o" + i} />);
  for (let day = 1; day <= dim; day++) {
    const evs = (map[y + "_" + m + "_" + day] || []).slice().sort((a, b) => a.ts - b.ts);
    const isT = now.getFullYear() === y && now.getMonth() === m && now.getDate() === day;
    cells.push(
      <div className={"cal-cell" + (isT ? " today" : "")} key={day} onClick={() => openDay(day)}>
        <span className="cal-num">{day}</span>
        {evs.slice(0, 3).map((e, i) => (
          <div className={"cal-ev " + e.kind} key={i}>
            {e.kind === "pub" ? "✓" : "⏳"} {(e.dr.hook || e.dr.topic || PLAT_LABEL[e.dr.platform]).slice(0, 11)}
          </div>
        ))}
        {evs.length > 3 && <div className="cal-more">+{evs.length - 3} 更多</div>}
      </div>
    );
  }

  const prev = () => setCalMonth(m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 });
  const next = () => setCalMonth(m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 });
  const today = () => setCalMonth({ y: now.getFullYear(), m: now.getMonth() });

  return (
    <>
      <TopBar view="calendar" />
      <div className="view">
        <div className="row" style={{ gap: 14, marginBottom: 14 }}>
          <div className="card" style={{ flex: 1, padding: "14px 18px" }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <span className="hint">本月已发布</span>
              <b className="display" style={{ fontSize: 22, color: "var(--ready)" }}>
                {mp}
              </b>
            </div>
          </div>
          <div className="card" style={{ flex: 1, padding: "14px 18px" }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <span className="hint">本月已排期</span>
              <b className="display" style={{ fontSize: 22, color: "var(--warn)" }}>
                {ms}
              </b>
            </div>
          </div>
          <div className="card" style={{ flex: 1, padding: "14px 18px" }}>
            <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
              <span className="hint">日均产出</span>
              <b className="display" style={{ fontSize: 22 }}>
                {(mp / dim).toFixed(1)}
              </b>
            </div>
          </div>
        </div>
        <div className="cal">
          <div className="cal-head">
            <button className="btn ghost sm" onClick={prev}>
              ‹ 上月
            </button>
            <div className="display" style={{ fontSize: 18 }}>
              {y} 年 {m + 1} 月
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn ghost sm" onClick={today}>
                本月
              </button>
              <button className="btn ghost sm" onClick={next}>
                下月 ›
              </button>
            </div>
          </div>
          <div className="cal-grid">
            {dow.map((d) => (
              <div className="cal-dow" key={d}>
                {d}
              </div>
            ))}
          </div>
          <div className="cal-grid">{cells}</div>
        </div>
        <div className="row" style={{ gap: 16, marginTop: 12, alignItems: "center" }}>
          <span className="pill-s ps-ready">✓ 已发布</span>
          <span className="pill-s ps-warn">⏳ 已排期</span>
          <span className="hint">点某天看明细</span>
        </div>
      </div>
    </>
  );
}
