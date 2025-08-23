"use client";
import { getWorkspaceMembersByWorkspaceId } from "@/data/mockData";
import { FaUser, FaCrown, FaUserTie, FaUsers } from "react-icons/fa";

function MembersPage() {
  // Show members for workspace 1 (Computer Science Department)
  const members = getWorkspaceMembersByWorkspaceId("1");

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Members</h1>
        <div className="text-sm text-slate-500">{members.length} members</div>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {members.map((member) => {
          const roleInfo = getRoleInfo(member.role);
          const RoleIcon = roleInfo.icon;
          const initials = getInitials(
            member.profile.firstName,
            member.profile.lastName
          );

          return (
            <div
              key={member.userId}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-700 font-semibold text-sm">
                      {initials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">
                      {member.profile.firstName} {member.profile.lastName}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span>
                        @{member.profile.firstName.toLowerCase()}
                        {member.profile.lastName.toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${roleInfo.color}`}
                    >
                      <RoleIcon className="w-3 h-3 mr-1 inline" />
                      {roleInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {members.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <FaUsers className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-1">
            No members yet
          </h3>
          <p className="text-slate-600">
            Members will appear here when they join the workspace.
          </p>
        </div>
      )}
    </div>
  );
}

export default MembersPage;
