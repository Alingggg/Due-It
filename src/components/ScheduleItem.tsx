import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { format, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SemesterSchedule } from "@/types/Schedule";
import { Subject } from "@/types/Subject";
import useDialogContext from "@/hooks/Dialog";
import { useDeleteSchedule } from "@/hooks/Schedule";

interface ScheduleItemProps {
  schedule: SemesterSchedule;
  subjectName: string;
  canManage: boolean;
  subjects: Subject[];
}

// Helper to format "HH:mm:ss" to "h:mm AM/PM"
function formatTime12h(time: string) {
  const parsed = parse(time, "HH:mm:ss", new Date());
  return format(parsed, "h:mm a");
}

function ScheduleItem({
  schedule,
  subjectName,
  canManage,
  subjects,
}: ScheduleItemProps) {
  const { openDialog, closeDialog } = useDialogContext();
  const { mutate: deleteSchedule } = useDeleteSchedule();

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
      handleAction: () =>
        deleteSchedule(schedule.id, { onSuccess: closeDialog }),
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

      {/* Actions Menu - Only show if user can manage subjects */}
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
