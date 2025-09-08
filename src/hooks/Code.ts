import supabase from "@/lib/supabase";
import { Code } from "@/types/Code";
import { toCamelCase } from "@/utils/caseConversion";
import generateJoinCode from "@/utils/generateJoinCode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetCode() {
  return useQuery({
    queryKey: ["workspaceCode"],
    queryFn: async () => {
      const { data, error } = await supabase.from("codes").select("*").single();

      if (error) {
        throw new Error(error.message);
      }

      return toCamelCase<Code>(data);
    },
  });
}

function useRenewCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (workspaceId: string) => {
      const newCode = generateJoinCode();
      const { error } = await supabase
        .from("codes")
        .update({ code: newCode, updated_at: new Date().toISOString() })
        .eq("workspace_id", workspaceId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceCode"] });
    },
    onError: (error) => {
      console.error("Error renewing code:", error);
    },
  });
}

function useUpdateCodeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workspaceId,
      enable,
    }: {
      workspaceId: string;
      enable: boolean;
    }) => {
      const { error } = await supabase
        .from("codes")
        .update({ enabled: enable })
        .eq("workspace_id", workspaceId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceCode"] });
    },
    onError: (error) => {
      console.error("Error updating code status:", error);
    },
  });
}

export { useGetCode, useRenewCode, useUpdateCodeStatus };
