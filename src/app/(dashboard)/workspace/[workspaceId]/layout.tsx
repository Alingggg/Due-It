"use client";
import Sidebar from "@/components/Sidebar";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { useGetUserWorkspace } from "@/hooks/Workspace";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
};

function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  const { data: workspace } = useGetUserWorkspace();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar workspaceId={workspace?.id ?? ""} />
      <div className="flex-1 overflow-auto p-4 pt-20 sm:px-6 lg:pt-6">
        <WorkspaceHeader
          workspaceName={workspace?.name ?? "Untitled Workspace"}
        />
        {children}
      </div>
    </div>
  );
}

export default WorkspaceLayout;
