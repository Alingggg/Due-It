"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/zod-schema/Auth";
import * as z from "zod";
import { useRegister } from "@/hooks/Auth";
import { CheckCircle } from "lucide-react";

type FormValues = z.infer<typeof registerSchema>;

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
  });
  const { mutate, isPending, isSuccess } = useRegister();

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-2 py-6 sm:p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              Check your email
            </h1>
            <p className="text-slate-600 text-sm sm:text-base mb-6">
              We've sent you a confirmation link to verify your account. Please
              check your email and click the link to complete your registration.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/sign-in">Continue to Sign In</Link>
              </Button>
              <p className="text-xs text-slate-500">
                Didn't receive the email? Check your spam folder or try signing
                up again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-2 py-6 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-md">
        <div className="text-center mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-blue-600 mb-2">
            Due It
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
            Create account
          </h2>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                {...register("firstName")}
                id="firstName"
                type="text"
                placeholder="First name"
                disabled={isPending}
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                {...register("lastName")}
                id="lastName"
                type="text"
                placeholder="Last name"
                disabled={isPending}
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

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
              placeholder="Create a password"
              disabled={isPending}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              {...register("confirmPassword")}
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              disabled={isPending}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button disabled={isPending} className="w-full" type="submit">
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <div className="text-center mt-5 sm:mt-6">
          <p className="text-slate-600 text-sm sm:text-base">
            Already have an account?{" "}
            <Button variant="link" className="pl-0" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
