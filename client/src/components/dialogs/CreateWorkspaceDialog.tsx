import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormError,
  Input,
  Label,
} from "@/components";
import { useCreateWorkspace } from "@/hooks";
import type { CreateWorkspaceInput } from "@/types";
import { WorkspaceSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CreateWorkspaceDialogProps {
  onClose: () => void;
}

function CreateWorkspaceDialog({ onClose }: CreateWorkspaceDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(WorkspaceSchema),
  });
  const {
    mutate: createWorkspace,
    isPending: isSubmitting,
    error: createWorkspaceError,
  } = useCreateWorkspace();

  function onSubmit({ workspaceName }: CreateWorkspaceInput) {
    createWorkspace(workspaceName, { onSuccess: onClose });
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Choose a name for your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspaceName">
              Workspace Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("workspaceName")}
              id="workspaceName"
              placeholder="Enter workspace name"
              disabled={isSubmitting}
              autoFocus
              autoComplete="off"
            />
            {errors.workspaceName && (
              <p className="text-red-500 text-xs">
                {errors.workspaceName.message}
              </p>
            )}
          </div>

          <FormError error={createWorkspaceError} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkspaceDialog;
