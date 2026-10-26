import { Button, Label, Input } from "@/components";
import { useDialogContext, useLogin } from "@/hooks";
import { LoginSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import * as z from "zod";

type FormData = z.infer<typeof LoginSchema>;

function SignIn() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const { openDialog } = useDialogContext();
  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(LoginSchema) });

  function onSubmit(data: FormData) {
    setLoginError(null);
    login(data, {
      onError: (err: any) => {
        setLoginError(err?.message || "Login failed. Please try again.");
      },
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-2 py-6 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
            Due It
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Sign in to your account
          </p>

          {loginError && (
            <div className="mt-3 text-red-600 text-sm font-medium">
              {loginError}
            </div>
          )}
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
              <Link to="/sign-up">Sign up</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
