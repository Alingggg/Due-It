import { useGetUserWorkspace, useSemesterContext } from "@/hooks";
import { queryKeys, supabase } from "@/lib";
import type { Code } from "@/types";
import { generateJoinCode, toCamelCase } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetCode() {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.code.detail(workspace?.id!, semester),
    queryFn: async () => {
      if (!workspace?.id || !semester)
        throw new Error("Workspace or semester is not available");

      const { data, error } = await supabase.from("codes").select("*").single();

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return toCamelCase<Code>(data);
    },
    enabled: !isLoadingWorkspace && !!workspace && !!semester,
  });
}

function useRenewCode() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async () => {
      if (!workspace?.id || !semester)
        throw new Error("Workspace or semester is not available");

      const newCode = generateJoinCode();

      const { error } = await supabase
        .from("codes")
        .update({ code: newCode, updated_at: new Date().toLocaleString() })
        .eq("workspace_id", workspace.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.code.detail(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error renewing code:", error);
    },
  });
}

function useUpdateCodeStatus() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (enable: boolean) => {
      if (!workspace?.id || !semester)
        throw new Error("Workspace or semester is not available");

      const { error } = await supabase
        .from("codes")
        .update({ enabled: enable })
        .eq("workspace_id", workspace.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.code.detail(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error updating code status:", error);
    },
  });
}

export { useGetCode, useRenewCode, useUpdateCodeStatus };
