import { useGetProfile, useWorkspaceId } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { WorkspaceRole } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

function useDeleteMembership() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: user } = useGetProfile();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
    },
    onSuccess: (_, userId) => {
      if (user?.id === userId) {
        navigate("/");
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.list(),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeys.members.list(workspaceId),
        });
      }
    },
  });
}

function useUpdateRole() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: WorkspaceRole;
    }) => {
      await api.patch(`/workspaces/${workspaceId}/members/${userId}`, {
        role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.list(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.list() });
    },
  });
}

export { useDeleteMembership, useUpdateRole };
