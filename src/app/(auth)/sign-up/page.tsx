"use client";
import { useState } from "react";
import Input from "@/components/Input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("Form submitted");
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

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                First Name
              </label>
              <Input id="firstName" type="text" placeholder="First name" />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Last Name
              </label>
              <Input id="lastName" type="text" placeholder="Last name" />
            </div>
          </div>

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
              placeholder="Create a password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
            />
          </div>

          <Button disabled={isLoading} className="w-full">
            {isLoading ? "Creating account..." : "Create account"}
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
