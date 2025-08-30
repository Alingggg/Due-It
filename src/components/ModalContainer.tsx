"use client";
import { Dialog } from "@/components/ui/dialog";
import useModalContext from "@/hooks/Modal";
import ConfirmMemberActionModal from "@/components/modals/ConfirmMemberActionModal";
import DeleteTaskModal from "@/components/modals/DeleteTaskModal";
import RequestResetPasswordModal from "@/components/modals/RequestResetPasswordModal";
import UpsertMaterialModal from "@/components/modals/UpsertMaterialModal";
import UpsertTaskModal from "@/components/modals/UpsertTaskModal";
import DeleteMaterialModal from "@/components/modals/DeleteMaterialModal";
import LeaveWorkspaceModal from "@/components/modals/LeaveWorkspaceModal";

export default function ModalContainer() {
  const { modalType, modalProps, closeModal } = useModalContext();

  if (!modalType) return null;

  const modalMap = {
    REQUEST_RESET_PASSWORD: RequestResetPasswordModal,
    UPSERT_TASK: UpsertTaskModal,
    DELETE_TASK: DeleteTaskModal,
    CONFIRM_MEMBER_ACTION: ConfirmMemberActionModal,
    UPSERT_MATERIAL: UpsertMaterialModal,
    DELETE_MATERIAL: DeleteMaterialModal,
    LEAVE_WORKSPACE: LeaveWorkspaceModal,
  };

  const ModalComponent = modalMap[modalType];

  return (
    <Dialog open={!!modalType} onOpenChange={closeModal}>
      {ModalComponent && (
        <ModalComponent {...modalProps} onClose={closeModal} />
      )}
    </Dialog>
  );
}
