import { useData, useUi } from "../store";
import { teardownSwipe } from "./llm";

/** Tear down a swipe into a reusable pattern (shared by Voice page + swipe modal). */
export async function tearSwipe(id: string): Promise<void> {
  const cur = useData.getState().data;
  const sw = cur.swipes.find((s) => s.id === id);
  if (!sw) return;
  useUi.getState().toast("拆解中…");
  try {
    const r = await teardownSwipe(cur.settings, sw);
    useData.getState().setData((d) => {
      const t = d.swipes.find((x) => x.id === id);
      if (t) {
        t.teardown = r.teardown;
        t.pattern = r.pattern;
      }
    });
    useUi.getState().toast("拆解完成");
  } catch (e: any) {
    useUi.getState().toast("拆解失败:" + e.message.slice(0, 40));
  }
}
