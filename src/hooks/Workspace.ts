"use client";
import supabase from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function useJoinWorkspace() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (code: string) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user)
        throw new Error("You must be logged in to join a workspace");

      const { data: codeData, error: fetchError } = await supabase
        .from("codes")
        .select("workspace_id")
        .eq("code", code)
        .maybeSingle();

      if (fetchError) throw new Error(fetchError.message);

      if (!codeData?.workspace_id) throw new Error("Invalid join code");

      const { error: addError } = await supabase
        .from("workspace_members")
        .insert({ workspace_id: codeData.workspace_id, user_id: user.id });

      if (addError) throw new Error(addError.message);
    },
    onSuccess: (workspaceId) => {
      router.push(`/workspace/${workspaceId}/tasks`);
    },
    onError: (error: any) => {
      console.log("Error joining workspace:", error);
    },
  });
}

export { useJoinWorkspace };
