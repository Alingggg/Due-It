import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormError,
  Input,
  Label,
} from "@/components";
import { useAddSubject, useUpdateSubject } from "@/hooks";
import type { Semester, Subject } from "@/types";
import { SubjectSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

type SubjectFormData = z.infer<typeof SubjectSchema>;

interface UpsertSubjectDialogProps {
  initialData?: Partial<Subject>;
  onClose: () => void;
  semester: Semester;
}

function UpsertSubjectDialog({
  initialData = {},
  onClose,
  semester,
}: UpsertSubjectDialogProps) {
  const {
    mutate: addSubject,
    isPending: isAdding,
    error: addSubjectError,
  } = useAddSubject();
  const {
    mutate: updateSubject,
    isPending: isUpdating,
    error: updateSubjectError,
  } = useUpdateSubject();
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
          semester: initialData.semester ?? semester,
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              autoComplete="off"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                autoComplete="off"
              />
              {errors.subjectCode && (
                <p className="text-red-500 text-xs">
                  {errors.subjectCode.message}
                </p>
              )}
            </div>

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
                autoComplete="off"
              />
              {errors.instructorName && (
                <p className="text-red-500 text-xs">
                  {errors.instructorName.message}
                </p>
              )}
            </div>
          </div>

          <FormError error={addSubjectError ?? updateSubjectError} />

          <div className="pt-2">
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
