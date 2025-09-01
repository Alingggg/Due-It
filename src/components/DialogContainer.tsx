"use client";
import useDialogContext from "@/hooks/Dialog";
import RequestResetPasswordDialog from "@/components/dialogs/RequestResetPasswordDialog";
import UpsertMaterialDialog from "@/components/dialogs/UpsertMaterialDialog";
import UpsertTaskDialog from "@/components/dialogs/UpsertTaskDialog";
import UpsertSubjectDialog from "@/components/dialogs/UpsertSubjectDialog";
import ConfirmActionDialog from "@/components/dialogs/ConfirmActionDialog";

export default function DialogContainer() {
  const { dialogType, dialogProps, closeDialog } = useDialogContext();

  if (!dialogType) return null;

  const dialogMap = {
    REQUEST_RESET_PASSWORD: RequestResetPasswordDialog,
    UPSERT_TASK: UpsertTaskDialog,
    UPSERT_MATERIAL: UpsertMaterialDialog,
    UPSERT_SUBJECT: UpsertSubjectDialog,
    CONFIRM_ACTION: ConfirmActionDialog,
  };

  const DialogComponent = dialogMap[dialogType];

  return DialogComponent ? (
    <DialogComponent {...dialogProps} onClose={closeDialog} />
  ) : null;
}
