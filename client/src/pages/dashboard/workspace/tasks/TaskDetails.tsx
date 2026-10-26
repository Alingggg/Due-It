import { Button, LoadingPage } from "@/components";
import {
  useDeleteTask,
  useDialogContext,
  useGetSubjects,
  useGetTask,
  useGetUserWorkspace,
  useGetUserWorkspaceRole,
  useUpdateCompletionStatus,
} from "@/hooks";
import {
  User,
  Users,
  HelpCircle,
  ClipboardList,
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
} from "lucide-react";
import { format, parse } from "date-fns";
import { useNavigate, useParams } from "react-router";

function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { openDialog, closeDialog } = useDialogContext();
  const { data: workspace } = useGetUserWorkspace();
  const { data: task, isLoading: isLoadingTask } = useGetTask(taskId as string);
  const { data: subjects, isLoading: isLoadingSubjects } = useGetSubjects();
  const currentUserRole = useGetUserWorkspaceRole();
  const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();
  const {
    mutate: updateCompletionStatus,
    isPending: isUpdatingCompletionStatus,
  } = useUpdateCompletionStatus();
  const canManageTask =
    currentUserRole === "admin" || currentUserRole === "co-admin";
  const isPageLoading =
    isLoadingTask ||
    isLoadingSubjects;

  function handleMarkAsDone() {
    if (task?.isCompleted) {
      updateCompletionStatus(
        {
          taskId: task?.id as string,
          markAsDone: false,
        },
        { onSuccess: closeDialog }
      );
    } else {
      updateCompletionStatus(
        {
          taskId: task?.id as string,
          markAsDone: true,
        },
        { onSuccess: closeDialog }
      );
    }
  }

  function handleDeleteTask() {
    openDialog("CONFIRM_ACTION", {
      isPending: isDeletingTask,
      title: `Delete "${task?.title}"?`,
      description: `Are you sure you want to delete "${task?.title}"? This action cannot be undone.`,
      actionButtonVariant: "destructive",
      actionButtonText: "Delete",
      handleAction: () => {
        if (task?.id) {
          deleteTask(task.id, {
            onSuccess: () => {
              closeDialog();
              navigate(`/workspace/${workspace?.id}/tasks`);
            },
          });
        }
      },
    });
  }

  function getCompletionTypeInfo(completionType: string) {
    switch (completionType) {
      case "individual":
        return { icon: User, text: "Individual" };
      case "pair":
        return { icon: Users, text: "Pair" };
      case "group":
        return { icon: Users, text: "Group" };
      default:
        return { icon: User, text: "Individual" };
    }
  }

  const completionTypeInfo = getCompletionTypeInfo(task?.completionType!);
  const TaskTypeIcon = task?.taskType === "exam" ? HelpCircle : ClipboardList;
  const CompletionTypeIcon = completionTypeInfo.icon;

  const formattedDueDateTime =
    task?.dueDate && task?.dueTime
      ? format(
          parse(
            `${task.dueDate} ${task.dueTime}`,
            "yyyy-MM-dd HH:mm:ss",
            new Date()
          ),
          "MMM d, yyyy hh:mm a"
        )
      : "";

  if (isPageLoading) {
    return <LoadingPage message="Loading task details..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="text-blue-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Task Details</h1>
        {canManageTask && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() =>
                openDialog("UPSERT_TASK", { initialData: task, subjects })
              }
              variant="outline"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
              Edit
            </Button>
            <Button onClick={handleDeleteTask} variant="destructive">
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-xl self-start">
            <TaskTypeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 break-words">
              {task?.title}
            </h2>
            <div className="text-sm text-blue-600 mb-4">
              {task?.subjectName}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-slate-600 mb-4">
              <div className="flex items-center">
                <TaskTypeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="capitalize">
                  {task?.taskType === "exam" ? "Exam" : task?.taskType}
                </span>
              </div>
              <div className="flex items-center">
                <CompletionTypeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{completionTypeInfo.text}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="break-all">{formattedDueDateTime}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed break-words">
                {task?.description || "No description provided."}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Button
                onClick={handleMarkAsDone}
                disabled={isUpdatingCompletionStatus}
              >
                {task?.isCompleted ? "Unmark as done" : "Mark as Done"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
