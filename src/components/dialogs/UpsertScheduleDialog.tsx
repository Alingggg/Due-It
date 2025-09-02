"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Subject {
  id: string;
  name: string;
  code: string;
}

interface UpsertScheduleDialogProps {
  initialData?: {
    subjectId?: string;
    dayOfWeek?: number;
    timeOfDay?: string;
  };
  subjects: Subject[];
  onClose: () => void;
  isLoading?: boolean;
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

function UpsertScheduleDialog({
  initialData = {},
  subjects,
  onClose,
  isLoading = false,
}: UpsertScheduleDialogProps) {
  const [subjectId, setSubjectId] = useState(initialData.subjectId || "");
  const [dayOfWeek, setDayOfWeek] = useState(
    initialData.dayOfWeek?.toString() || ""
  );
  const [timeOfDay, setTimeOfDay] = useState(initialData.timeOfDay || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">
          {initialData.subjectId ? "Edit Schedule" : "Add New Schedule"}
        </DialogTitle>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Subject *
            </label>
            <div>
              <Select
                value={subjectId}
                onValueChange={setSubjectId}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a subject..." />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Day of Week and Time - Side by side, both full width */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Day of Week */}
            <div className="space-y-2 w-full">
              <label className="block text-sm font-semibold text-gray-700">
                Day of Week *
              </label>
              <Select
                value={dayOfWeek}
                onValueChange={setDayOfWeek}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a day..." />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time of Day */}
            <div className="space-y-2 w-full">
              <label className="block text-sm font-semibold text-gray-700">
                Time of Day *
              </label>
              <Input
                type="time"
                disabled={isLoading}
                defaultValue="00:00:00"
                className="w-full leading-none bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              disabled={
                isLoading ||
                !subjectId.trim() ||
                !dayOfWeek ||
                !timeOfDay.trim()
              }
              type="submit"
              onClick={onClose}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : initialData.subjectId ? (
                "Save Changes"
              ) : (
                "Create Schedule"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpsertScheduleDialog;
