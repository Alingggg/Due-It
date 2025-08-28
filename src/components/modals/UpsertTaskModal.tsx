"use client";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import {
  FaQuestionCircle,
  FaClipboardList,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";

interface UpsertTaskModalProps {
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
  { value: "quiz", label: "Quiz", icon: FaQuestionCircle },
  { value: "assignment", label: "Assignment", icon: FaClipboardList },
];

const doneByOptions = [
  { value: "individual", label: "Individual", icon: FaUser },
  { value: "pair", label: "Pair", icon: FaUsers },
  { value: "group", label: "Group", icon: FaUsers },
];

function UpsertTaskModal({
  initialData = {},
  subjects = [],
  onClose,
  onSubmit,
  isLoading = false,
}: UpsertTaskModalProps) {
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
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          {initialData.title ? "Edit Task" : "Add New Task"}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-2">
        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Task Title *
          </label>
          <Input type="text" placeholder="Enter task title..." />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add task description (optional)..."
            rows={4}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
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
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setType(opt.value as "quiz" | "assignment")}
                  className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg border-2 transition-all duration-200 ${
                    type === opt.value
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{opt.label}</span>
                </button>
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
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setDoneBy(opt.value as "individual" | "pair" | "group")
                  }
                  className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                    doneBy === opt.value
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  <span className="text-xs font-medium leading-tight text-center">
                    {opt.label}
                  </span>
                </button>
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
            <Input type="datetime-local" />
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Subject *
            </label>
            <Dropdown
              value={subjectId}
              onChange={setSubjectId}
              options={[
                { value: "", label: "Select a subject..." },
                ...subjects.map((sub) => ({
                  value: sub.id,
                  label: sub.name,
                })),
              ]}
              className="w-full"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading || !title.trim()}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white"
          >
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
    </div>
  );
}

export default UpsertTaskModal;
