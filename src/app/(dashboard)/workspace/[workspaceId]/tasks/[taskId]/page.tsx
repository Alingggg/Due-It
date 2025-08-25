"use client";
import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { mockTasks, getSubjectById, getCurrentUserRole } from "@/data/mockData";
import { Button } from "@/components";
import {
  FaClock,
  FaUser,
  FaUsers,
  FaQuestionCircle,
  FaClipboardList,
  FaArrowLeft,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

interface TaskDetailPageProps {
  params: Promise<{ workspaceId: string; taskId: string }>;
}

function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { workspaceId, taskId } = use(params);
  const router = useRouter();
  const task = mockTasks.find((t) => t.id === taskId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        return { icon: FaUser, text: "Individual" };
      case "pair":
        return { icon: FaUsers, text: "Pair" };
      case "group":
        return { icon: FaUsers, text: "Group" };
      default:
        return { icon: FaUser, text: "Individual" };
    }
  };

  const doneByInfo = getDoneByInfo(task.doneBy);
  const TypeIcon = task.type === "quiz" ? FaQuestionCircle : FaClipboardList;
  const DoneByIcon = doneByInfo.icon;

  // Format date without seconds
  const formatDateNoSeconds = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleEdit = () => {
    router.push(`/workspace/${workspaceId}/tasks/${taskId}/edit`);
  };

  const handleDelete = () => {
    // In a real app, this would delete from database and update state
    console.log("Deleting task:", taskId);
    setShowDeleteConfirm(false);
    router.push(`/workspace/${workspaceId}/tasks`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button Row */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors hover:cursor-pointer"
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Task Details</h1>
        {canManageTask && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="flex items-center space-x-2 text-sm"
            >
              <FaEdit className="w-3 h-3" />
              <span>Edit</span>
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 text-sm"
            >
              <FaTrash className="w-3 h-3" />
              <span>Delete</span>
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
                <FaClock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="break-all">
                  {formatDateNoSeconds(task.dueDate)}
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
              <Button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white hover:bg-blue-700">
                Mark as Done
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Delete Task?
            </h3>
            <p className="text-sm text-slate-600 mb-6 break-words">
              Are you sure you want to delete "{task.title}"? This action cannot
              be undone.
            </p>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2"
              >
                <FaTrash className="w-4 h-4" />
                <span>Delete Task</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskDetailPage;
