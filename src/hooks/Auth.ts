"use client";
import supabase from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
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
            firstName,
            lastName,
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

function useSession() {
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
    user: session?.user || null,
  };
}

export { useRegister, useLogin, useLogout, useSession };
