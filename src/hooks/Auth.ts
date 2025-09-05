import supabase from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

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

export { useRegister };
