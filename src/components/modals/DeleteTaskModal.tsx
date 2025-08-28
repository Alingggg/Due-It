import Button from "@/components/Button";
import { FaTrash } from "react-icons/fa";
import { FiX } from "react-icons/fi";

interface DeleteTaskModalProps {
  onClose: () => void;
  taskTitle: string;
}

function DeleteTaskModal({ onClose, taskTitle }: DeleteTaskModalProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-6 w-full max-w-xs sm:max-w-sm mx-auto relative">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Close"
      >
        <FiX className="w-6 h-6" />
      </button>
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Delete Task?
      </h3>
      <p className="text-sm text-slate-600 mb-6 break-words">
        Are you sure you want to delete "{taskTitle}"? This action cannot be
        undone.
      </p>

      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
        <Button
          onClick={onClose}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2"
        >
          <FaTrash className="w-4 h-4" />
          <span>Delete Task</span>
        </Button>
      </div>
    </div>
  );
}

export default DeleteTaskModal;
