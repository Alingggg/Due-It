"use client";
import { useState, useEffect } from "react";
import { getWorkspaceMembersByWorkspaceId } from "@/data/mockData";
import { FaUsers } from "react-icons/fa";
import { MemberCard } from "@/components";

function MembersPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    params.then(({ workspaceId }) => {
      setWorkspaceId(workspaceId);
      setMembers(getWorkspaceMembersByWorkspaceId(workspaceId));
    });
  }, [params]);

  const handleRoleChange = (userId: string, newRole: string) => {
    setMembers((prev) => {
      // If promoting to admin, demote current admin to co-admin
      if (newRole === "admin") {
        const currentAdmin = prev.find((m) => m.role === "admin");
        return prev.map((member) => {
          if (member.userId === userId) {
            return { ...member, role: "admin" };
          }
          if (currentAdmin && member.userId === currentAdmin.userId) {
            return { ...member, role: "co" };
          }
          return member;
        });
      }
      // Otherwise, just update the role as usual
      return prev.map((member) =>
        member.userId === userId ? { ...member, role: newRole } : member
      );
    });
  };

  const handleKickMember = (userId: string) => {
    setMembers((prev) => prev.filter((member) => member.userId !== userId));
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
        {members.map((member) => (
          <MemberCard
            key={member.userId}
            member={member}
            workspaceId={workspaceId}
            onRoleChange={handleRoleChange}
            onKickMember={handleKickMember}
          />
        ))}
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
