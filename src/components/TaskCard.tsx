"use client";
import { useRouter } from "next/navigation";
import { ClipboardList, HelpCircle } from "lucide-react";
import {
  format,
  isToday,
  isTomorrow,
  differenceInCalendarDays,
} from "date-fns";
import { SemesterTask } from "@/types/Task";

interface TaskCardProps {
  task: SemesterTask;
  workspaceId: string;
  subjectName: string;
}

function TaskCard({ task, workspaceId, subjectName }: TaskCardProps) {
  const router = useRouter();

  function handleCardClick() {
    router.push(`/workspace/${workspaceId}/tasks/${task.id}`);
  }

  // Format due date
  function formatDueDate(dueDate: string) {
    const date = new Date(dueDate);
    const now = new Date();

    if (date < now) {
      return {
        text: "Overdue",
        color: "text-red-600 bg-red-50",
        showBadge: true,
      };
    } else if (isToday(date)) {
      return {
        text: "Due today",
        color: "text-orange-600 bg-orange-50",
        showBadge: true,
      };
    } else if (isTomorrow(date)) {
      return {
        text: "Due tomorrow",
        color: "text-yellow-600 bg-yellow-50",
        showBadge: true,
      };
    } else {
      const diffDays = differenceInCalendarDays(date, now);
      if (diffDays <= 7) {
        return {
          text: `Due in ${diffDays} days`,
          color: "text-blue-600 bg-blue-50",
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

  const dueInfo = formatDueDate(task.dueDate);
  const TypeIcon = getTypeIcon(task.taskType);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        {/* Main Content */}
        <div className="flex items-start sm:items-center flex-1">
          <div className="p-2 sm:p-3 bg-blue-50 rounded-lg mr-2 sm:mr-4 shrink-0">
            <TypeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-0.5 sm:mb-1 leading-tight">
              {task.title}
            </h3>

            <div className="text-xs sm:text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center space-y-0.5 sm:space-y-0 sm:space-x-4">
              {subjectName && (
                <>
                  <span className="truncate">{subjectName}</span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                </>
              )}
              <div className="flex items-center space-x-2">
                <span className="capitalize">
                  {task.taskType === "exam" ? "Exam" : task.taskType}
                </span>
                <span className="text-slate-400">•</span>
                <span className="capitalize">{task.completionType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Due Date Section */}
        <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end space-x-2 sm:space-x-0 sm:min-w-[120px]">
          <div className="text-xs sm:text-sm text-slate-600 sm:mb-1 sm:text-right">
            {format(new Date(task.dueDate), "MM/dd/yyyy")}
          </div>
          <div className="flex justify-end">
            {dueInfo.showBadge ? (
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${dueInfo.color}`}
              >
                {dueInfo.text}
              </span>
            ) : (
              <div className="h-5"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
