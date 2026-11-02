import { Button, LoadingPage, Sidebar } from "@/components";
import { useDialogContext, useGetUserWorkspaces } from "@/hooks";
import { workspaceColor } from "@/utils";
import { LayoutGrid, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router";

function Home() {
  const { openDialog } = useDialogContext();
  const { data: workspaces, isLoading } = useGetUserWorkspaces();

  if (isLoading) {
    return <LoadingPage message="Loading..." />;
  }

  return (
    <div className="flex h-screen bg-wash">
      <Sidebar />
      <div className="flex-1 min-w-0 pt-16 lg:pt-0">
        <main className="h-full overflow-auto rounded-t-[22px] lg:rounded-none lg:rounded-l-[28px] bg-white shadow-xs p-4 pb-24 sm:p-7 sm:pb-24">
          <div className="mb-6 pb-3 border-b border-line flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-blue-900">
              Workspaces
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => openDialog("JOIN_WORKSPACE")}
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Join</span>
              </Button>
              <Button onClick={() => openDialog("CREATE_WORKSPACE")}>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create</span>
              </Button>
            </div>
          </div>

          {workspaces?.length ? (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {workspaces.map((workspace) => (
                <Link
                  key={workspace.id}
                  to={`/workspace/${workspace.id}/tasks`}
                  className="bg-white rounded-2xl border border-line overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className={`${workspaceColor(
                      workspace.id
                    )} h-28 p-4 flex flex-col justify-between`}
                  >
                    <h2 className="text-lg font-semibold text-white line-clamp-2 break-words">
                      {workspace.name}
                    </h2>
                    <span className="text-sm text-white/90 capitalize">
                      {workspace.role}
                    </span>
                  </div>
                  <div className="px-4 py-3 text-sm text-slate-500">
                    Semester {workspace.defaultSemester}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="text-slate-400 mb-4">
                <LayoutGrid className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-800">
                Join or create a workspace to get started
              </h3>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
