import { useGetProfile } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type {
  Semester,
  UserWorkspace,
  WorkspaceMemberWithProfile,
} from "@/types";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useMatch, useNavigate } from "react-router";

function useJoinWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (code: string) =>
      (await api.post<UserWorkspace>("/workspaces/join", { code })).data,
    onSuccess: async (workspace) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.list(),
      });
      navigate(`/workspace/${workspace.id}/tasks`);
    },
    onError: (error: any) => {
      console.log("Error joining workspace:", error);
    },
  });
}

function useCreateWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (name: string) =>
      (await api.post<UserWorkspace>("/workspaces", { name })).data,
    onSuccess: async (workspace) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.list(),
      });
      navigate(`/workspace/${workspace.id}/tasks`);
    },
    onError: (error: any) => {
      console.log("Error creating workspace:", error);
    },
  });
}

async function fetchWorkspaces() {
  return (await api.get<UserWorkspace[]>("/workspaces")).data;
}

function useGetUserWorkspaces() {
  const { data: user } = useGetProfile();

  return useQuery({
    queryKey: queryKeys.workspaces.list(),
    queryFn: fetchWorkspaces,
    enabled: !!user,
  });
}

// the workspace in the current URL; useMatch (not useParams) so it also works
// in providers that sit above <Routes>
function useGetUserWorkspace() {
  const { data: user } = useGetProfile();
  const workspaceId = useMatch("/workspace/:workspaceId/*")?.params.workspaceId;

  return useQuery({
    queryKey: queryKeys.workspaces.list(),
    queryFn: fetchWorkspaces,
    select: (workspaces) =>
      workspaces.find((workspace) => workspace.id === workspaceId) ?? null,
    enabled: !!user,
  });
}

function useGetWorkspaceMembers() {
  const { data: workspace } = useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.members.list(workspace?.id!),
    queryFn: async () =>
      (
        await api.get<WorkspaceMemberWithProfile[]>(
          `/workspaces/${workspace!.id}/members`
        )
      ).data,
    enabled: !!workspace,
  });
}

function useGetUserWorkspaceRole() {
  const { data: workspace } = useGetUserWorkspace();

  return workspace?.role ?? null;
}

function useGetDefaultSemester() {
  const { data: workspace } = useGetUserWorkspace();

  return workspace?.defaultSemester ?? null;
}

function useUpdateDefaultSemester() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (semester: Semester) =>
      (
        await api.patch<UserWorkspace>(
          `/workspaces/${workspace!.id}/default-semester`,
          { semester }
        )
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
    },
    onError: (error: any) => {
      console.log("Error changing default semester:", error);
    },
  });
}

function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/workspaces/${workspace!.id}`);
    },
    onSuccess: () => {
      navigate("/");
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
    },
    onError: (error: any) => {
      console.log("Error deleting workspace:", error);
    },
  });
}

function useUpdateWorkspaceName() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (name: string) =>
      (
        await api.patch<UserWorkspace>(`/workspaces/${workspace!.id}`, {
          name,
        })
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
    },
    onError: (error: any) => {
      console.log("Error updating workspace name:", error);
    },
  });
}

export {
  useJoinWorkspace,
  useCreateWorkspace,
  useGetUserWorkspaces,
  useGetUserWorkspace,
  useGetWorkspaceMembers,
  useGetUserWorkspaceRole,
  useGetDefaultSemester,
  useUpdateDefaultSemester,
  useDeleteWorkspace,
  useUpdateWorkspaceName,
};
