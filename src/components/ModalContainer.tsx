import { createPortal } from "react-dom";
import { useModalContext } from "@/hooks";
import { RequestResetPasswordModal } from "@/components";

export default function ModalContainer() {
  const { modalType, modalProps, closeModal } = useModalContext();

  if (!modalType) return null;

  const modalMap = {
    REQUEST_RESET_PASSWORD: (
      <RequestResetPasswordModal {...modalProps} onClose={closeModal} />
    ),
  };

  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {modalMap[modalType] || null}
    </div>,
    modalRoot
  );
}
