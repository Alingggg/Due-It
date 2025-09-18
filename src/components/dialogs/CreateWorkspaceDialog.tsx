import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/components";
import { useCreateWorkspace } from "@/hooks";
import { WorkspaceSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type CreateWorkspaceForm = z.infer<typeof WorkspaceSchema>;

interface CreateWorkspaceDialogProps {
  onClose: () => void;
}

function CreateWorkspaceDialog({ onClose }: CreateWorkspaceDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(WorkspaceSchema),
  });
  const { mutate: createWorkspace, isPending: isSubmitting } =
    useCreateWorkspace();

  function onSubmit({ workspaceName }: CreateWorkspaceForm) {
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
