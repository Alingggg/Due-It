import { useGetProfile } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type {
  Semester,
  UserWorkspace,
  WorkspaceMemberWithProfile,
} from "@/types";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

function useJoinWorkspace() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (code: string) =>
      (await api.post<UserWorkspace>("/workspaces/join", { code })).data,
    onSuccess: (workspace) => {
      queryClient.setQueryData(queryKeys.workspaces.mine(), workspace);
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
    onSuccess: (workspace) => {
      queryClient.setQueryData(queryKeys.workspaces.mine(), workspace);
      navigate(`/workspace/${workspace.id}/tasks`);
    },
    onError: (error: any) => {
      console.log("Error creating workspace:", error);
    },
  });
}

function useGetUserWorkspace() {
  const { data: user } = useGetProfile();

  return useQuery({
    queryKey: queryKeys.workspaces.mine(),
    queryFn: async () =>
      (await api.get<UserWorkspace | null>("/workspaces/mine")).data,
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
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.workspaces.mine(), updated);
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
      queryClient.setQueryData(queryKeys.workspaces.mine(), null);
      navigate("/get-started");
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
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.workspaces.mine(), updated);
    },
    onError: (error: any) => {
      console.log("Error updating workspace name:", error);
    },
  });
}

export {
  useJoinWorkspace,
  useCreateWorkspace,
  useGetUserWorkspace,
  useGetWorkspaceMembers,
  useGetUserWorkspaceRole,
  useGetDefaultSemester,
  useUpdateDefaultSemester,
  useDeleteWorkspace,
  useUpdateWorkspaceName,
};
