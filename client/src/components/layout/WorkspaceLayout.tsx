import { LoadingPage, Sidebar, WorkspaceHeader } from "@/components";
import { useGetUserWorkspace } from "@/hooks";
import { Navigate, Outlet } from "react-router";

function WorkspaceLayout() {
  const { data: workspace, isLoading } = useGetUserWorkspace();

  if (isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  // not a member of the workspace in the URL (or it was deleted)
  if (!workspace) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-4 pt-20 sm:px-6 lg:pt-6">
        <WorkspaceHeader
          workspaceId={workspace.id}
          workspaceName={workspace.name}
        />
        <Outlet />
      </div>
    </div>
  );
}

export default WorkspaceLayout;
