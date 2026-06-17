import { useState } from "react";
import { useData, useUi } from "../store";
import { AV, PLATFORMS, PLAT_LABEL } from "../lib/constants";
import { uid } from "../lib/utils";
import { tearSwipe } from "../lib/actions";
import { apiDiscover, apiPullInbox, apiZernioAccounts, NO_APIFY_TOKEN, UNREACHABLE, type ViralCandidate, type ZernioAccount } from "../lib/api";
import type { Account, Platform } from "../lib/types";

function apifyToast(error: string | undefined, toast: (m: string) => void): void {
  if (error === NO_APIFY_TOKEN) toast("后端未配 APIFY_TOKEN · 去 server/.env 填一个");
  else if (error === UNREACHABLE) toast("后端未连上 · 确认已 npm run dev");
  else if (error) toast("抓取失败:" + error.slice(0, 50));
}

/** 不同平台「发现/趋势」的查询入参说明。 */
export function queryLabel(p: Platform): string {
  return p === "tiktok" ? "话题 / hashtag" : p === "reddit" ? "关键词 / subreddit" : "账号 @handle";
}
export function queryPlaceholder(p: Platform): string {
  return p === "tiktok" ? "buildinpublic" : p === "reddit" ? "indie hackers" : "@levelsio";
}

export function AccountModal({ id }: { id?: string }) {
  const setData = useData((s) => s.setData);
  const existing = useData((s) => (id ? s.data.accounts.find((a) => a.id === id) : undefined));
  const accountsLen = useData((s) => s.data.accounts.length);
  const apiBase = useData((s) => s.data.settings.apiBase);
  const { closeModal, toast } = useUi();

  const e: Account = existing || ({ handle: "", platform: "x", persona: { voice: "", stance: "", taboo: "", format: "" } } as Account);
  const [handle, setHandle] = useState(e.handle);
  const [platform, setPlatform] = useState<Platform>(e.platform);
  const [voice, setVoice] = useState(e.persona.voice);
  const [stance, setStance] = useState(e.persona.stance);
  const [taboo, setTaboo] = useState(e.persona.taboo);
  const [format, setFormat] = useState(e.persona.format);
  const [externalId, setExternalId] = useState(e.externalId || "");
  const [zList, setZList] = useState<ZernioAccount[] | null>(null);
  const [zLoading, setZLoading] = useState(false);

  /** 从 zernio 拉取已连接账号,按当前平台过滤,供下拉选择自动填外部 ID。 */
  async function pullZernio() {
    setZLoading(true);
    const { data, error } = await apiZernioAccounts(apiBase);
    setZLoading(false);
    if (error) {
      if (error === UNREACHABLE) toast("后端未连上 · 确认已 npm run dev");
      else if (error.includes("未配置") || error.includes("ZERNIO_API_KEY")) toast("后端未配 ZERNIO_API_KEY · 去 server/.env 填一个");
      else toast("拉取失败:" + error.slice(0, 50));
      return;
    }
    const mine = data.filter((a) => a.platform === platform);
    if (!mine.length) {
      toast(data.length ? `Zernio 没有 ${PLAT_LABEL[platform]} 账号` : "Zernio 未连接任何账号");
      setZList([]);
      return;
    }
    setZList(mine);
    if (mine.length === 1) {
      setExternalId(mine[0].id);
      toast("已填入:" + (mine[0].username || mine[0].displayName || mine[0].id));
    }
  }

  function save() {
    if (!handle.trim()) {
      toast("handle 不能为空");
      return;
    }
    setData((d) => {
      const persona = { voice, stance, taboo, format };
      const ext = externalId.trim() || undefined;
      if (id) {
        const t = d.accounts.find((a) => a.id === id);
        if (t) {
          t.handle = handle.trim();
          t.platform = platform;
          t.persona = persona;
          t.externalId = ext;
        }
      } else {
        d.accounts.push({ id: uid(), handle: handle.trim(), platform, color: AV[accountsLen % AV.length], persona, externalId: ext });
      }
    });
    closeModal();
    toast("已保存");
  }

  return (
    <>
      <h3>{id ? "编辑账号" : "新增账号"}</h3>
      <div className="grid2">
        <label className="fld">
          <span className="lab">handle</span>
          <input className="in" value={handle} placeholder="@yourhandle" onChange={(ev) => setHandle(ev.target.value)} />
        </label>
        <label className="fld">
          <span className="lab">平台</span>
          <select className="in" value={platform} onChange={(ev) => setPlatform(ev.target.value as Platform)}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLAT_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="fld">
        <span className="lab">语气</span>
        <input className="in" value={voice} onChange={(ev) => setVoice(ev.target.value)} />
      </label>
      <label className="fld">
        <span className="lab">立场</span>
        <input className="in" value={stance} onChange={(ev) => setStance(ev.target.value)} />
      </label>
      <label className="fld">
        <span className="lab">禁用</span>
        <input className="in" value={taboo} onChange={(ev) => setTaboo(ev.target.value)} />
      </label>
      <label className="fld">
        <span className="lab">格式</span>
        <input className="in" value={format} onChange={(ev) => setFormat(ev.target.value)} />
      </label>
      <label className="fld">
        <span className="lab">外部账号 ID(选填 · zernio account_id / morelogin profile)</span>
        <div className="row" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input className="in" value={externalId} placeholder="真发布时用;留空则仅 manual" onChange={(ev) => setExternalId(ev.target.value)} />
          <button type="button" className="btn ghost" disabled={zLoading} onClick={pullZernio} title="从已配置的 Zernio 账号自动填入">
            {zLoading ? "拉取中…" : "从 Zernio 拉取"}
          </button>
        </div>
        {zList && zList.length > 0 && (
          <select className="in" style={{ marginTop: 6 }} value={externalId} onChange={(ev) => setExternalId(ev.target.value)}>
            <option value="">选择一个 Zernio 账号…</option>
            {zList.map((a) => (
              <option key={a.id} value={a.id}>
                {(a.username || a.displayName || a.id) + (a.isActive === false ? "(未激活)" : "")}
              </option>
            ))}
          </select>
        )}
      </label>
      <div className="mfoot">
        <button className="btn ghost" onClick={closeModal}>
          取消
        </button>
        <button className="btn" onClick={save}>
          保存
        </button>
      </div>
    </>
  );
}

export function SwipeModal() {
  const setData = useData((s) => s.setData);
  const { closeModal, toast, setVoiceTab } = useUi();
  const [platform, setPlatform] = useState<Platform>("x");
  const [source, setSource] = useState("");
  const [raw, setRaw] = useState("");

  function save() {
    if (!raw.trim()) {
      toast("内容不能为空");
      return;
    }
    const newId = uid();
    setData((d) => {
      d.swipes.unshift({ id: newId, platform, source: source.trim() || "unknown", metrics: "", raw: raw.trim(), teardown: null, pattern: null });
    });
    closeModal();
    setVoiceTab("swipe");
    tearSwipe(newId);
  }

  return (
    <>
      <h3>收藏爆款</h3>
      <div className="grid2">
        <label className="fld">
          <span className="lab">平台</span>
          <select className="in" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLAT_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
        <label className="fld">
          <span className="lab">来源</span>
          <input className="in" value={source} placeholder="@竞品 / self" onChange={(e) => setSource(e.target.value)} />
        </label>
      </div>
      <label className="fld">
        <span className="lab">内容</span>
        <textarea className="in" style={{ minHeight: 100 }} value={raw} placeholder="把爆款文案/字幕粘进来…" onChange={(e) => setRaw(e.target.value)} />
      </label>
      <div className="mfoot">
        <button className="btn ghost" onClick={closeModal}>
          取消
        </button>
        <button className="btn" onClick={save}>
          保存并拆解
        </button>
      </div>
    </>
  );
}

export function InboxAddModal() {
  const setData = useData((s) => s.setData);
  const { closeModal, toast } = useUi();
  const [from, setFrom] = useState("");
  const [platform, setPlatform] = useState<Platform>("x");
  const [msg, setMsg] = useState("");

  function save() {
    if (!msg.trim()) {
      toast("内容不能为空");
      return;
    }
    setData((d) => {
      d.inbox.unshift({
        id: uid(),
        from: from.trim() || "@user",
        platform,
        color: AV[Math.floor(Math.random() * AV.length)],
        msg: msg.trim(),
        reply: "",
        status: "new",
        flagged: false,
      });
    });
    closeModal();
  }

  return (
    <>
      <h3>加一条互动消息</h3>
      <div className="grid2">
        <label className="fld">
          <span className="lab">来自</span>
          <input className="in" value={from} placeholder="@someone" onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="fld">
          <span className="lab">平台</span>
          <select className="in" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {PLAT_LABEL[p]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="fld">
        <span className="lab">消息内容</span>
        <textarea className="in" style={{ minHeight: 80 }} value={msg} onChange={(e) => setMsg(e.target.value)} />
      </label>
      <div className="mfoot">
        <button className="btn ghost" onClick={closeModal}>
          取消
        </button>
        <button className="btn" onClick={save}>
          加入
        </button>
      </div>
    </>
  );
}

/* ===================== 爆款雷达(Apify 发现爆款 → 爆款库) ===================== */
export function RadarModal() {
  const apiBase = useData((s) => s.data.settings.apiBase);
  const setData = useData((s) => s.setData);
  const { toast } = useUi();
  const [platform, setPlatform] = useState<Platform>("tiktok");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState("8");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ViralCandidate[]>([]);
  const [added, setAdded] = useState<Record<string, boolean>>({});

  async function search() {
    if (!query.trim()) {
      toast("请输入" + queryLabel(platform));
      return;
    }
    setLoading(true);
    setResults([]);
    const { data, error } = await apiDiscover(apiBase, platform, query.trim(), Math.max(1, Math.min(30, parseInt(limit) || 8)));
    setLoading(false);
    if (error) return apifyToast(error, toast);
    if (!data.length) toast("没抓到结果,换个词试试");
    setResults(data);
  }

  function save(c: ViralCandidate, key: string) {
    const id = uid();
    setData((d) => {
      d.swipes.unshift({ id, platform: c.platform, source: c.source, metrics: c.metrics, raw: c.raw, teardown: null, pattern: null });
    });
    setAdded((a) => ({ ...a, [key]: true }));
    tearSwipe(id); // 入库即自动拆解成 pattern
    toast("已收藏 · 拆解中…");
  }

  return (
    <>
      <h3>🔭 爆款雷达</h3>
      <div className="hint" style={{ marginBottom: 12 }}>
        按平台抓取近期爆款,一键进爆款库并自动拆成可复用 pattern。TikTok 用话题/hashtag,X 用 @handle。
      </div>
      <div className="grid2">
        <label className="fld">
          <span className="lab">平台</span>
          <select className="in" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
            <option value="tiktok">TikTok(话题)</option>
            <option value="x">X(@handle)</option>
            <option value="reddit">Reddit(关键词)</option>
          </select>
        </label>
        <label className="fld">
          <span className="lab">数量</span>
          <input className="in" type="number" min={1} max={30} value={limit} onChange={(e) => setLimit(e.target.value)} />
        </label>
      </div>
      <label className="fld">
        <span className="lab">{queryLabel(platform)}</span>
        <input
          className="in"
          value={query}
          placeholder={queryPlaceholder(platform)}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
      </label>
      <div className="row" style={{ marginBottom: 6 }}>
        <button className="btn" disabled={loading} onClick={search}>
          {loading ? <span className="spin" /> : "🔭"} 搜索
        </button>
      </div>
      {!!results.length && (
        <div style={{ maxHeight: "44vh", overflowY: "auto", marginTop: 8 }}>
          {results.map((c, i) => {
            const key = c.url || c.source + i;
            return (
              <div className="swrow" key={key} style={{ alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ gap: 7, marginBottom: 4 }}>
                    <span className={"platTag p-" + c.platform}>{PLAT_LABEL[c.platform]}</span>
                    <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{c.source}</span>
                    <span className="pill-s ps-mut">{c.metrics}</span>
                  </div>
                  <div className="raw" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {c.raw || "(无文案)"}
                  </div>
                </div>
                <button className="btn ghost sm" disabled={!!added[key]} onClick={() => save(c, key)}>
                  {added[key] ? "✓ 已收藏" : "收藏"}
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="mfoot">
        <button className="btn ghost" onClick={() => useUi.getState().closeModal()}>
          关闭
        </button>
      </div>
    </>
  );
}

/* ===================== 真·收件箱:拉取互动(Apify 评论/回复) ===================== */
export function PullInboxModal() {
  const apiBase = useData((s) => s.data.settings.apiBase);
  const setData = useData((s) => s.setData);
  const { closeModal, toast } = useUi();
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [urls, setUrls] = useState("");
  const [limit, setLimit] = useState("20");
  const [loading, setLoading] = useState(false);

  async function pull() {
    const postUrls = urls.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    if (!postUrls.length) {
      toast("贴一条或多条帖子 URL");
      return;
    }
    setLoading(true);
    const { data, error } = await apiPullInbox(apiBase, platform, postUrls, Math.max(1, Math.min(100, parseInt(limit) || 20)));
    setLoading(false);
    if (error) return apifyToast(error, toast);

    let added = 0;
    setData((d) => {
      const seen = new Set(d.inbox.map((m) => m.from + "|" + m.msg));
      data.forEach((c) => {
        const k = c.from + "|" + c.msg;
        if (c.msg && !seen.has(k)) {
          seen.add(k);
          added++;
          d.inbox.unshift({
            id: uid(),
            from: c.from,
            platform: c.platform,
            color: AV[Math.floor(Math.random() * AV.length)],
            msg: c.msg,
            reply: "",
            status: "new",
            flagged: false,
          });
        }
      });
    });
    closeModal();
    toast(added ? `已拉入 ${added} 条互动` : "没有新互动");
  }

  return (
    <>
      <h3>⬇️ 拉取互动</h3>
      <div className="hint" style={{ marginBottom: 12 }}>
        从公开帖子抓评论/回复进收件箱,助手草回复后仍由你一键打开原生发送框人工发。支持 Instagram、X、TikTok、Reddit。
      </div>
      <div className="grid2">
        <label className="fld">
          <span className="lab">平台</span>
          <select className="in" value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
            <option value="instagram">Instagram</option>
            <option value="x">X</option>
            <option value="tiktok">TikTok</option>
            <option value="reddit">Reddit</option>
          </select>
        </label>
        <label className="fld">
          <span className="lab">每帖最多</span>
          <input className="in" type="number" min={1} max={100} value={limit} onChange={(e) => setLimit(e.target.value)} />
        </label>
      </div>
      <label className="fld">
        <span className="lab">帖子 URL(每行一条 / 逗号分隔)</span>
        <textarea className="in" style={{ minHeight: 80 }} value={urls} placeholder="https://www.instagram.com/p/...." onChange={(e) => setUrls(e.target.value)} />
      </label>
      <div className="mfoot">
        <button className="btn ghost" onClick={closeModal}>
          取消
        </button>
        <button className="btn" disabled={loading} onClick={pull}>
          {loading ? <span className="spin" /> : "⬇️"} 拉取
        </button>
      </div>
    </>
  );
}
