"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { workspaceSchema } from "@/zod-schema/Workspace";
import { useForm } from "react-hook-form";
import { useCreateWorkspace } from "@/hooks/Workspace";

type CreateWorkspaceForm = z.infer<typeof workspaceSchema>;

interface CreateWorkspaceDialogProps {
  onClose: () => void;
}

function CreateWorkspaceDialog({ onClose }: CreateWorkspaceDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
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
