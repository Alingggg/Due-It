"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useModalContext from "@/hooks/Modal";

function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { openModal } = useModalContext();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("Form submitted");
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

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Email
            </label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <div className="text-right">
            <Button
              onClick={() => openModal("REQUEST_RESET_PASSWORD")}
              variant="link"
              className="pr-0 underline-offset-0 hover:no-underline focus:no-underline"
            >
              Forgot Password?
            </Button>
          </div>

          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading ? "Signing in..." : "Sign in"}
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
