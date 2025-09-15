"use client";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { Profile } from "@/types/Profile";
import { toCamelCase, toSnakeCase } from "@/utils/caseConversion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function useRegister() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/sign-in`,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw new Error(error.message);
    },
    onError: (error) => {
      console.log("Error during registration:", error);
    },
  });
}

function useLogin() {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      router.push("/get-started");
    },
    onError: (error) => {
      console.log("Error during login:", error);
    },
  });
}

function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      router.push("/sign-in");
      queryClient.invalidateQueries({
        queryKey: ["userWorkspace"],
      });
    },
    onError: (error) => {
      console.log("Error during logout:", error);
    },
  });
}

function useGetSession() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });
  }, []);

  return {
    isAuthenticated: !!session,
    isLoading,
    user: session?.user,
  };
}

function useGetProfile() {
  const { user, isLoading: isUserLoading } = useGetSession();

  return useQuery({
    queryKey: queryKeys.profile.detail(),
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return toCamelCase<Profile>(data);
    },
    enabled: !!user && !isUserLoading,
  });
}

function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { user } = useGetSession();

  return useMutation({
    mutationFn: async (profileData: {
      firstName: string;
      lastName: string;
    }) => {
      const snakeCaseData = toSnakeCase(profileData);

      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update(snakeCaseData)
        .eq("id", user.id)
        .single();

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.detail() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.members.list(workspace?.id || ""),
      });
    },
    onError: (error) => {
      console.log("Error updating profile:", error);
    },
  });
}

export {
  useRegister,
  useLogin,
  useLogout,
  useGetSession,
  useGetProfile,
  useUpdateProfile,
};
