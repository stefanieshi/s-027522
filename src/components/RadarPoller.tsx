import { useEffect, useRef } from "react";
import { useData, useUi } from "../store";
import { apiListMentions, apiMarkMentionsNotified } from "../lib/api";
import { alertNewMentions } from "../lib/notify";

/** 后台轮询大V回复待办:更新角标 + 新条目触发桌面通知/提醒音。无 UI。 */
export default function RadarPoller() {
  const useBackend = useData((s) => s.data.settings.useBackend);
  const apiBase = useData((s) => s.data.settings.apiBase);
  const notifyDesktop = useData((s) => s.data.settings.notifyDesktop);
  const setRadarCount = useUi((s) => s.setRadarCount);
  const seen = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!useBackend) {
      setRadarCount(0);
      return;
    }
    let alive = true;

    async function tick() {
      const { data, error } = await apiListMentions(apiBase, "drafted");
      if (!alive || error) return;
      setRadarCount(data.length);
      const fresh = data.filter((m) => !m.notified && !seen.current.has(m.id));
      if (fresh.length) {
        fresh.forEach((m) => seen.current.add(m.id));
        if (notifyDesktop) alertNewMentions(fresh.length, fresh[0].postText || fresh[0].author || "");
        apiMarkMentionsNotified(apiBase, fresh.map((m) => m.id));
      }
    }

    tick();
    const id = setInterval(tick, 30_000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [useBackend, apiBase, notifyDesktop, setRadarCount]);

  return null;
}
