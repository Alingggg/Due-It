"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLogout } from "@/hooks/Auth";
import useDialogContext from "@/hooks/Dialog";
import { useJoinWorkspace } from "@/hooks/Workspace";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { codeSchema } from "@/zod-schema/Code";
import { zodResolver } from "@hookform/resolvers/zod";

type JoinWorkspaceForm = z.infer<typeof codeSchema>;

function GetStarted() {
  const { openDialog } = useDialogContext();
  const { mutate: logout } = useLogout();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<JoinWorkspaceForm>({ resolver: zodResolver(codeSchema) });
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();

  function onSubmit({ code }: { code: string }) {
    clearErrors("code");
    joinWorkspace(code, {
      onError: (error: any) => {
        setError("code", {
          message: error.message || "Failed to join workspace",
        });
      },
    });
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
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="joinCode">Workspace Code</Label>
              <Input
                {...register("code")}
                id="joinCode"
                type="text"
                placeholder="Enter workspace code"
              />
              {errors.code && (
                <p className="text-red-500 text-xs">{errors.code.message}</p>
              )}
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Joining..." : "Join Workspace"}
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
            onClick={() => openDialog("CREATE_WORKSPACE")}
            variant="outline"
            className="w-full"
          >
            Create New Workspace
          </Button>
        </div>

        <div className="pt-3 border-t border-slate-200">
          <Button
            onClick={() => logout()}
            variant="outline"
            className="w-full text-red-600 border-red-600 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
