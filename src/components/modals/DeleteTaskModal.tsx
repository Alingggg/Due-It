import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteTaskModalProps {
  onClose: () => void;
  taskTitle: string;
}

function DeleteTaskModal({ onClose, taskTitle }: DeleteTaskModalProps) {
  return (
    <DialogContent>
      <DialogTitle className="text-slate-800">Delete Task?</DialogTitle>
      <p className="text-sm text-slate-600 break-words">
        Are you sure you want to delete "{taskTitle}"? This action cannot be
        undone.
      </p>

      <DialogFooter>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={onClose} variant="destructive">
          <Trash2 className="w-4 h-4" />
          Delete Task
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default DeleteTaskModal;
