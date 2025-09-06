"use client";
import useDialogContext from "@/hooks/Dialog";
import RequestResetPasswordDialog from "@/components/dialogs/RequestResetPasswordDialog";
import UpsertMaterialGroupDialog from "@/components/dialogs/UpsertMaterialGroupDialog";
import UpsertTaskDialog from "@/components/dialogs/UpsertTaskDialog";
import UpsertSubjectDialog from "@/components/dialogs/UpsertSubjectDialog";
import ConfirmActionDialog from "@/components/dialogs/ConfirmActionDialog";
import UpsertScheduleDialog from "@/components/dialogs/UpsertScheduleDialog";

export default function DialogContainer() {
  const { dialogType, dialogProps, closeDialog } = useDialogContext();

  if (!dialogType) return null;

  const dialogMap = {
    REQUEST_RESET_PASSWORD: RequestResetPasswordDialog,
    UPSERT_TASK: UpsertTaskDialog,
    UPSERT_MATERIAL: UpsertMaterialGroupDialog,
    UPSERT_SUBJECT: UpsertSubjectDialog,
    CONFIRM_ACTION: ConfirmActionDialog,
    UPSERT_SCHEDULE: UpsertScheduleDialog,
  };

  const DialogComponent = dialogMap[dialogType];

  return DialogComponent ? (
    <DialogComponent {...dialogProps} onClose={closeDialog} />
  ) : null;
}
