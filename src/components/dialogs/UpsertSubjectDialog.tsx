"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SubjectSchema } from "@/zod-schema/Subject";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Subject } from "@/types/Subject";
import { useAddSubject, useUpdateSubject } from "@/hooks/Subject";

type SubjectFormData = z.infer<typeof SubjectSchema>;

interface UpsertSubjectDialogProps {
  initialData?: Partial<Subject>;
  onClose: () => void;
  semester: 1 | 2;
  workspaceId: string;
}

function UpsertSubjectDialog({
  initialData = {},
  onClose,
  semester,
  workspaceId,
}: UpsertSubjectDialogProps) {
  const { mutate: addSubject, isPending: isAdding } = useAddSubject();
  const { mutate: updateSubject, isPending: isUpdating } = useUpdateSubject();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubjectFormData>({
    defaultValues: {
      name: initialData.name || "",
      subjectCode: initialData.subjectCode || "",
      instructorName: initialData.instructorName || "",
    },
    resolver: zodResolver(SubjectSchema),
  });

  function onSubmit(data: SubjectFormData) {
    if (initialData.id) {
      updateSubject(
        {
          id: initialData.id,
          workspaceId,
          semester,
          name: data.name,
          subjectCode: data.subjectCode,
          instructorName: data.instructorName,
        },
        { onSuccess: onClose }
      );
    } else {
      addSubject(
        {
          name: data.name,
          workspaceId,
          semester,
          subjectCode: data.subjectCode,
          instructorName: data.instructorName,
        },
        { onSuccess: onClose }
      );
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">
          {initialData.name ? "Edit Subject" : "Add New Subject"}
        </DialogTitle>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Subject Name */}
          <div className="space-y-2">
            <Label htmlFor="subject-name">
              Subject Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("name")}
              id="subject-name"
              type="text"
              placeholder="Enter subject name..."
              disabled={isAdding || isUpdating}
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* Subject Code and Instructor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Subject Code */}
            <div className="space-y-2">
              <Label htmlFor="subject-code">
                Subject Code <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("subjectCode")}
                id="subject-code"
                type="text"
                placeholder="e.g., COMP 101"
                disabled={isAdding || isUpdating}
              />
              {errors.subjectCode && (
                <p className="text-red-500 text-xs">
                  {errors.subjectCode.message}
                </p>
              )}
            </div>

            {/* Instructor */}
            <div className="space-y-2">
              <Label htmlFor="instructor">
                Instructor <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register("instructorName")}
                id="instructor"
                type="text"
                placeholder="Enter instructor name..."
                disabled={isAdding || isUpdating}
              />
              {errors.instructorName && (
                <p className="text-red-500 text-xs">
                  {errors.instructorName.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <Button disabled={isAdding || isUpdating} type="submit">
              {isAdding || isUpdating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : initialData.id ? (
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
