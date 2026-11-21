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
// in providers that sit above <Routes>. "" outside a workspace route
function useWorkspaceId() {
  return useMatch("/workspace/:workspaceId/*")?.params.workspaceId ?? "";
}

function useGetUserWorkspace() {
  const { data: user } = useGetProfile();
  const workspaceId = useWorkspaceId();

  return useQuery({
    queryKey: queryKeys.workspaces.list(),
    queryFn: fetchWorkspaces,
    select: (workspaces) =>
      workspaces.find((workspace) => workspace.id === workspaceId) ?? null,
    enabled: !!user,
  });
}

function useGetWorkspaceMembers() {
  const workspaceId = useWorkspaceId();

  return useQuery({
    queryKey: queryKeys.members.list(workspaceId),
    queryFn: async () =>
      (
        await api.get<WorkspaceMemberWithProfile[]>(
          `/workspaces/${workspaceId}/members`
        )
      ).data,
    enabled: !!workspaceId,
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
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (semester: Semester) =>
      (
        await api.patch<UserWorkspace>(
          `/workspaces/${workspaceId}/default-semester`,
          { semester }
        )
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
    },
  });
}

function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/workspaces/${workspaceId}`);
    },
    onSuccess: () => {
      navigate("/");
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
    },
  });
}

function useUpdateWorkspaceName() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (name: string) =>
      (
        await api.patch<UserWorkspace>(`/workspaces/${workspaceId}`, {
          name,
        })
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
    },
  });
}

export {
  useJoinWorkspace,
  useCreateWorkspace,
  useGetUserWorkspaces,
  useGetUserWorkspace,
  useWorkspaceId,
  useGetWorkspaceMembers,
  useGetUserWorkspaceRole,
  useGetDefaultSemester,
  useUpdateDefaultSemester,
  useDeleteWorkspace,
  useUpdateWorkspaceName,
};
