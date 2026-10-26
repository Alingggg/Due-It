import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Form,
  Input,
  Label,
  SelectField,
} from "@/components";
import { useAddSchedule, useUpdateSchedule } from "@/hooks";
import type { SemesterSchedule, Subject } from "@/types";
import { ScheduleSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type ScheduleFormData = z.infer<typeof ScheduleSchema>;

interface UpsertScheduleDialogProps {
  initialData?: Partial<SemesterSchedule>;
  subjects: Subject[];
  onClose: () => void;
}

const DAYS_OF_WEEK = [
  { value: "sunday", label: "Sunday" },
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
];

function UpsertScheduleDialog({
  initialData = {},
  subjects,
  onClose,
}: UpsertScheduleDialogProps) {
  const sortedSubjects = [...subjects].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const form = useForm<ScheduleFormData>({
    defaultValues: {
      subjectId: initialData.subjectId || "",
      dayOfWeek: initialData.dayOfWeek || undefined,
      startTime: initialData.startTime || "00:00",
      endTime: initialData.endTime || "00:00",
    },
    resolver: zodResolver(ScheduleSchema),
  });
  const { mutate: addSchedule, isPending: isAdding } = useAddSchedule();
  const { mutate: updateSchedule, isPending: isUpdating } = useUpdateSchedule();

  function onSubmit(data: ScheduleFormData) {
    if (initialData.id) {
      updateSchedule({ id: initialData.id, ...data }, { onSuccess: onClose });
    } else {
      addSchedule(data, { onSuccess: onClose });
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">
          {initialData.id ? "Edit Schedule" : "Add New Schedule"}
        </DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

            <SelectField
              control={form.control}
              name="dayOfWeek"
              label="Day of Week"
              options={DAYS_OF_WEEK}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="space-y-2 w-full">
                <Label htmlFor="startTime">
                  Start Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...form.register("startTime")}
                  id="startTime"
                  type="time"
                  disabled={isAdding || isUpdating}
                  className="w-full leading-none bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                {form.formState.errors.startTime && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.startTime.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="endTime">
                  End Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...form.register("endTime")}
                  id="endTime"
                  type="time"
                  disabled={isAdding || isUpdating}
                  className="w-full leading-none bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                {form.formState.errors.endTime && (
                  <p className="text-red-500 text-sm">
                    {form.formState.errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                disabled={isAdding || isUpdating}
                type="submit"
                className="w-full"
              >
                {isAdding || isUpdating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : initialData.id ? (
                  "Save Changes"
                ) : (
                  "Create Schedule"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpsertScheduleDialog;
