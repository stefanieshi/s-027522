/**
 * notify.ts — 桌面通知 + 提醒音(大V雷达用)。
 * 关闭态(app 没开)推送需 PWA Service Worker / 原生壳;本期做开启态。
 */
export function notifySupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function ensurePermission(): Promise<boolean> {
  if (!notifySupported()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    return (await Notification.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

/** 短促提醒音(WebAudio,无需音频文件)。 */
export function playAlert(): void {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    // 两声清脆 "叮咚"
    [0, 0.18].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = i === 0 ? 880 : 1175;
      gain.gain.setValueAtTime(0.0001, now + t);
      gain.gain.exponentialRampToValueAtTime(0.22, now + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.18);
    });
    setTimeout(() => ctx.close().catch(() => {}), 600);
  } catch {
    /* ignore */
  }
}

export function showNotification(title: string, body: string): void {
  try {
    if (notifySupported() && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico", tag: "vibe-radar" });
    }
  } catch {
    /* ignore */
  }
}

/** 通知 + 提醒音一起来。 */
export function alertNewMentions(count: number, sample?: string): void {
  playAlert();
  showNotification(`📡 ${count} 条大V新帖待回复`, sample ? sample.slice(0, 80) : "AI 已草拟回复,去收件箱审核发送");
}
