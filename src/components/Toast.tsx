import { useUi } from "../store";

export default function Toast() {
  const msg = useUi((s) => s.toastMsg);
  return <div className={"toast" + (msg ? " show" : "")}>{msg}</div>;
}
