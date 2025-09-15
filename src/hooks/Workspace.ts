"use client";
import { useGetSession } from "@/hooks/Auth";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { WorkspaceMemberWithProfile } from "@/types/Member";
import { toCamelCase } from "@/utils/caseConversion";
import generateJoinCode from "@/utils/generateJoinCode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function useJoinWorkspace() {
  const queryClient = useQueryClient();
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
        .select("workspace_id, enabled")
        .eq("code", code)
        .maybeSingle();

      if (fetchError) throw new Error(fetchError.message);

      if (!codeData?.workspace_id) throw new Error("Invalid join code");
      if (!codeData.enabled) throw new Error("Join code is disabled");

      const { error: addError } = await supabase
        .from("workspace_members")
        .insert({ workspace_id: codeData.workspace_id, user_id: user.id });

      if (addError) throw new Error(addError.message);

      return codeData.workspace_id;
    },
    onSuccess: (workspaceId) => {
      queryClient.invalidateQueries({
        queryKey: ["userWorkspace"],
      });
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
        "create_workspace_with_member_code_and_default_semester",
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

function useGetUserWorkspace(isAuthenticated: boolean = true) {
  const { user, isLoading: isUserLoading } = useGetSession();

  return useQuery({
    queryKey: ["userWorkspace"],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User is not authenticated");
      }

      const { data, error } = await supabase
        .from("workspace_members")
        .select("workspace:workspaces(*)")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.log(error);
        throw error;
      }

      return data?.workspace || null;
    },
    enabled: isAuthenticated && !isUserLoading && !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

function useGetWorkspaceMembers() {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.members.list(workspace?.id!),
    queryFn: async () => {
      if (!workspace?.id) {
        throw new Error("Workspace is not available");
      }

      const { data, error } = await supabase
        .from("workspace_members_with_profile")
        .select("*")
        .eq("workspace_id", workspace.id);

      if (error) {
        console.log(error);
        throw error;
      }

      return data.map<WorkspaceMemberWithProfile>(toCamelCase);
    },
    enabled: !isLoadingWorkspace && !!workspace,
  });
}

function useGetUserWorkspaceRole() {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.roles.detail(workspace?.id!),
    queryFn: async () => {
      if (!workspace?.id) {
        throw new Error("Workspace is not available");
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User is not authenticated");
      }

      const { data, error } = await supabase
        .from("workspace_members")
        .select("role")
        .eq("workspace_id", workspace.id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.log(error);
        throw error;
      }

      return data?.role || null;
    },
    enabled: !isLoadingWorkspace && !!workspace,
  });
}

function useGetDefaultSemester() {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.defaultSemesters.detail(workspace?.id!),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("default_semester")
        .select("semester")
        .maybeSingle();

      if (error) {
        console.log(error);
        throw error;
      }

      return data?.semester || null;
    },
    enabled: !isLoadingWorkspace && !!workspace,
  });
}

function useUpdateDefaultSemester() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (semester: 1 | 2) => {
      if (!workspace?.id) {
        throw new Error("Workspace is not available");
      }

      const { error } = await supabase
        .from("default_semester")
        .update({ semester })
        .eq("workspace_id", workspace.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.defaultSemesters.detail(workspace?.id || ""),
      });
    },
    onError: (error: any) => {
      console.log("Error changing default semester:", error);
    },
  });
}

function useDeleteWorkspace() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async () => {
      if (!workspace?.id) {
        throw new Error("Workspace is not available");
      }

      const { error } = await supabase
        .from("workspaces")
        .delete()
        .eq("id", workspace.id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaces.all,
      });
      router.push("/get-started");
    },
    onError: (error: any) => {
      console.log("Error deleting workspace:", error);
    },
  });
}

export {
  useJoinWorkspace,
  useCreateWorkspace,
  useGetUserWorkspace,
  useGetWorkspaceMembers,
  useGetUserWorkspaceRole,
  useGetDefaultSemester,
  useUpdateDefaultSemester,
  useDeleteWorkspace,
};
