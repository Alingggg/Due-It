import {
  useGetSession,
  useGetUserWorkspace,
  useGetUserWorkspaceRole,
} from "@/hooks";
import { supabase, queryKeys } from "@/lib";
import type { Database } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

function useDeleteMembership() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useGetSession();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("workspace_members")
        .delete()
        .eq("user_id", userId);

      if (error) throw new Error(error.message);
    },
    onSuccess: (_, userId) => {
      if (user?.id === userId) {
        queryClient.invalidateQueries({ queryKey: ["userWorkspace"] });
        queryClient.invalidateQueries({
          queryKey: queryKeys.workspaces.all,
        });
        navigate("/get-started");
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
  const { user: currentUser } = useGetSession();
  const { data: currentUserRole } = useGetUserWorkspaceRole();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: Database["public"]["Enums"]["workspace_role"];
    }) => {
      const { error: updateError } = await supabase
        .from("workspace_members")
        .update({ role })
        .eq("user_id", userId);

      if (updateError) throw new Error(updateError.message);

      if (role === "admin" && currentUserRole === "admin" && currentUser?.id) {
        const { error: demoteError } = await supabase
          .from("workspace_members")
          .update({ role: "co-admin" })
          .eq("user_id", currentUser.id);

        if (demoteError) throw new Error(demoteError.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.list(workspace?.id!),
      });
    },
    onError: (error) => {
      console.error("Error updating role:", error);
    },
  });
}

export { useDeleteMembership, useUpdateRole };
