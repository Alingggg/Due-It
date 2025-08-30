"use client";
import { use } from "react";
import { notFound, useRouter } from "next/navigation";
import { mockTasks, getSubjectById, getCurrentUserRole } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  Clock,
  User,
  Users,
  ClipboardList,
  ArrowLeft,
  Edit,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { format } from "date-fns";
import useDialogContext from "@/hooks/Dialog";

interface TaskDetailPageProps {
  params: Promise<{ workspaceId: string; taskId: string }>;
}

function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { workspaceId, taskId } = use(params);
  const router = useRouter();
  const task = mockTasks.find((t) => t.id === taskId);
  const { openDialog } = useDialogContext();

  // Get current user's role in this workspace
  const currentUserRole = getCurrentUserRole(workspaceId);
  const canManageTask = currentUserRole === "admin" || currentUserRole === "co";

  if (!task) {
    notFound();
  }

  const subject = getSubjectById(task.subjectId);

  // Get done by info
  const getDoneByInfo = (doneBy: string) => {
    switch (doneBy) {
      case "individual":
        return { icon: User, text: "Individual" };
      case "pair":
        return { icon: Users, text: "Pair" };
      case "group":
        return { icon: Users, text: "Group" };
      default:
        return { icon: User, text: "Individual" };
    }
  };

  const doneByInfo = getDoneByInfo(task.doneBy);
  const TypeIcon = task.type === "quiz" ? HelpCircle : ClipboardList;
  const DoneByIcon = doneByInfo.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button Row */}
      <div>
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Task Details</h1>
        {canManageTask && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => openDialog("UPSERT_TASK", task)}
              variant="outline"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              Edit
            </Button>
            <Button
              onClick={() =>
                openDialog("DELETE_TASK", { taskTitle: task.title })
              }
              variant="destructive"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Single Container for Everything */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
        {/* Task Header - Mobile responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
          {/* Icon - smaller on mobile */}
          <div className="p-3 sm:p-4 bg-blue-50 rounded-xl self-start">
            <TypeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 break-words">
              {task.title}
            </h2>
            <div className="text-sm text-blue-600 mb-4">{subject?.name}</div>

            {/* Task Meta - Stack on mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-slate-600 mb-4">
              <div className="flex items-center">
                <TypeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="capitalize">{task.type}</span>
              </div>
              <div className="flex items-center">
                <DoneByIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{doneByInfo.text}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="break-all">
                  {format(new Date(task.dueDate), "MMM d, yyyy, hh:mm a")}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed break-words">
                {task.description}
              </p>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-100">
              <Button>Mark as Done</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailPage;
