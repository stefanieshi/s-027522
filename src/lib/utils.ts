/** Short random id. */
export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

/** Format a count compactly: 18400 → "18.4K", 1.2e6 → "1.2M". */
export function fmt(n: number): string {
  return n >= 1e6
    ? (n / 1e6).toFixed(1) + "M"
    : n >= 1e3
    ? (n / 1e3).toFixed(1) + "K"
    : "" + n;
}

/** Copy text to the clipboard; resolves to whether it succeeded. */
export async function copy(t: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(t);
    return true;
  } catch {
    return false;
  }
}
