"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  HelpCircle,
  ClipboardList,
  User,
  Users,
  ChevronDownIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface UpsertTaskDialogProps {
  initialData?: {
    title?: string;
    description?: string;
    type?: "quiz" | "assignment";
    doneBy?: "individual" | "pair" | "group";
    dueDate?: string;
    subjectId?: string;
  };
  subjects?: { id: string; name: string }[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const typeOptions = [
  { value: "quiz", label: "Quiz", icon: HelpCircle },
  { value: "assignment", label: "Assignment", icon: ClipboardList },
];

const doneByOptions = [
  { value: "individual", label: "Individual", icon: User },
  { value: "pair", label: "Pair", icon: Users },
  { value: "group", label: "Group", icon: Users },
];

function UpsertTaskDialog({
  initialData = {},
  subjects = [],
  onClose,
  onSubmit,
  isLoading = false,
}: UpsertTaskDialogProps) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [type, setType] = useState<"quiz" | "assignment">(
    initialData.type || "assignment"
  );
  const [doneBy, setDoneBy] = useState<"individual" | "pair" | "group">(
    initialData.doneBy || "individual"
  );
  const [dueDate, setDueDate] = useState(initialData.dueDate || "");
  const [subjectId, setSubjectId] = useState(
    initialData.subjectId || (subjects[0]?.id ?? "")
  );
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      title,
      description,
      type,
      doneBy,
      dueDate,
      subjectId,
    });
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">
          {initialData.title ? "Edit Task" : "Add New Task"}
        </DialogTitle>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title">
              Task Title{" "}
              <span className="text-red-500" title="Required">
                *
              </span>
            </Label>
            <Input
              id="task-title"
              type="text"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              placeholder="Add task description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Type and Done By - Stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div className="space-y-2">
              <Label>Task Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    onClick={() => setType(opt.value as "quiz" | "assignment")}
                    variant="outline"
                    className={`transition-all duration-200 ${
                      type === opt.value ? "" : "border-gray-200 text-gray-600"
                    }`}
                    disabled={isLoading}
                  >
                    <opt.icon className="w-4 h-4" />
                    <span className="text-xs">{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Done By */}
            <div className="space-y-2">
              <Label>Completion Type</Label>
              <div className="grid grid-cols-3 gap-1">
                {doneByOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    onClick={() =>
                      setDoneBy(opt.value as "individual" | "pair" | "group")
                    }
                    variant="outline"
                    className={`flex flex-col gap-0.5 transition-all duration-200 h-12 ${
                      doneBy === opt.value
                        ? ""
                        : "border-gray-200 text-gray-600"
                    }`}
                    disabled={isLoading}
                  >
                    <opt.icon className="w-4 h-4" />
                    <span className="text-xs">{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="date-picker">
              Due Date{" "}
              <span className="text-red-500" title="Required">
                *
              </span>
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="w-full justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date);
                        setOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex-1">
                <Input
                  type="time"
                  id="time-picker"
                  step="1"
                  defaultValue="10:30:00"
                  className="w-full leading-none bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject-select">
              Subject{" "}
              <span className="text-red-500" title="Required">
                *
              </span>
            </Label>
            <Select
              value={subjectId}
              onValueChange={setSubjectId}
              disabled={isLoading}
            >
              <SelectTrigger id="subject-select" className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <Button disabled={isLoading || !title.trim()} type="submit">
              {isLoading ? (
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
      </DialogContent>
    </Dialog>
  );
}

export default UpsertTaskDialog;
