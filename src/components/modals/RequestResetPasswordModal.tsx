"use client";
import { useState } from "react";
import { Input, Button } from "@/components";
import { FiX } from "react-icons/fi";

interface Props {
  onClose: () => void;
}

function RequestResetPasswordModal({ onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-6 w-full max-w-xs sm:max-w-sm mx-auto relative">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Close"
      >
        <FiX className="w-6 h-6" />
      </button>
      <h2 className="text-lg font-semibold text-slate-800 mb-2">
        {submitted ? "Check Your Email" : "Request Password Reset"}
      </h2>
      {submitted ? (
        <div className="mb-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
            <svg
              className="w-6 h-6 text-green-600"
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
          <p className="text-sm text-slate-700 text-center mb-2">
            We've sent a password reset link to your email address.
          </p>
          <p className="text-xs text-slate-500 text-center">
            Please check your inbox and follow the instructions to reset your
            password. Don't forget to check your spam folder if you don't see it
            within a few minutes.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-600 mb-4">
            Enter your email address and we'll send you a link to renew your
            password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Your email" />
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Send Reset Link
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

export default RequestResetPasswordModal;
