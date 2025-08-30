import { Button } from "@/components/ui/button";
import { Trash2, X as LucideX } from "lucide-react";

interface DeleteTaskModalProps {
  onClose: () => void;
  taskTitle: string;
}

function DeleteTaskModal({ onClose, taskTitle }: DeleteTaskModalProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-6 w-full max-w-xs sm:max-w-sm mx-auto relative">
      <Button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Close"
        variant="ghost"
        size="icon"
      >
        <LucideX className="w-6 h-6" />
      </Button>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Delete Task?
      </h3>
      <p className="text-sm text-slate-600 mb-6 break-words">
        Are you sure you want to delete "{taskTitle}"? This action cannot be
        undone.
      </p>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <Button onClick={onClose} variant="destructive">
          <Trash2 className="w-4 h-4" />
          Delete Task
        </Button>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
