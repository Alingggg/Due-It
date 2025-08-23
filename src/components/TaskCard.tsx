"use client";
import { useRouter } from "next/navigation";
import { FaQuestionCircle, FaClipboardList } from "react-icons/fa";
import { Task, getSubjectById } from "@/data/mockData";

interface TaskCardProps {
  task: Task;
  hideSubject?: boolean;
}

function TaskCard({ task, hideSubject = false }: TaskCardProps) {
  const router = useRouter();
  const subject = getSubjectById(task.subjectId);

  const handleCardClick = () => {
    router.push(`/workspace/tasks/${task.id}`);
  };

  // Format due date
  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        text: "Overdue",
        color: "text-red-600 bg-red-50",
        showBadge: true,
      };
    } else if (diffDays === 0) {
      return {
        text: "Due today",
        color: "text-orange-600 bg-orange-50",
        showBadge: true,
      };
    } else if (diffDays === 1) {
      return {
        text: "Due tomorrow",
        color: "text-yellow-600 bg-yellow-50",
        showBadge: true,
      };
    } else if (diffDays <= 7) {
      return {
        text: `Due in ${diffDays} days`,
        color: "text-blue-600 bg-blue-50",
        showBadge: true,
      };
    } else {
      return {
        text: `Due ${date.toLocaleDateString()}`,
        color: "text-slate-600 bg-slate-50",
        showBadge: false,
      };
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    return type === "quiz" ? FaQuestionCircle : FaClipboardList;
  };

  const dueInfo = formatDueDate(task.dueDate);
  const TypeIcon = getTypeIcon(task.type);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center flex-1">
          <div className="p-3 bg-blue-50 rounded-lg mr-4">
            <TypeIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-1">
              {task.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              {!hideSubject && (
                <>
                  <span>{subject?.name || "Unknown Subject"}</span>
                  <span className="text-slate-400">•</span>
                </>
              )}
              <span className="capitalize">{task.type}</span>
              <span className="text-slate-400">•</span>
              <span className="capitalize">{task.doneBy}</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <div className="text-right min-w-[120px]">
            <div className="text-sm text-slate-600 mb-1">
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
            <div className="h-5 flex justify-end">
              {dueInfo.showBadge ? (
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${dueInfo.color}`}
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
    </div>
  );
}

export default TaskCard;
