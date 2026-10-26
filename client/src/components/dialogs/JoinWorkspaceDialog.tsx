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
import { useJoinWorkspace } from "@/hooks";
import { CodeSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type JoinWorkspaceForm = z.infer<typeof CodeSchema>;

interface JoinWorkspaceDialogProps {
  onClose: () => void;
}

function JoinWorkspaceDialog({ onClose }: JoinWorkspaceDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<JoinWorkspaceForm>({ resolver: zodResolver(CodeSchema) });
  const { mutate: joinWorkspace, isPending: isSubmitting } =
    useJoinWorkspace();

  function onSubmit({ code }: JoinWorkspaceForm) {
    joinWorkspace(code, {
      onSuccess: onClose,
      onError: (error: any) => {
        setError("code", {
          message: error.message || "Failed to join workspace",
        });
      },
    });
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Workspace</DialogTitle>
          <DialogDescription>
            Ask the workspace admin for the invite code.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="joinCode">
              Workspace Code <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("code")}
              id="joinCode"
              placeholder="Enter workspace code"
              disabled={isSubmitting}
              autoFocus
              autoComplete="off"
            />
            {errors.code && (
              <p className="text-red-500 text-xs">{errors.code.message}</p>
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
              {isSubmitting ? "Joining..." : "Join Workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default JoinWorkspaceDialog;
