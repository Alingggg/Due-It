"use client";
import { useState } from "react";
import { getCurrentUser, getCurrentUserRole } from "@/data/mockData";
import {
  FaUser,
  FaCrown,
  FaUserTie,
  FaEllipsisV,
  FaUserPlus,
  FaUserMinus,
} from "react-icons/fa";
import { IconType } from "react-icons";

interface MemberCardProps {
  member: any;
  workspaceId: string;
  onRoleChange: (userId: string, newRole: string) => void;
  onKickMember: (userId: string) => void;
}

function MemberCard({
  member,
  workspaceId,
  onRoleChange,
  onKickMember,
}: MemberCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentUser = getCurrentUser();

  const getRoleInfo = (role: string) => {
    switch (role) {
      case "admin":
        return {
          icon: FaCrown,
          text: "Admin",
          color: "text-red-600 bg-red-50",
        };
      case "co":
        return {
          icon: FaUserTie,
          text: "Co-Admin",
          color: "text-blue-600 bg-blue-50",
        };
      case "member":
        return {
          icon: FaUser,
          text: "Member",
          color: "text-slate-600 bg-slate-50",
        };
      default:
        return {
          icon: FaUser,
          text: "Member",
          color: "text-slate-600 bg-slate-50",
        };
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleRoleChange = (newRole: string) => {
    onRoleChange(member.userId, newRole);
    closeMenu();
  };

  const handleKickMember = () => {
    onKickMember(member.userId);
    closeMenu();
  };

  const canManageMember = (
    targetMemberRole: string,
    currentUserRole: string
  ) => {
    if (currentUserRole === "admin") {
      return true; // Admins can manage everyone
    }
    if (currentUserRole === "co") {
      return targetMemberRole === "member"; // Co-admins can only manage members
    }
    return false; // Members can't manage anyone
  };

  const getAvailableActions = (currentUserRole: string) => {
    let actions: {
      label: string;
      action: () => void;
      icon: IconType;
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
            icon: FaCrown,
          },
          {
            label: "Promote to Co-Admin",
            action: () => handleRoleChange("co"),
            icon: FaUserPlus,
          },
        ];
      } else if (member.role === "co") {
        actions = [
          {
            label: "Promote to Admin",
            action: () => handleRoleChange("admin"),
            icon: FaCrown,
          },
          {
            label: "Demote to Member",
            action: () => handleRoleChange("member"),
            icon: FaUserMinus,
          },
        ];
      }
      actions.push({
        label: "Kick Member",
        action: handleKickMember,
        icon: FaUserMinus,
        danger: true,
      });
    } else if (currentUserRole === "co") {
      // Co-admins can only kick members
      if (member.role === "member") {
        actions = [
          {
            label: "Kick Member",
            action: handleKickMember,
            icon: FaUserMinus,
            danger: true,
          },
        ];
      }
    }

    return actions;
  };

  const roleInfo = getRoleInfo(member.role);
  const RoleIcon = roleInfo.icon;
  const initials = getInitials(
    member.profile.firstName,
    member.profile.lastName
  );
  const currentUserRole = getCurrentUserRole(workspaceId); // <-- Use workspaceId here
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
              {member.profile.firstName} {member.profile.lastName}
              {member.userId === currentUser?.id && (
                <span className="text-xs sm:text-sm text-slate-500 ml-1 sm:ml-2">
                  (You)
                </span>
              )}
            </h3>
            <div className="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-slate-600">
              <span>
                @{member.profile.firstName.toLowerCase()}
                {member.profile.lastName.toLowerCase()}
              </span>
            </div>
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
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              >
                <FaEllipsisV className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <>
                  {/* Overlay */}
                  <div className="fixed inset-0 z-10" onClick={closeMenu} />

                  {/* Menu - appears to the left of the button */}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
                    <div className="py-1">
                      {availableActions.map((action, index) => {
                        const ActionIcon = action.icon;
                        return (
                          <button
                            key={index}
                            onClick={action.action}
                            className={`w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-slate-50 flex items-center ${
                              action.danger
                                ? "text-red-600 hover:bg-red-50"
                                : "text-slate-700"
                            }`}
                          >
                            <ActionIcon className="w-4 h-4 mr-2 sm:mr-3" />
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemberCard;
