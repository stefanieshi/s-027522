import { useState } from "react";
import TopBar from "../components/TopBar";
import { useData } from "../store";
import { PLAT_LABEL } from "../lib/constants";
import { initial } from "../lib/utils";
import { refreshMetrics } from "../lib/actions";

const fmtNum = (n: number) => (n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k" : String(n));

export default function Analytics() {
  const data = useData((s) => s.data);
  const acctOf = (id: string) => data.accounts.find((a) => a.id === id);
  const [refreshing, setRefreshing] = useState(false);

  async function doRefresh() {
    setRefreshing(true);
    await refreshMetrics();
    setRefreshing(false);
  }

  const pub = data.drafts.filter((d) => d.status === "published");
  const sch = data.drafts.filter((d) => d.status === "approved" && d.scheduledAt);
  const tagged = pub.filter((d) => d.result);
  const wins = tagged.filter((d) => d.result!.tier === "win");
  const winRate = tagged.length ? Math.round((wins.length / tagged.length) * 100) : null;

  const counts: Record<string, number> = {};
  pub.forEach((d) => (counts[d.account_id] = (counts[d.account_id] || 0) + 1));
  const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const topA = topId ? acctOf(topId) : null;

  // ---- real engagement data (from backend zernioAnalytics) ----
  const withMetrics = pub.filter((d) => d.metrics);
  const hasReal = withMetrics.length > 0;
  const sum = (f: (m: NonNullable<(typeof pub)[number]["metrics"]>) => number | null) =>
    withMetrics.reduce((s, d) => s + (f(d.metrics!) || 0), 0);
  const totalViews = sum((m) => m.views);
  const totalLikes = sum((m) => m.likes);
  const engVals = withMetrics.map((d) => d.metrics!.engagementRate).filter((x): x is number => x != null);
  const avgEng = engVals.length ? engVals.reduce((a, b) => a + b, 0) / engVals.length : null;

  const useBackend = data.settings.useBackend;
  const right = useBackend ? (
    <button className="btn ghost sm" disabled={refreshing} onClick={doRefresh}>
      {refreshing ? <span className="spin" /> : "🔄"} 刷新真实数据
    </button>
  ) : undefined;

  return (
    <>
      <TopBar view="analytics" right={right} />
      <div className="view">
        <div className="banner">
          {hasReal
            ? "📊 已接入真实互动数据(zernio):下方「真实互动」区为各平台回收的浏览/点赞/互动率;产出量与爆款打分仍保留作为飞轮输入。"
            : "ℹ️ 真·互动数据(浏览/点赞/涨粉)由后端定时调 zernioAnalytics 回收。开启「后端真发布」并用真实 zernio key 发帖后,点右上「刷新真实数据」即可看到。当前看板基于产出量 + 你的爆款打分 + 排期。"}
        </div>

        {hasReal && (
          <>
            <div className="sect" style={{ marginTop: 0 }}>
              真实互动 · 共 {withMetrics.length} 条已回收
            </div>
            <div className="row" style={{ gap: 14, marginBottom: 18 }}>
              <div className="card" style={{ flex: 1, textAlign: "center" }}>
                <div className="display" style={{ fontSize: 26, color: "var(--blue)" }}>
                  {fmtNum(totalViews)}
                </div>
                <div className="hint">总浏览</div>
              </div>
              <div className="card" style={{ flex: 1, textAlign: "center" }}>
                <div className="display" style={{ fontSize: 26, color: "var(--brand)" }}>
                  {fmtNum(totalLikes)}
                </div>
                <div className="hint">总点赞</div>
              </div>
              <div className="card" style={{ flex: 1, textAlign: "center" }}>
                <div className="display" style={{ fontSize: 26, color: "var(--ready)" }}>
                  {avgEng === null ? "—" : (avgEng * 100).toFixed(1) + "%"}
                </div>
                <div className="hint">平均互动率</div>
              </div>
            </div>
          </>
        )}
        <div className="row" style={{ gap: 14, marginBottom: 18 }}>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div className="display" style={{ fontSize: 26, color: "var(--ready)" }}>
              {pub.length}
            </div>
            <div className="hint">总发布</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div className="display" style={{ fontSize: 26, color: "var(--warn)" }}>
              {sch.length}
            </div>
            <div className="hint">待发排期</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div className="display" style={{ fontSize: 26 }}>
              {winRate === null ? "—" : winRate + "%"}
            </div>
            <div className="hint">整体爆款率</div>
          </div>
          <div className="card" style={{ flex: 1, textAlign: "center" }}>
            <div className="display" style={{ fontSize: 16, marginTop: 8 }}>
              {topA ? topA.handle : "—"}
            </div>
            <div className="hint">最活跃账号</div>
          </div>
        </div>
        <div className="sect" style={{ marginTop: 0 }}>
          各账号表现 · 人格 × 产出
        </div>
        {data.accounts.length ? (
          <div className="an-grid">
            {data.accounts.map((a) => {
              const ap = pub.filter((d) => d.account_id === a.id);
              const asch = sch.filter((d) => d.account_id === a.id).length;
              const at = ap.filter((d) => d.result);
              const aw = at.filter((d) => d.result!.tier === "win").length;
              const wr = at.length ? Math.round((aw / at.length) * 100) : null;
              const apf = ap.length ? ap.reduce((s, d) => s + (d.self?.persona || 0), 0) / ap.length : null;
              const recent = ap.slice(-6).map((d) => d.result?.tier);
              const am = ap.filter((d) => d.metrics);
              const aViews = am.reduce((s, d) => s + (d.metrics!.views || 0), 0);
              const aLikes = am.reduce((s, d) => s + (d.metrics!.likes || 0), 0);
              return (
                <div className="card" key={a.id}>
                  <div className="row" style={{ alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div className="acct-av" style={{ background: a.color }}>
                      {initial(a.handle)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>{a.handle}</div>
                      <span className={"platTag p-" + a.platform}>{PLAT_LABEL[a.platform]}</span>
                    </div>
                  </div>
                  <div className="hint" style={{ marginBottom: 11 }}>
                    🎭 {a.persona.stance || a.persona.voice}
                  </div>
                  <div className="an-stats">
                    <div className="an-stat">
                      <div className="n">{ap.length}</div>
                      <div className="l">已发布</div>
                    </div>
                    <div className="an-stat">
                      <div className="n" style={{ color: "var(--warn)" }}>
                        {asch}
                      </div>
                      <div className="l">已排期</div>
                    </div>
                    <div className="an-stat">
                      <div className="n" style={{ color: "var(--ready)" }}>
                        {wr === null ? "—" : wr + "%"}
                      </div>
                      <div className="l">爆款率</div>
                    </div>
                    <div className="an-stat">
                      <div className="n">{apf === null ? "—" : apf.toFixed(2)}</div>
                      <div className="l">人格契合</div>
                    </div>
                  </div>
                  {!!am.length && (
                    <div className="row" style={{ gap: 14, marginTop: 10 }}>
                      <span className="pill-s ps-blue">👁 {fmtNum(aViews)} 浏览</span>
                      <span className="pill-s ps-brand">❤ {fmtNum(aLikes)} 点赞</span>
                      <span className="hint">· {am.length} 条真实数据</span>
                    </div>
                  )}
                  {!!recent.length && (
                    <div className="dots">
                      {recent.map((t, i) => (
                        <span
                          key={i}
                          className="dot-w"
                          style={{
                            background:
                              t === "win" ? "var(--ready)" : t === "flop" ? "#C53D27" : t === "mid" ? "var(--warn)" : "var(--line)",
                          }}
                        />
                      ))}
                      <span className="hint" style={{ marginLeft: 4 }}>
                        近 {recent.length} 条
                      </span>
                    </div>
                  )}
                  <div className="hint" style={{ marginTop: 10 }}>
                    {wr !== null
                      ? wr >= 50
                        ? "🔥 这个号在打 — 把它的赢家钩子复用到别的号"
                        : "多标记几条表现,飞轮才能告诉你什么有效"
                      : "还没发布/标记数据"}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            <b>还没有账号</b>
          </div>
        )}
      </div>
    </>
  );
}
