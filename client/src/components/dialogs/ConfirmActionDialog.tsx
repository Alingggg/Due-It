import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  FormError,
  buttonVariants,
} from "@/components";
import { cn } from "@/lib";
import { useState, type MouseEvent } from "react";

interface ConfirmActionDialogProps {
  onClose: () => void;
  title: string;
  description: string;
  actionButtonVariant?: "default" | "destructive";
  actionButtonText: string;
  handleAction: () => Promise<unknown>;
}

function ConfirmActionDialog({
  onClose,
  title,
  description,
  actionButtonVariant = "default",
  actionButtonText,
  handleAction,
}: ConfirmActionDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function handleConfirm(e: MouseEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    try {
      await handleAction();
      onClose();
    } catch (err) {
      setError(err as Error);
      setIsPending(false);
    }
  }

  return (
    <AlertDialog open onOpenChange={() => !isPending && onClose()}>
      <AlertDialogContent>
        <AlertDialogTitle className="text-slate-800">{title}</AlertDialogTitle>
        <AlertDialogDescription className="text-slate-600">
          {description}
        </AlertDialogDescription>

        <FormError error={error} />

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: actionButtonVariant }))}
            onClick={handleConfirm}
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
