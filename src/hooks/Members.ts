"use client";
import { useGetSession } from "@/hooks/Auth";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function useDeleteMembership() {
  const queryClient = useQueryClient();
  const router = useRouter();
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
        router.push("/get-started");
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

export { useDeleteMembership };
