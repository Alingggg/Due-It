import { useGetUserWorkspace } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { Code } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetCode() {
  const { data: workspace } = useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.code.detail(workspace?.id!),
    queryFn: async () =>
      (await api.get<Code>(`/workspaces/${workspace!.id}/code`)).data,
    enabled: !!workspace,
  });
}

function useRenewCode() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async () =>
      (await api.post<Code>(`/workspaces/${workspace!.id}/code/renew`)).data,
    onSuccess: (code) => {
      queryClient.setQueryData(queryKeys.code.detail(workspace?.id!), code);
    },
  });
}

function useUpdateCodeStatus() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (enabled: boolean) =>
      (await api.patch<Code>(`/workspaces/${workspace!.id}/code`, { enabled }))
        .data,
    onSuccess: (code) => {
      queryClient.setQueryData(queryKeys.code.detail(workspace?.id!), code);
    },
  });
}

export { useGetCode, useRenewCode, useUpdateCodeStatus };
