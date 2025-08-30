import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteMaterialModalProps {
  onClose: () => void;
  title: string;
  materialCount: number;
}

function DeleteMaterialModal({
  onClose,
  title,
  materialCount,
}: DeleteMaterialModalProps) {
  return (
    <DialogContent>
      <DialogTitle className="text-slate-800">
        Delete Material Group?
      </DialogTitle>
      <p className="text-sm text-slate-600">
        Are you sure you want to delete "{title}"? This will also delete all{" "}
        {materialCount} materials in this group. This action cannot be undone.
      </p>

      <DialogFooter>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={onClose} variant="destructive">
          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          Delete Group
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default DeleteMaterialModal;
