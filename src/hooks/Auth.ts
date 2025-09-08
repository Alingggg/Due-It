"use client";
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

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
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

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      router.push("/get-started");
    },
  });
}

function useLogout() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      router.push("/sign-in");
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
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .single();

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return toCamelCase<Profile>(data);
    },
  });
}

function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: {
      firstName: string;
      lastName: string;
    }) => {
      const snakeCaseData = toSnakeCase(profileData);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("profiles")
        .update(snakeCaseData)
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["workspaceMembers"] });
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
