"use client";
import { Dialog } from "@/components/ui/dialog";
import useDialogContext from "@/hooks/Dialog";
import ConfirmMemberActionDialog from "@/components/dialogs/MemberActionDialog";
import DeleteTaskDialog from "@/components/dialogs/DeleteTaskDialog";
import RequestResetPasswordDialog from "@/components/dialogs/RequestResetPasswordDialog";
import UpsertMaterialDialog from "@/components/dialogs/UpsertMaterialDialog";
import UpsertTaskDialog from "@/components/dialogs/UpsertTaskDialog";
import DeleteMaterialDialog from "@/components/dialogs/DeleteMaterialDialog";
import LeaveWorkspaceDialog from "@/components/dialogs/LeaveWorkspaceDialog";

export default function DialogContainer() {
  const { dialogType, dialogProps, closeDialog } = useDialogContext();

  if (!dialogType) return null;

  const dialogMap = {
    REQUEST_RESET_PASSWORD: RequestResetPasswordDialog,
    UPSERT_TASK: UpsertTaskDialog,
    DELETE_TASK: DeleteTaskDialog,
    CONFIRM_MEMBER_ACTION: ConfirmMemberActionDialog,
    UPSERT_MATERIAL: UpsertMaterialDialog,
    DELETE_MATERIAL: DeleteMaterialDialog,
    LEAVE_WORKSPACE: LeaveWorkspaceDialog,
  };

  const DialogComponent = dialogMap[dialogType];

  return (
    <Dialog open={!!dialogType} onOpenChange={closeDialog}>
      {DialogComponent && (
        <DialogComponent {...dialogProps} onClose={closeDialog} />
      )}
    </Dialog>
  );
}
