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
import type { WorkspaceNameInput } from "@/types";
import { WorkspaceNameSchema } from "@/zod-schema";
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
  } = useForm<WorkspaceNameInput>({
    resolver: zodResolver(WorkspaceNameSchema),
  });
  const {
    mutate: createWorkspace,
    isPending: isSubmitting,
    error: createWorkspaceError,
  } = useCreateWorkspace();

  function onSubmit({ name }: WorkspaceNameInput) {
    createWorkspace(name, { onSuccess: onClose });
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
            <Label htmlFor="name">
              Workspace Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("name")}
              id="name"
              placeholder="Enter workspace name"
              disabled={isSubmitting}
              autoFocus
              autoComplete="off"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">
                {errors.name.message}
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
