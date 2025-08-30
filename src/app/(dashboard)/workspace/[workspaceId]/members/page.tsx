"use client";
import { useState, useEffect } from "react";
import { getWorkspaceMembersByWorkspaceId } from "@/data/mockData";
import MemberCard from "@/components/MemberCard";

function MembersPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    params.then(({ workspaceId }) => {
      setWorkspaceId(workspaceId);
      setMembers(getWorkspaceMembersByWorkspaceId(workspaceId));
    });
  }, [params]);

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
          />
        ))}
      </div>
    </div>
  );
}

export default MembersPage;
