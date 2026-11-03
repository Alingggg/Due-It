import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  FormError,
  Input,
  Label,
} from "@/components";
import { useDeleteWorkspace } from "@/hooks";
import { cn } from "@/lib";
import { useForm } from "react-hook-form";

interface ConfirmDeleteWorkspaceProps {
  onClose: () => void;
  workspaceName: string;
}

function ConfirmDeleteWorkspaceDialog({
  onClose,
  workspaceName,
}: ConfirmDeleteWorkspaceProps) {
  const { register, watch } = useForm({
    defaultValues: { confirmWorkspaceName: "" },
  });
  const {
    mutate: deleteWorkspace,
    isPending: isDeletingWorkspace,
    error: deleteWorkspaceError,
  } = useDeleteWorkspace();

  const inputWorkspace = watch("confirmWorkspaceName");
  const isDeleteEnabled = workspaceName === inputWorkspace;

  function handleDeleteWorkspace() {
    deleteWorkspace(undefined, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-slate-800">Delete Workspace?</DialogTitle>
        <DialogDescription className="text-slate-700">
          Are you sure you want to delete this workspace? This action will
          permanently remove:
        </DialogDescription>

        <div className="space-y-4">
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
            <li>All tasks and deadlines</li>
            <li>All materials and files</li>
            <li>All member data and permissions</li>
            <li>All workspace settings</li>
          </ul>

          <div className="font-medium text-red-600">
            This action cannot be undone.
          </div>

          <form className="space-y-3">
            <div className="space-y-2">
              <Label
                htmlFor="workspace-name-input"
                className="text-sm font-medium"
              >
                To confirm deletion, type the workspace name:
              </Label>
              <div className="font-mono bg-slate-100 px-2 py-1 rounded text-sm">
                {workspaceName}
              </div>
            </div>
            <Input
              {...register("confirmWorkspaceName")}
              id="workspace-name-input"
              placeholder="Enter workspace name"
              autoComplete="off"
              disabled={isDeletingWorkspace}
            />
          </form>

          <FormError error={deleteWorkspaceError} />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeletingWorkspace}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteWorkspace}
            disabled={!isDeleteEnabled || isDeletingWorkspace}
            className={cn(!isDeleteEnabled && "opacity-50 cursor-not-allowed")}
          >
            Delete Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDeleteWorkspaceDialog;
