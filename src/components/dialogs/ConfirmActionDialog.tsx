import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface ConfirmActionDialogProps {
  onClose: () => void;
  isPending: boolean;
  title: string;
  description: string;
  actionButtonVariant?: "default" | "destructive";
  actionButtonText: string;
  handleAction: () => void;
}

function ConfirmActionDialog({
  onClose,
  isPending,
  title,
  description,
  actionButtonVariant = "default",
  actionButtonText,
  handleAction,
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog open onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogTitle className="text-slate-800">{title}</AlertDialogTitle>
        <AlertDialogDescription className="text-slate-600">
          {description}
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: actionButtonVariant }))}
            onClick={handleAction}
            disabled={isPending}
          >
            {actionButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmActionDialog;
