import { api, queryKeys } from "@/lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useSendMessage() {
  const queryClient = useQueryClient();

  const refreshWorkspaces = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });

  return useMutation({
    mutationFn: async (message: string) =>
      (
        await api.post<{ reply: string; dataChanged: boolean }>(
          "/assistant/messages",
          {
            message,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          }
        )
      ).data,
    onSuccess: (data) => {
      if (data.dataChanged) refreshWorkspaces();
    },
    onError: () => {
      refreshWorkspaces();
    },
  });
}

function useClearChat() {
  return useMutation({
    mutationFn: async () => {
      await api.delete("/assistant/messages");
    },
  });
}

export { useSendMessage, useClearChat };
