import supabase from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "next/navigation";

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
      redirect("/get-started");
    },
  });
}

export { useRegister, useLogin };
