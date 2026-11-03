import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components";
import { useDeleteSchedule, useDialogContext } from "@/hooks";
import type { SemesterSchedule, Subject } from "@/types";
import { formatTime12h } from "@/utils";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";

interface ScheduleItemProps {
  schedule: SemesterSchedule;
  subjectName: string;
  canManage: boolean;
  subjects: Subject[];
}

function ScheduleItem({
  schedule,
  subjectName,
  canManage,
  subjects,
}: ScheduleItemProps) {
  const { openDialog } = useDialogContext();
  const { mutateAsync: deleteSchedule } = useDeleteSchedule();

  function handleEdit() {
    openDialog("UPSERT_SCHEDULE", {
      subjects,
      initialData: {
        id: schedule.id,
        subjectId: schedule.subjectId,
        dayOfWeek: schedule.dayOfWeek,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      },
    });
  }

  function handleDelete() {
    openDialog("CONFIRM_ACTION", {
      title: "Delete Schedule?",
      description: `Are you sure you want to delete the schedule for "${subjectName}"?`,
      actionButtonVariant: "destructive",
      actionButtonText: "Delete",
      handleAction: () => deleteSchedule(schedule.id),
    });
  }

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs sm:text-sm text-slate-600 min-w-[110px] tracking-tighter">
          {formatTime12h(schedule.startTime)} -{" "}
          {formatTime12h(schedule.endTime)}
        </span>
        {/* Separator - only show on desktop */}
        <div className="hidden sm:block w-1 h-1 bg-slate-400 rounded-full"></div>
        <span className="text-slate-800 text-xs sm:text-base">
          {subjectName}
        </span>
      </div>

      {/* Actions Menu - Only for Admins */}
      {canManage && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Schedule
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={handleDelete}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                <span className="hover:text-red-600">Delete Schedule</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default ScheduleItem;
