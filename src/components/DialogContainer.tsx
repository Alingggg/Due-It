"use client";
import useDialogContext from "@/hooks/Dialog";
import RequestResetPasswordDialog from "@/components/dialogs/RequestResetPasswordDialog";
import UpsertMaterialGroupDialog from "@/components/dialogs/UpsertMaterialGroupDialog";
import UpsertTaskDialog from "@/components/dialogs/UpsertTaskDialog";
import UpsertSubjectDialog from "@/components/dialogs/UpsertSubjectDialog";
import ConfirmActionDialog from "@/components/dialogs/ConfirmActionDialog";
import UpsertScheduleDialog from "@/components/dialogs/UpsertScheduleDialog";
import AddMaterialDialog from "@/components/dialogs/AddMaterialDialog";
import ConfirmDeleteWorkspace from "@/components/dialogs/ConfirmDeleteWorkspace";

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
    ADD_MATERIAL: AddMaterialDialog,
    CONFIRM_DELETE_WORKSPACE: ConfirmDeleteWorkspace,
  };

  const DialogComponent = dialogMap[dialogType];

  return DialogComponent ? (
    <DialogComponent {...dialogProps} onClose={closeDialog} />
  ) : null;
}
