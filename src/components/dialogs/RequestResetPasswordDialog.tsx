"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

function RequestResetPasswordDialog({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="text-slate-800">
          {submitted ? "Check Your Email" : "Request Password Reset"}
        </DialogTitle>
        {submitted ? (
          <div>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-slate-700 text-center mb-2">
              We've sent a password reset link to your email address.
            </p>
            <p className="text-xs text-slate-500 text-center">
              Please check your inbox and follow the instructions to reset your
              password. Don't forget to check your spam folder if you don't see
              it within a few minutes.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-600">
              Enter your email address and we'll send you a link to renew your
              password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input placeholder="Your email" />
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RequestResetPasswordDialog;
