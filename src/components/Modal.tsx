import { useUi } from "../store";

export default function Modal() {
  const modal = useUi((s) => s.modal);
  const closeModal = useUi((s) => s.closeModal);
  return (
    <div className={"modal-bg" + (modal ? " show" : "")} onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal">{modal}</div>
    </div>
  );
}
