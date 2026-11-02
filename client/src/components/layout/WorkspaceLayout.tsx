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
    <div className="flex h-screen bg-wash">
      <Sidebar />
      <div className="flex-1 min-w-0 pt-16 lg:pt-0">
        {/* the white content sheet, flush with the window so its scrollbar is on the edge */}
        <main className="h-full overflow-auto rounded-t-[22px] lg:rounded-none lg:rounded-l-[28px] bg-white shadow-xs p-3 sm:p-4">
          <WorkspaceHeader workspace={workspace} />
          <div className="px-1 pb-24 sm:px-3">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default WorkspaceLayout;
