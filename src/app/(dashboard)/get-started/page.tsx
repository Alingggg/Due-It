"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function GetStarted() {
  const [isLoading, setIsLoading] = useState(false);

  function handleJoinWithCode(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    console.log("Joining workspace");

    setTimeout(() => setIsLoading(false), 2000);
  }

  function handleCreateWorkspace() {
    console.log("Creating new workspace");
  }

  function handleLogout() {
    console.log("Logging out");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-2 py-6 sm:p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-xs sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-blue-600 mb-2">
            Due It
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
            Get Started
          </h2>
        </div>

        <div className="mb-5 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
            Join a Workspace
          </h3>
          <form
            onSubmit={handleJoinWithCode}
            className="space-y-3 sm:space-y-4"
          >
            <div>
              <label
                htmlFor="joinCode"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Workspace Code
              </label>
              <Input
                id="joinCode"
                type="text"
                placeholder="Enter workspace code"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Joining..." : "Join Workspace"}
            </Button>
          </form>
        </div>

        <div className="flex items-center my-5 sm:my-6">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 sm:px-4 text-xs sm:text-sm text-slate-500">
            or
          </span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <div className="mb-5 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2 sm:mb-3">
            Create a Workspace
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
            Start fresh with your own workspace and invite others to join.
          </p>
          <Button
            onClick={handleCreateWorkspace}
            variant="outline"
            className="w-full"
          >
            Create New Workspace
          </Button>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full text-red-600 border-red-300 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
