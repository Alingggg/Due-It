import { mockTasks, getSubjectById } from "@/data/mockData";
import {
  FaClock,
  FaUser,
  FaUsers,
  FaQuestionCircle,
  FaClipboardList,
  FaArrowLeft,
} from "react-icons/fa";
import Link from "next/link";
import { notFound } from "next/navigation";

interface TaskDetailPageProps {
  params: { id: string };
}

function TaskDetailPage({ params }: TaskDetailPageProps) {
  const task = mockTasks.find((t) => t.id === params.id);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/workspace/tasks"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
      >
        <FaArrowLeft className="w-4 h-4 mr-2" />
        Back to Tasks
      </Link>

      {/* Single Container for Everything */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        {/* Task Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start">
            <div className="p-3 bg-blue-50 rounded-lg mr-4">
              <TypeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">
                {task.title}
              </h1>
              <p className="text-slate-600">{subject?.name}</p>
            </div>
          </div>
        </div>

        {/* Task Meta */}
        <div className="flex items-center space-x-6 text-sm text-slate-600 mb-6">
          <div className="flex items-center">
            <TypeIcon className="w-4 h-4 mr-2" />
            <span className="capitalize">{task.type}</span>
          </div>
          <div className="flex items-center">
            <DoneByIcon className="w-4 h-4 mr-2" />
            <span>{doneByInfo.text}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="w-4 h-4 mr-2" />
            <span>{formatDateNoSeconds(task.dueDate)}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Description
          </h2>
          <p className="text-slate-700 leading-relaxed">{task.description}</p>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Mark as Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailPage;
