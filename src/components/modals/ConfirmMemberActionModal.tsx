import { Button } from "@/components/ui/button";
import { FaCrown, FaUserTie, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { FiX } from "react-icons/fi";

interface ConfirmMemberActionModalProps {
  onClose: () => void;
  action: "promote" | "demote" | "kick";
  to?: "admin" | "co" | "member";
  memberId: string;
  memberName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

function ConfirmMemberActionModal({
  onClose,
  action,
  to,
  memberName,
  onConfirm,
  isLoading = false,
}: ConfirmMemberActionModalProps) {
  const getActionDetails = () => {
    switch (action) {
      case "promote":
        if (to === "admin") {
          return {
            title: "Promote to Admin",
            description: `Are you sure you want to promote ${memberName} to Admin? They will have full access to manage this workspace.`,
            icon: FaCrown,
            iconColor: "text-red-600",
            buttonText: "Promote to Admin",
          };
        } else if (to === "co") {
          return {
            title: "Promote to Co-Admin",
            description: `Are you sure you want to promote ${memberName} to Co-Admin? They will be able to manage members and tasks.`,
            icon: FaUserTie,
            iconColor: "text-blue-600",
            buttonText: "Promote to Co-Admin",
          };
        }
        break;
      case "demote":
        return {
          title: "Demote to Member",
          description: `Are you sure you want to demote ${memberName} to Member? They will lose their administrative privileges.`,
          icon: FaUserMinus,
          iconColor: "text-blue-600",
          buttonText: "Demote to Member",
        };
      case "kick":
        return {
          title: "Kick Member",
          description: `Are you sure you want to kick ${memberName} from this workspace? They will lose access immediately and will need to be re-invited to rejoin.`,
          icon: FaUserMinus,
          iconColor: "text-red-600",
          buttonText: "Kick Member",
        };
      default:
        return {
          title: "Confirm Action",
          description: "Are you sure you want to perform this action?",
          icon: FaUserPlus,
          iconColor: "text-gray-600",
          buttonText: "Confirm",
        };
    }
  };

  const actionDetails = getActionDetails() ?? {
    title: "Confirm Action",
    description: "Are you sure you want to perform this action?",
    icon: FaUserPlus,
    iconColor: "text-gray-600",
    buttonText: "Confirm",
    buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
  };
  const ActionIcon = actionDetails.icon;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-auto relative">
      <Button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Close"
        disabled={isLoading}
        variant="ghost"
        size="icon"
      >
        <FiX className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>

      <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
        <div
          className={`p-2 sm:p-3 rounded-full bg-gray-100 ${actionDetails.iconColor}`}
        >
          <ActionIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 pt-1">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
            {actionDetails.title}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {actionDetails.description}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="w-full sm:w-auto"
          variant={action === "kick" ? "destructive" : "default"}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            actionDetails.buttonText
          )}
        </Button>
      </div>
    </div>
  );
}

export default ConfirmMemberActionModal;
