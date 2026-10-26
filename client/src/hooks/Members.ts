import { useGetProfile, useGetUserWorkspace } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { WorkspaceRole } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

function useDeleteMembership() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: user } = useGetProfile();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/workspaces/${workspace!.id}/members/${userId}`);
    },
    onSuccess: (_, userId) => {
      if (user?.id === userId) {
        navigate("/");
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.list(),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeys.members.list(workspace?.id!),
        });
      }
    },
    onError: (error) => {
      console.error("Error deleting membership:", error);
    },
  });
}

function useUpdateRole() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: WorkspaceRole;
    }) => {
      await api.patch(`/workspaces/${workspace!.id}/members/${userId}`, {
        role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.list(workspace?.id!),
      });
      // promoting someone to admin demotes the current user
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
    },
    onError: (error) => {
      console.error("Error updating role:", error);
    },
  });
}

export { useDeleteMembership, useUpdateRole };
