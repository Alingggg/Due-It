"use client";
import MemberCard from "@/components/MemberCard";
import { useQueryClient } from "@tanstack/react-query";
import { useWorkspaceMembers, useWorkspaceRole } from "@/hooks/Workspace";
import LoadingPage from "@/components/LoadingPage";
import { useProfile } from "@/hooks/Auth";

function MembersPage() {
  const queryClient = useQueryClient();
  const workspace = queryClient.getQueryData<any>(["userWorkspace"]);
  const { data: members, isLoading } = useWorkspaceMembers(workspace?.id || "");
  const { data: currentUser } = useProfile();
  const { data: currentUserRole } = useWorkspaceRole(workspace?.id || "");

  if (isLoading) {
    return <LoadingPage message="Loading members..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Members</h1>
        <div className="text-sm text-slate-500">{members?.length} members</div>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {members?.map((member) =>
          currentUser ? (
            <MemberCard
              key={member.user_id}
              member={member}
              currentUser={currentUser}
              currentUserRole={
                currentUserRole as
                  | "admin"
                  | "co-admin"
                  | "member"
                  | null
                  | undefined
              }
            />
          ) : null
        )}
      </div>
    </div>
  );
}

export default MembersPage;
