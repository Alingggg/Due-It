"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface UpsertSubjectDialogProps {
  initialData?: {
    name?: string;
    code?: string;
    instructor?: string;
  };
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

function UpsertSubjectDialog({
  initialData = {},
  onClose,
  onSubmit,
  isLoading = false,
}: UpsertSubjectDialogProps) {
  const [name, setName] = useState(initialData.name || "");
  const [code, setCode] = useState(initialData.code || "");
  const [instructor, setInstructor] = useState(initialData.instructor || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      name,
      code,
      instructor,
    });
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">
          {initialData.name ? "Edit Subject" : "Add New Subject"}
        </DialogTitle>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Name */}
          <div className="space-y-2">
            <Label htmlFor="subject-name">
              Subject Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject-name"
              type="text"
              placeholder="Enter subject name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Subject Code and Instructor - Side by side on larger screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject Code */}
            <div className="space-y-2">
              <Label htmlFor="subject-code">
                Subject Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject-code"
                type="text"
                placeholder="e.g., COMP 101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Instructor */}
            <div className="space-y-2">
              <Label htmlFor="instructor">
                Instructor <span className="text-red-500">*</span>
              </Label>
              <Input
                id="instructor"
                type="text"
                placeholder="Enter instructor name..."
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              disabled={
                isLoading || !name.trim() || !code.trim() || !instructor.trim()
              }
              type="submit"
              onClick={onClose}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : initialData.name ? (
                "Save Changes"
              ) : (
                "Create Subject"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpsertSubjectDialog;
