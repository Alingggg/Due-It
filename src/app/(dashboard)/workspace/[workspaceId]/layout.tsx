import { Sidebar } from "@/components";
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
      <div className="flex-1 overflow-auto p-4 sm:p-6 pt-20 lg:pt-6">
        {/* Workspace Header */}
        <div className="mb-6 pb-3 border-b border-slate-200">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            {workspace?.name || "Unknown Workspace"}
          </h1>
        </div>

        {children}
      </div>
    </div>
  );
}

export default WorkspaceLayout;
