"use client";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
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
            <button
              type="button"
              onClick={() => openModal("REQUEST_RESET_PASSWORD")}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition-colors hover:cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-3"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="text-center mt-5 sm:mt-6">
          <p className="text-slate-600 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
