import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Form,
  Input,
  Label,
  SelectField,
  Textarea,
} from "@/components";
import { useAddMaterialGroup, useUpdateMaterialGroup } from "@/hooks";
import type { SemesterMaterialGroup, Subject } from "@/types";
import { MaterialGroupSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type FormValues = z.infer<typeof MaterialGroupSchema>;

interface UpsertMaterialDialogProps {
  onClose: () => void;
  subjects: Subject[];
  materialGroup?: Partial<SemesterMaterialGroup>;
}

function UpsertMaterialDialog({
  onClose,
  subjects,
  materialGroup,
}: UpsertMaterialDialogProps) {
  const sortedSubjects = [...subjects].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const { mutate: addMaterialGroup, isPending: isAddingMaterialGroup } =
    useAddMaterialGroup();
  const { mutate: updateMaterialGroup, isPending: isUpdatingMaterialGroup } =
    useUpdateMaterialGroup();
  const form = useForm<FormValues>({
    defaultValues: {
      title: materialGroup?.title || "",
      description: materialGroup?.description || "",
      subjectId: materialGroup?.subjectId || "",
    },
    resolver: zodResolver(MaterialGroupSchema),
  });

  const isEditing = !!materialGroup;
  const isSubmitting = isAddingMaterialGroup || isUpdatingMaterialGroup;

  function onSubmit(data: FormValues) {
    if (isEditing && materialGroup?.id) {
      updateMaterialGroup(
        { id: materialGroup.id, ...data },
        { onSuccess: () => onClose() }
      );
    } else {
      addMaterialGroup(data, {
        onSuccess: () => onClose(),
      });
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">
          {isEditing ? "Edit Material Group" : "Create Material Group"}
        </DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                {...form.register("title")}
                id="title"
                placeholder="Enter material group title"
                disabled={isSubmitting}
                autoComplete="off"
              />
              {form.formState.errors.title && (
                <p className="text-xs text-red-600">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                {...form.register("description")}
                id="description"
                placeholder="Enter material group description"
                disabled={isSubmitting}
                className="break-all"
              />
            </div>

            <div className="space-y-2">
              <SelectField
                control={form.control}
                name="subjectId"
                label="Subject"
                options={sortedSubjects.map((subject) => ({
                  label: subject.name,
                  value: subject.id,
                }))}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
              <Button
                onClick={onClose}
                variant="outline"
                disabled={isSubmitting}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isEditing ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>{isEditing ? "Update" : "Create"}</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpsertMaterialDialog;
