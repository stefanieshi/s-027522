import type { ReactNode } from "react";
import { META } from "../lib/constants";
import type { ViewId } from "../lib/types";

export default function TopBar({ view, right }: { view: ViewId; right?: ReactNode }) {
  const m = META[view];
  return (
    <div className="topbar">
      <div>
        <div className="eyebrow">{m.eb}</div>
        <h1>{m.t}</h1>
        <div className="desc">{m.d}</div>
      </div>
      <div>{right}</div>
    </div>
  );
}
