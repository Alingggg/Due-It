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

interface ScheduleItemProps {
  schedule: SemesterSchedule;
  subjectName: string;
  time: string;
  canManage: boolean;
  subjects: Subject[] | undefined;
}

// Helper to format "HH:mm" to "h:mm AM/PM"
function formatTime12h(time: string) {
  const parsed = parse(time, "HH:mm", new Date());
  return format(parsed, "h:mm a");
}

function ScheduleItem({
  schedule,
  subjectName,
  time,
  canManage,
  subjects,
}: ScheduleItemProps) {
  const { openDialog, closeDialog } = useDialogContext();

  function handleEdit() {
    openDialog("UPSERT_SCHEDULE", {
      subjects,
      initialData: {
        id: schedule.id,
        subjectId: schedule.subjectId,
        dayOfWeek: schedule.dayOfWeek,
        timeOfDay: schedule.timeOfDay,
      },
    });
  }

  function handleDelete() {
    openDialog("CONFIRM_ACTION", {
      title: "Delete Schedule?",
      description: `Are you sure you want to delete the schedule for "${subjectName}"?`,
      actionButtonVariant: "destructive",
      actionButtonText: "Delete",
      handleAction: closeDialog,
    });
  }

  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-slate-600 min-w-[60px]">
          {formatTime12h(time)}
        </span>
        <span className="text-slate-800">{subjectName}</span>
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
