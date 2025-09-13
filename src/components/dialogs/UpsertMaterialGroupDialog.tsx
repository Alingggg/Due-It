"use client";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { SemesterMaterialGroup } from "@/types/Material";
import { Subject } from "@/types/Subject";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { SelectField } from "@/components/SelectField";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddMaterialGroup } from "@/hooks/Material";
import { MaterialGroupSchema } from "@/zod-schema/Material";

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
  const { mutate: addMaterialGroup, isPending: isAddingMaterialGroup } =
    useAddMaterialGroup();
  const form = useForm<FormValues>({
    defaultValues: {
      title: materialGroup?.title || "",
      description: materialGroup?.description || "",
      subjectId: materialGroup?.subjectId || "",
    },
    resolver: zodResolver(MaterialGroupSchema),
  });

  const isEditing = !!materialGroup;
  const isSubmitting = isAddingMaterialGroup;

  function onSubmit(data: FormValues) {
    addMaterialGroup(data, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">
          {isEditing ? "Edit Material Group" : "Create Material Group"}
        </DialogTitle>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                {...form.register("title")}
                id="title"
                placeholder="Enter material group title"
                disabled={isSubmitting}
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
              />
            </div>

            <div className="space-y-2">
              <SelectField
                control={form.control}
                name="subjectId"
                label="Subject"
                options={subjects.map((subject) => ({
                  label: subject.name,
                  value: subject.id,
                }))}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-200">
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
