import { useGetUserWorkspace, useSemesterContext } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { Code } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetCode() {
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.code.detail(workspace?.id!, semester),
    queryFn: async () =>
      (await api.get<Code>(`/workspaces/${workspace!.id}/code`)).data,
    enabled: !!workspace && !!semester,
  });
}

function useRenewCode() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async () =>
      (await api.post<Code>(`/workspaces/${workspace!.id}/code/renew`)).data,
    onSuccess: (code) => {
      queryClient.setQueryData(
        queryKeys.code.detail(workspace?.id!, semester),
        code
      );
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
    mutationFn: async (enabled: boolean) =>
      (await api.patch<Code>(`/workspaces/${workspace!.id}/code`, { enabled }))
        .data,
    onSuccess: (code) => {
      queryClient.setQueryData(
        queryKeys.code.detail(workspace?.id!, semester),
        code
      );
    },
    onError: (error) => {
      console.log("Error updating code status:", error);
    },
  });
}

export { useGetCode, useRenewCode, useUpdateCodeStatus };
