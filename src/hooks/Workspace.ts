"use client";
import supabase from "@/lib/supabase";
import generateJoinCode from "@/utils/generateJoinCode";
import { useMutation, useQuery } from "@tanstack/react-query";
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

function useCreateWorkspace() {
  const router = useRouter();
  return useMutation({
    mutationFn: async (workspaceName: string) => {
      const code = generateJoinCode();

      const { data: workspaceId, error } = await supabase.rpc(
        "create_workspace_with_member_and_code",
        {
          workspace_name: workspaceName,
          invite_code: code,
          member_role: "admin",
        }
      );

      if (error) throw new Error(error.message);

      router.push(`/workspace/${workspaceId}/tasks`);
    },
    onError: (error: any) => {
      console.log("Error creating workspace:", error);
    },
  });
}

function useGetUserWorkspace(isAuthenticated: boolean) {
  return useQuery({
    queryKey: ["userWorkspace"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_members")
        .select("workspace:workspaces(*)")
        .maybeSingle();

      if (error) throw error;
      return data?.workspace;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function useGetWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: ["workspaceMembers", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspace_members_with_profile")
        .select("*")
        .eq("workspace_id", workspaceId);

      if (error) throw error;
      return data;
    },
  });
}

function useGetUserWorkspaceRole(workspaceId: string) {
  return useQuery({
    queryKey: ["workspaceRole", workspaceId],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User is not authenticated");
      }

      const { data, error } = await supabase
        .from("workspace_members")
        .select("role")
        .eq("workspace_id", workspaceId)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data?.role;
    },
  });
}

export {
  useJoinWorkspace,
  useCreateWorkspace,
  useGetUserWorkspace,
  useGetWorkspaceMembers,
  useGetUserWorkspaceRole,
};
