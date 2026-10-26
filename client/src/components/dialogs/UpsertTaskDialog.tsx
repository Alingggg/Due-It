import {
  Button,
  CalendarField,
  Dialog,
  DialogContent,
  DialogTitle,
  Form,
  Input,
  Label,
  SelectField,
  Textarea,
  ToggleGroupField,
} from "@/components";
import { useAddTask, useUpdateTask } from "@/hooks";
import type { SemesterTask, Subject } from "@/types";
import { TaskSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardList, HelpCircle, User, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UpsertTaskDialogProps {
  initialData?: Partial<SemesterTask>;
  subjects: Subject[];
  onClose: () => void;
}

type TaskFormValues = z.infer<typeof TaskSchema>;

const taskTypeOptions = [
  { value: "exam", label: "Exam", icon: HelpCircle },
  { value: "activity", label: "Activity", icon: ClipboardList },
];

const completionTypeOptions = [
  { value: "individual", label: "Individual", icon: User },
  { value: "pair", label: "Pair", icon: Users },
  { value: "group", label: "Group", icon: Users },
];

function UpsertTaskDialog({
  initialData = {},
  subjects,
  onClose,
}: UpsertTaskDialogProps) {
  const sortedSubjects = [...subjects].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const form = useForm<TaskFormValues>({
    defaultValues: {
      title: initialData.title || "",
      description: initialData.description || "",
      subjectId: initialData.subjectId || "",
      taskType: initialData.taskType || "activity",
      completionType: initialData.completionType || "individual",
      dueDate: initialData.dueDate ? initialData.dueDate : "",
      dueTime: initialData.dueTime ? initialData.dueTime : "00:00",
    },
    resolver: zodResolver(TaskSchema),
  });
  const { mutate: addTask, isPending: isAddingTask } = useAddTask();
  const { mutate: updateTask, isPending: isUpdatingTask } = useUpdateTask();
  const isPending = isAddingTask || isUpdatingTask;

  function onSubmit(data: TaskFormValues) {
    if (initialData.id) {
      updateTask({ id: initialData.id, ...data }, { onSuccess: onClose });
    } else {
      addTask(data, { onSuccess: onClose });
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">
          {initialData.title ? "Edit Task" : "Add New Task"}
        </DialogTitle>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">
                Task Title{" "}
                <span className="text-red-500" title="Required">
                  *
                </span>
              </Label>
              <Input
                {...form.register("title")}
                id="task-title"
                type="text"
                placeholder="Enter task title..."
                disabled={isPending}
                autoComplete="off"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-xs">
                  {form.formState.errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea
                {...form.register("description")}
                id="task-description"
                placeholder="Add task description (optional)..."
                disabled={isPending}
                className="break-all"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 w-full">
                <ToggleGroupField
                  control={form.control}
                  variant="outline"
                  name="taskType"
                  label="Task Type"
                  options={taskTypeOptions}
                  required
                  disabled={isPending}
                  className="w-full"
                />
              </div>

              <div className="flex-1 w-full">
                <ToggleGroupField
                  control={form.control}
                  variant="outline"
                  name="completionType"
                  label="Completion Type"
                  options={completionTypeOptions}
                  required
                  disabled={isPending}
                  className="w-full"
                  toggleItemClassName="px-4"
                />
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="flex-1">
                <CalendarField
                  control={form.control}
                  name="dueDate"
                  label="Due Date"
                  placeholder="Select date"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  <Label htmlFor="time-picker">
                    Time{" "}
                    <span className="text-red-500" title="Required">
                      *
                    </span>
                  </Label>
                  <Input
                    {...form.register("dueTime")}
                    type="time"
                    id="time-picker"
                    className="w-full leading-none bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    disabled={isPending}
                  />
                  {form.formState.errors.dueTime && (
                    <p className="text-red-500 text-xs">
                      {form.formState.errors.dueTime.message}
                    </p>
                  )}
                </div>
              </div>
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
                disabled={isPending}
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button disabled={isPending} type="submit">
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : initialData.title ? (
                  "Save Changes"
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UpsertTaskDialog;
