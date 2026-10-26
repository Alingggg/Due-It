import { Button, Input, Label } from "@/components";
import { useRegister } from "@/hooks";
import { RegisterSchema } from "@/zod-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import * as z from "zod";

type FormValues = z.infer<typeof RegisterSchema>;

function SignUp() {
  const [registerError, setRegisterError] = useState<string | null>(null);
  const { mutate: registerAccount, isPending, isSuccess } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(RegisterSchema),
  });

  function onSubmit(data: FormValues) {
    registerAccount(data, {
      onError: (error: any) => {
        setRegisterError(
          error?.message || "Registration failed. Please try again."
        );
      },
    });
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-2 py-6 sm:p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-md text-center">
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
              <Link to="/sign-in">Continue to Sign In</Link>
            </Button>
            <p className="text-xs text-slate-500">
              Didn't receive the email? Check your spam folder or try signing up
              again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-2 py-6 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-xl sm:text-3xl font-bold text-blue-600 mb-2">
            Due It
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
            Create account
          </h2>

          {registerError && (
            <div className="mt-3 text-red-600 text-sm font-medium">
              {registerError}
            </div>
          )}
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
                autoComplete="given-name"
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
                autoComplete="family-name"
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

        <div className="text-center mt-4">
          <p className="text-slate-600 text-sm sm:text-base">
            Already have an account?{" "}
            <Button variant="link" className="pl-0" asChild>
              <Link to="/sign-in">Sign in</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
