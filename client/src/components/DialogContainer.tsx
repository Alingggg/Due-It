import {
  AddMaterialDialog,
  ConfirmActionDialog,
  ConfirmDeleteWorkspaceDialog,
  CreateWorkspaceDialog,
  JoinWorkspaceDialog,
  UpsertMaterialGroupDialog,
  UpsertScheduleDialog,
  UpsertSubjectDialog,
  UpsertTaskDialog,
} from "@/components";
import { useDialogContext } from "@/hooks";

export default function DialogContainer() {
  const { dialogType, dialogProps, closeDialog } = useDialogContext();

  if (!dialogType) return null;

  const dialogMap = {
    UPSERT_TASK: UpsertTaskDialog,
    UPSERT_MATERIAL: UpsertMaterialGroupDialog,
    UPSERT_SUBJECT: UpsertSubjectDialog,
    CONFIRM_ACTION: ConfirmActionDialog,
    UPSERT_SCHEDULE: UpsertScheduleDialog,
    ADD_MATERIAL: AddMaterialDialog,
    CONFIRM_DELETE_WORKSPACE: ConfirmDeleteWorkspaceDialog,
    CREATE_WORKSPACE: CreateWorkspaceDialog,
    JOIN_WORKSPACE: JoinWorkspaceDialog,
  };

  const DialogComponent = dialogMap[dialogType];

  return DialogComponent ? (
    <DialogComponent {...dialogProps} onClose={closeDialog} />
  ) : null;
}
