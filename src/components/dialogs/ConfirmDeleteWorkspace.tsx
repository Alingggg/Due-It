"use client";
import { useState } from "react";
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
import { cn } from "@/lib/utils";

interface ConfirmDeleteWorkspaceProps {
  onClose: () => void;
  workspaceName: string;
}

function ConfirmDeleteWorkspace({
  onClose,
  workspaceName,
}: ConfirmDeleteWorkspaceProps) {
  const [inputValue, setInputValue] = useState("");

  const isDeleteEnabled = inputValue === workspaceName;

  function handleDeleteWorkspace() {
    if (isDeleteEnabled) {
      console.log("Deleting workspace...");
      onClose();
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-slate-800">
            Delete Workspace?
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Are you sure you want to delete this workspace? This action will
            permanently remove:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-slate-600">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>All tasks and deadlines</li>
            <li>All materials and files</li>
            <li>All member data and permissions</li>
            <li>All workspace settings</li>
          </ul>

          <div className="font-medium text-red-600">
            This action cannot be undone.
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label
                htmlFor="workspace-name-input"
                className="text-sm font-medium text-slate-700"
              >
                To confirm deletion, type the workspace name:
              </Label>
              <div className="font-mono bg-slate-100 px-2 py-1 rounded text-sm">
                {workspaceName}
              </div>
            </div>
            <Input
              id="workspace-name-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter workspace name"
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteWorkspace}
            disabled={!isDeleteEnabled}
            className={cn(!isDeleteEnabled && "opacity-50 cursor-not-allowed")}
          >
            Delete Workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDeleteWorkspace;
