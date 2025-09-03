import Sidebar from "@/components/Sidebar";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { mockWorkspaces } from "@/data/mockData";

type WorkspaceLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ workspaceId: string }>;
};

async function WorkspaceLayout({ children, params }: WorkspaceLayoutProps) {
  const { workspaceId } = await params;
  const workspace = mockWorkspaces.find((w) => w.id === workspaceId);

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar workspaceId={workspaceId} />
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
