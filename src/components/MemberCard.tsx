"use client";
import { useState } from "react";
import { Crown, User, UserCog, MoreVertical } from "lucide-react";
import useDialogContext from "@/hooks/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types/Profile";
import { WorkspaceMemberWithProfile } from "@/types/Member";
import { Database } from "@/types/supabase";

type Roles = Database["public"]["Enums"]["workspace_role"];

interface MemberCardProps {
  member: WorkspaceMemberWithProfile;
  currentUser: Profile;
  currentUserRole: Roles;
}

function MemberCard({ member, currentUser, currentUserRole }: MemberCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { openDialog, closeDialog } = useDialogContext();

  function getRoleInfo(role: string) {
    switch (role) {
      case "admin":
        return {
          icon: Crown,
          text: "Admin",
          color: "text-red-600 bg-red-50",
        };
      case "co-admin":
        return {
          icon: UserCog,
          text: "Co-Admin",
          color: "text-blue-600 bg-blue-50",
        };
      case "member":
        return {
          icon: User,
          text: "Member",
          color: "text-slate-600 bg-slate-50",
        };
      default:
        return {
          icon: User,
          text: "Member",
          color: "text-slate-600 bg-slate-50",
        };
    }
  }

  function getInitials(firstName: string, lastName: string) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  function handleRoleChange(newRole: string) {
    const action = newRole === "member" ? "demote" : "promote";
    const memberName = `${member.firstName} ${member.lastName}`;

    function getActionDetails() {
      switch (action) {
        case "promote":
          if (newRole === "admin") {
            return {
              title: "Promote to Admin",
              description: `Are you sure you want to promote ${memberName} to Admin? They will have full access to manage this workspace.`,
              buttonText: "Promote to Admin",
              buttonVariant: "destructive",
            };
          } else if (newRole === "co-admin") {
            return {
              title: "Promote to Co-Admin",
              description: `Are you sure you want to promote ${memberName} to Co-Admin? They will be able to manage members and tasks.`,
              buttonText: "Promote to Co-Admin",
              buttonVariant: "default",
            };
          }
          break;
        case "demote":
          return {
            title: "Demote to Member",
            description: `Are you sure you want to demote ${memberName} to Member? They will lose their administrative privileges.`,
            buttonText: "Demote to Member",
            buttonVariant: "default",
          };
        default:
          return {
            title: "Confirm Action",
            description: "Are you sure you want to perform this action?",
            buttonText: "Confirm",
            buttonVariant: "default",
          };
      }
    }

    const actionDetails = getActionDetails();

    function handleAction() {
      console.log(`Changing role of ${memberName} to ${newRole}`);
      closeDialog();
    }

    openDialog("CONFIRM_ACTION", {
      title: actionDetails?.title,
      description: actionDetails?.description,
      actionButtonVariant: actionDetails?.buttonVariant,
      actionButtonText: actionDetails?.buttonText,
      handleAction,
    });
  }

  function handleKickMember() {
    const memberName = `${member.firstName} ${member.lastName}`;

    function handleAction() {
      console.log(`Kicking member ${memberName}`);
      closeDialog();
    }

    openDialog("CONFIRM_ACTION", {
      title: "Kick Member",
      description: `Are you sure you want to kick ${memberName} from this workspace? They will lose access immediately and will need to be re-invited to rejoin.`,
      actionButtonVariant: "destructive",
      actionButtonText: "Kick Member",
      handleAction,
    });
  }

  function canManageMember(targetMemberRole: string, currentUserRole: string) {
    if (currentUserRole === "admin") {
      return true;
    }
    if (currentUserRole === "co-admin") {
      return targetMemberRole === "member";
    }
    return false;
  }

  function getAvailableActions(currentUserRole: string) {
    let actions: {
      label: string;
      action: () => void;
      danger?: boolean;
    }[] = [];

    if (
      !canManageMember(member.role, currentUserRole) ||
      member.userId === currentUser?.id
    ) {
      return actions;
    }

    if (currentUserRole === "admin") {
      // Admins can promote, demote, or kick
      if (member.role === "member") {
        actions = [
          {
            label: "Promote to Admin",
            action: () => handleRoleChange("admin"),
          },
          {
            label: "Promote to Co-Admin",
            action: () => handleRoleChange("co-admin"),
          },
        ];
      } else if (member.role === "co-admin") {
        actions = [
          {
            label: "Promote to Admin",
            action: () => handleRoleChange("admin"),
          },
          {
            label: "Demote to Member",
            action: () => handleRoleChange("member"),
          },
        ];
      }
      actions.push({
        label: "Kick Member",
        action: handleKickMember,
        danger: true,
      });
    } else if (currentUserRole === "co-admin") {
      // Co-admins can only kick members
      if (member.role === "member") {
        actions = [
          {
            label: "Kick Member",
            action: handleKickMember,
            danger: true,
          },
        ];
      }
    }

    return actions;
  }

  const roleInfo = getRoleInfo(member.role);
  const RoleIcon = roleInfo.icon;
  const initials = getInitials(member.firstName, member.lastName);
  const availableActions = getAvailableActions(currentUserRole);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 hover:shadow-md hover:border-blue-200 transition-all relative">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
            <span className="text-blue-700 font-semibold text-xs sm:text-sm">
              {initials}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-0.5 sm:mb-1">
              {member.firstName} {member.lastName}
              {member.userId === currentUser?.id && (
                <span className="text-xs sm:text-sm text-slate-500 ml-1 sm:ml-2">
                  (You)
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-right">
            <span
              className={`text-[11px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${roleInfo.color}`}
            >
              <RoleIcon className="w-3 h-3 mr-1 inline" />
              {roleInfo.text}
            </span>
          </div>

          {/* Actions Menu */}
          {availableActions.length > 0 && (
            <DropdownMenu
              open={isMenuOpen}
              onOpenChange={() => setIsMenuOpen(false)}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" onClick={() => setIsMenuOpen(true)}>
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {availableActions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      className={`w-full text-xs sm:text-sm ${
                        action.danger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-slate-700"
                      }`}
                      onSelect={action.action}
                    >
                      <span
                        className={`${
                          action.danger ? "hover:text-red-600" : ""
                        }`}
                      >
                        {action.label}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberCard;
