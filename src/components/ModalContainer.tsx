"use client";
import { createPortal } from "react-dom";
import useModalContext from "@/hooks/Modal";
import ConfirmMemberActionModal from "@/components/modals/ConfirmMemberActionModal";
import DeleteTaskModal from "@/components/modals/DeleteTaskModal";
import RequestResetPasswordModal from "@/components/modals/RequestResetPasswordModal";
import UpsertMaterialModal from "@/components/modals/UpsertMaterialModal";
import UpsertTaskModal from "@/components/modals/UpsertTaskModal";

export default function ModalContainer() {
  const { modalType, modalProps, closeModal } = useModalContext();

  if (!modalType) return null;

  const modalMap = {
    REQUEST_RESET_PASSWORD: (
      <RequestResetPasswordModal {...modalProps} onClose={closeModal} />
    ),
    UPSERT_TASK: <UpsertTaskModal {...modalProps} onClose={closeModal} />,
    DELETE_TASK: <DeleteTaskModal {...modalProps} onClose={closeModal} />,
    CONFIRM_MEMBER_ACTION: (
      <ConfirmMemberActionModal {...modalProps} onClose={closeModal} />
    ),
    UPSERT_MATERIAL: (
      <UpsertMaterialModal {...modalProps} onClose={closeModal} />
    ),
  };

  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      {modalMap[modalType] || null}
    </div>,
    modalRoot
  );
}
