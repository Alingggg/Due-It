import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, UserCog, UserMinus, UserPlus } from "lucide-react";

interface MemberActionDialogProps {
  onClose: () => void;
  action: "promote" | "demote" | "kick";
  to?: "admin" | "co" | "member";
  memberId: string;
  memberName: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

function MemberActionDialog({
  onClose,
  action,
  to,
  memberName,
  isLoading = false,
}: MemberActionDialogProps) {
  const getActionDetails = () => {
    switch (action) {
      case "promote":
        if (to === "admin") {
          return {
            title: "Promote to Admin",
            description: `Are you sure you want to promote ${memberName} to Admin? They will have full access to manage this workspace.`,
            icon: Crown,
            iconColor: "text-red-600",
            buttonText: "Promote to Admin",
          };
        } else if (to === "co") {
          return {
            title: "Promote to Co-Admin",
            description: `Are you sure you want to promote ${memberName} to Co-Admin? They will be able to manage members and tasks.`,
            icon: UserCog,
            iconColor: "text-blue-600",
            buttonText: "Promote to Co-Admin",
          };
        }
        break;
      case "demote":
        return {
          title: "Demote to Member",
          description: `Are you sure you want to demote ${memberName} to Member? They will lose their administrative privileges.`,
          icon: UserMinus,
          iconColor: "text-blue-600",
          buttonText: "Demote to Member",
        };
      case "kick":
        return {
          title: "Kick Member",
          description: `Are you sure you want to kick ${memberName} from this workspace? They will lose access immediately and will need to be re-invited to rejoin.`,
          icon: UserMinus,
          iconColor: "text-red-600",
          buttonText: "Kick Member",
        };
      default:
        return {
          title: "Confirm Action",
          description: "Are you sure you want to perform this action?",
          icon: UserPlus,
          iconColor: "text-gray-600",
          buttonText: "Confirm",
        };
    }
  };

  const actionDetails = getActionDetails() ?? {
    title: "Confirm Action",
    description: "Are you sure you want to perform this action?",
    icon: UserPlus,
    iconColor: "text-gray-600",
    buttonText: "Confirm",
    buttonStyle: "bg-blue-600 hover:bg-blue-700 text-white",
  };
  const ActionIcon = actionDetails.icon;

  return (
    <DialogContent>
      <DialogTitle className="flex items-center space-x-3 sm:space-x-4">
        <div className={`rounded-full bg-gray-100 ${actionDetails.iconColor}`}>
          <ActionIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <span className="text-lg sm:text-xl font-semibold text-slate-800">
          {actionDetails.title}
        </span>
      </DialogTitle>

      <div className="pl-8 sm:pl-10">
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          {actionDetails.description}
        </p>
      </div>

      <DialogFooter>
        {action === "kick" || (action === "promote" && to === "admin") ? (
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
        ) : null}
        <Button
          onClick={onClose}
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
      </DialogFooter>
    </DialogContent>
  );
}

export default MemberActionDialog;
