import { Sidebar, WorkspaceHeader } from "@/components";
import { useGetUserWorkspace } from "@/hooks";
import { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router";

function WorkspaceLayout() {
  const { data: workspace } = useGetUserWorkspace();
  const navigate = useNavigate();
  const { workspaceId: currentWorkspaceId } = useParams();

  useEffect(() => {
    if (!workspace?.id) return;
    if (currentWorkspaceId && currentWorkspaceId !== workspace.id) {
      navigate(`/workspace/${workspace.id}/tasks`);
    }
  }, [workspace?.id, currentWorkspaceId, navigate]);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar workspaceId={workspace?.id ?? ""} />
      <div className="flex-1 overflow-auto p-4 pt-20 sm:px-6 lg:pt-6">
        <WorkspaceHeader
          workspaceName={workspace?.name ?? "Untitled Workspace"}
        />
        <Outlet />
      </div>
    </div>
  );
}

export default WorkspaceLayout;
