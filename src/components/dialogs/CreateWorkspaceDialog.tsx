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

interface CreateWorkspaceDialogProps {
  onClose: () => void;
}

function CreateWorkspaceDialog({ onClose }: CreateWorkspaceDialogProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!workspaceName.trim()) {
      setError("Workspace name is required");
      return;
    }

    if (workspaceName.trim().length < 3) {
      setError("Workspace name must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("Creating workspace:", workspaceName);
      onClose();
    } catch (err) {
      setError("Failed to create workspace. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Choose a name for your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workspace-name">
              Workspace Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="workspace-name"
              value={workspaceName}
              onChange={(e) => {
                setWorkspaceName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter workspace name"
              disabled={isSubmitting}
              autoFocus
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
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
