"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import useDialogContext from "@/hooks/Dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/zod-schema/Auth";
import * as z from "zod";
import { useLogin } from "@/hooks/Auth";
import { useForm } from "react-hook-form";

type FormData = z.infer<typeof LoginSchema>;

function SignIn() {
  const { openDialog } = useDialogContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(LoginSchema) });
  const { mutate, isPending } = useLogin();

  function onSubmit(data: FormData) {
    mutate(data);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-2 py-6 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-md">
        <div className="text-center mb-4 sm:mb-7">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            Due It
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Enter your email"
              disabled={isPending}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Enter your password"
              disabled={isPending}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right">
            <Button
              onClick={() => openDialog("REQUEST_RESET_PASSWORD")}
              variant="link"
              className="pr-0 underline-offset-0 hover:no-underline focus:no-underline"
            >
              Forgot Password?
            </Button>
          </div>

          <Button disabled={isPending} className="w-full" type="submit">
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center mt-5 sm:mt-6">
          <p className="text-slate-600 text-sm sm:text-base">
            Don't have an account?{" "}
            <Button variant="link" className="pl-0" asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
