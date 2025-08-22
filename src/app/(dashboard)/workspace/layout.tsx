import { Sidebar } from "@/components";

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6 pt-20 lg:pt-6">{children}</div>
    </div>
  );
}

export default WorkspaceLayout;
