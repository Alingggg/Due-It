"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Button } from "@/components";

function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-2 py-6">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 w-full max-w-xs sm:max-w-md">
        <div className="text-center mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-blue-600 mb-2">
            {submitted ? "Password Reset Successful" : "Reset Password"}
          </h1>
          {!submitted && (
            <p className="text-base sm:text-lg text-slate-600">
              Enter your new password below.
            </p>
          )}
        </div>
        {submitted ? (
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-slate-700 mb-6 text-base sm:text-lg">
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <Button
              onClick={() => router.push("/sign-in")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            >
              Go to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-base sm:text-base font-medium text-slate-700 mb-2"
              >
                New Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                className="h-12 sm:h-12"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-base sm:text-base font-medium text-slate-700 mb-2"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className="h-12 sm:h-12"
              />
            </div>
            <Button
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 h-12 sm:h-12"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
