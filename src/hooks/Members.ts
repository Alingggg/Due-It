import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function useDeleteMembership() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("workspace_members")
        .delete()
        .eq("user_id", userId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userWorkspace"] });
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.all,
      });
      router.push("/get-started");
    },
    onError: (error) => {
      console.error("Error deleting membership:", error);
    },
  });
}

export { useDeleteMembership };
