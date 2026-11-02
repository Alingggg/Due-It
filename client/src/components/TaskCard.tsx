import type { SemesterTask } from "@/types";
import {
  differenceInCalendarDays,
  format,
  isBefore,
  isToday,
  isTomorrow,
  parseISO,
} from "date-fns";
import { HelpCircle, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router";

interface TaskCardProps {
  task: SemesterTask;
  workspaceId: string;
  subjectName: string;
}

function TaskCard({ task, workspaceId, subjectName }: TaskCardProps) {
  const navigate = useNavigate();

  function handleCardClick() {
    navigate(`/workspace/${workspaceId}/tasks/${task.id}`);
  }

  function getDueDateTime(dueDate: string, dueTime: string) {
    return parseISO(`${dueDate}T${dueTime}`);
  }

  function formatDueDate(dueDate: string, dueTime: string) {
    const date = getDueDateTime(dueDate, dueTime);
    const now = new Date();

    if (isBefore(date, now)) {
      return {
        text: "Overdue",
        color: "text-red-700 bg-red-50",
        showBadge: true,
      };
    } else if (isToday(date)) {
      return {
        text: "Due today",
        color: "text-white bg-red-600",
        showBadge: true,
      };
    } else if (isTomorrow(date)) {
      return {
        text: "Due tomorrow",
        color: "text-amber-800 bg-amber-50",
        showBadge: true,
      };
    } else {
      const diffDays = differenceInCalendarDays(date, now);
      if (diffDays <= 7) {
        return {
          text: `Due in ${diffDays} days`,
          color: "text-blue-900 bg-blue-100",
          showBadge: true,
        };
      } else {
        return {
          text: "",
          color: "",
          showBadge: false,
        };
      }
    }
  }

  function getTypeIcon(type: string) {
    return type === "exam" ? HelpCircle : ClipboardList;
  }

  const dueInfo = formatDueDate(task.dueDate, task.dueTime);
  const TypeIcon = getTypeIcon(task.taskType);
  const meta = [
    subjectName,
    task.taskType === "exam" ? "Exam" : "Activity",
    task.completionType[0].toUpperCase() + task.completionType.slice(1),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-line px-4 py-3.5 sm:px-[18px] hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
    >
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2">
        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
          <TypeIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-48">
          <h3 className="text-[15px] font-bold text-slate-800 leading-tight">
            {task.title}
          </h3>
          <p className="mt-1 text-[13px] text-slate-500">{meta}</p>
        </div>

        {!task.isCompleted && (
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-[13px] font-semibold text-slate-600 whitespace-nowrap">
              {format(getDueDateTime(task.dueDate, task.dueTime), "MMM d, h:mm a")}
            </span>
            {dueInfo.showBadge && (
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${dueInfo.color}`}
              >
                {dueInfo.text}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
