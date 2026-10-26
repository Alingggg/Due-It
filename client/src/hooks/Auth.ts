import { useGetUserWorkspace } from "@/hooks";
import { queryKeys, supabase } from "@/lib";
import type { Profile } from "@/types";
import { toCamelCase } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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
      const { data, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (fetchError) throw new Error(fetchError.message);

      if (data?.id) throw new Error("Email already registered");

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${import.meta.env.VITE_FRONTEND_URL}/sign-in`,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (signUpError) throw new Error(signUpError.message);
    },
    onError: (error) => {
      console.log("Error during registration:", error);
    },
  });
}

function useLogin() {
  const navigate = useNavigate();
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
      navigate("/get-started");
    },
    onError: (error) => {
      console.log("Error during login:", error);
    },
  });
}

function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      navigate("/sign-in");
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
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
        })
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
