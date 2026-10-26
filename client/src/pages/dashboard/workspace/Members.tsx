import { LoadingPage, MemberCard } from "@/components";
import {
  useGetWorkspaceMembers,
  useGetProfile,
  useGetUserWorkspaceRole,
} from "@/hooks";

function Members() {
  const { data: members, isLoading: isLoadingMembers } =
    useGetWorkspaceMembers();
  const { data: currentUser } = useGetProfile();
  const currentUserRole = useGetUserWorkspaceRole();

  if (isLoadingMembers) {
    return <LoadingPage message="Loading members..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Members</h1>
        <div className="text-sm text-slate-500">{members?.length} members</div>
      </div>

      <div className="space-y-4">
        {currentUser &&
          currentUserRole &&
          members?.map((member) => (
            <MemberCard
              key={member.userId}
              member={member}
              currentUser={currentUser}
              currentUserRole={currentUserRole}
            />
          ))}
      </div>
    </div>
  );
}

export default Members;
