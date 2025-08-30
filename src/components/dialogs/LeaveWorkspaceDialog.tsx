import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserMinus } from "lucide-react";

function LeaveWorkspaceDialog({ onClose }: { onClose: () => void }) {
  return (
    <DialogContent>
      <DialogTitle className="text-slate-800">Leave Workspace?</DialogTitle>
      <p className="text-xs sm:text-sm text-slate-600">
        Are you sure you want to leave this workspace? You will lose access to
        all its content. You can rejoin later using a valid invite code if
        joining is enabled.
      </p>

      <DialogFooter>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={onClose} variant="destructive">
          <UserMinus className="w-4 h-4" />
          Leave Workspace
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export default LeaveWorkspaceDialog;
