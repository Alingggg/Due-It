"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpCircle, ClipboardList, User, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";

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
    <DialogContent className="max-h-[90vh] overflow-y-auto">
      <DialogTitle className="text-slate-800">
        {initialData.title ? "Edit Task" : "Add New Task"}
      </DialogTitle>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Task Title *
          </label>
          <Input
            type="text"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Description
          </label>
          <Textarea
            placeholder="Add task description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Type and Done By - Stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Task Type
            </label>
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
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Completion Type
            </label>
            <div className="grid grid-cols-3 gap-1">
              {doneByOptions.map((opt) => (
                <Button
                  key={opt.value}
                  onClick={() =>
                    setDoneBy(opt.value as "individual" | "pair" | "group")
                  }
                  variant="outline"
                  className={`flex flex-col gap-0.5 transition-all duration-200 h-12 ${
                    doneBy === opt.value ? "" : "border-gray-200 text-gray-600"
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

        {/* Due Date and Subject - Stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Due Date */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Due Date & Time
            </label>
            <Input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Subject *
            </label>
            <Select
              value={subjectId}
              onValueChange={setSubjectId}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
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
  );
}

export default UpsertTaskDialog;
