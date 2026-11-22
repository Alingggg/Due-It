import { useWorkspaceId } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type { Code } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetCode() {
  const workspaceId = useWorkspaceId();

  return useQuery({
    queryKey: queryKeys.code.detail(workspaceId),
    queryFn: async () =>
      (await api.get<Code>(`/workspaces/${workspaceId}/code`)).data,
    enabled: !!workspaceId,
  });
}

function useRenewCode() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async () =>
      (await api.post<Code>(`/workspaces/${workspaceId}/code/renew`)).data,
    onSuccess: (code) => {
      queryClient.setQueryData(queryKeys.code.detail(workspaceId), code);
    },
  });
}

function useUpdateCodeStatus() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (enabled: boolean) =>
      (await api.patch<Code>(`/workspaces/${workspaceId}/code`, { enabled }))
        .data,
    onSuccess: (code) => {
      queryClient.setQueryData(queryKeys.code.detail(workspaceId), code);
    },
  });
}

export { useGetCode, useRenewCode, useUpdateCodeStatus };
