"use client";
import { useState } from "react";
import { Check, Copy, RefreshCcw, UserMinus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDialogContext from "@/hooks/Dialog";
import {
  useUpdateDefaultSemester,
  useGetDefaultSemester,
  useGetUserWorkspaceRole,
  useGetUserWorkspace,
} from "@/hooks/Workspace";
import { useUpdateCodeStatus, useGetCode, useRenewCode } from "@/hooks/Code";
import LoadingPage from "@/components/LoadingPage";

const SEMESTER_OPTIONS = [
  { value: 1, label: "1" },
  { value: 2, label: "2" },
];

function WorkspaceSettingsPage() {
  const [copied, setCopied] = useState(false);
  const { data: workspace, isLoading: isWorkspaceLoading } =
    useGetUserWorkspace();
  const workspaceId = workspace?.id!;
  const { data: codeData, isLoading: isCodeLoading } = useGetCode();
  const { data: defaultSemester, isLoading: isDefaultSemesterLoading } =
    useGetDefaultSemester();
  const { data: currentUserRole, isLoading: isCurrentUserRoleLoading } =
    useGetUserWorkspaceRole(workspaceId);
  const { mutate: renewCode, isPending: isRenewingCode } = useRenewCode();
  const { mutate: updateCodeStatus, isPending: isUpdatingCodeStatus } =
    useUpdateCodeStatus();
  const {
    mutate: updateDefaultSemester,
    isPending: isUpdatingDefaultSemester,
  } = useUpdateDefaultSemester();
  const { openDialog, closeDialog } = useDialogContext();
  const isAdmin = currentUserRole === "admin";
  const isPageLoading =
    isWorkspaceLoading ||
    isCodeLoading ||
    isDefaultSemesterLoading ||
    isCurrentUserRoleLoading;

  function handleCopyCode() {
    if (codeData?.code) {
      navigator.clipboard.writeText(codeData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleToggleInviteCode() {
    updateCodeStatus({ workspaceId, enable: !codeData?.enabled });
  }

  function handleRenewCode() {
    renewCode(workspaceId);
  }

  function handleDefaultSemesterChange(value: string) {
    const newSemester = Number(value) as 1 | 2;
    updateDefaultSemester({ workspaceId, semester: newSemester });
  }

  if (isPageLoading) {
    return <LoadingPage message="Loading workspace settings..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-slate-800">
          Workspace Settings
        </h1>
      </div>

      {/* Invite Code Section - Show to everyone */}
      {codeData && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
            Invite Code
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {/* Code Display */}
            <div className="flex items-center justify-between p-2 sm:p-4 bg-slate-50 rounded-lg border">
              <div className="font-mono text-sm sm:text-base break-all">
                {codeData.code}
              </div>

              <div className="relative group">
                <Button onClick={handleCopyCode} variant="ghost">
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {copied ? "Copied!" : "Copy"}
                </div>
              </div>
            </div>

            {/* Last Changed - Only show to admins */}
            {isAdmin && codeData.updatedAt && (
              <div className="text-xs text-slate-500">
                Last changed: {new Date(codeData.updatedAt).toLocaleString()}
              </div>
            )}

            {/* Status and Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-1 sm:space-y-0">
              <div className="space-y-1">
                {/* Status row */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-xs sm:text-sm font-medium text-slate-700">
                    Status:
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      codeData.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {codeData.enabled ? "Active" : "Disabled"}
                  </span>
                </div>
                {/* Subtle disabled message - directly under status */}
                {!codeData.enabled && (
                  <span className="block text-xs text-slate-500 mt-1">
                    New members cannot join using this code
                  </span>
                )}
              </div>

              {/* Buttons row - Only for admins */}
              {isAdmin && (
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <Button
                    onClick={handleToggleInviteCode}
                    variant="outline"
                    className={`${
                      codeData.enabled
                        ? "border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                        : "border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                    }`}
                    disabled={isUpdatingCodeStatus}
                  >
                    {codeData.enabled ? "Disable" : "Enable"}
                  </Button>

                  <Button
                    onClick={handleRenewCode}
                    variant="outline"
                    disabled={isRenewingCode}
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Renew
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Semester Section - Only for admins */}
      {isAdmin && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
            Semester
          </h2>

          <div className="space-y-3">
            <p className="text-xs sm:text-sm text-slate-600">
              Choose which semester will be selected by default when members
              visit this workspace.
            </p>

            <div className="flex items-center space-x-3">
              <Label
                htmlFor="default-semester"
                className="text-sm font-medium text-slate-700"
              >
                Default:
              </Label>
              <Select
                value={defaultSemester?.toString()}
                onValueChange={handleDefaultSemesterChange}
              >
                <SelectTrigger
                  id="default-semester"
                  className="w-24"
                  disabled={isUpdatingDefaultSemester}
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTER_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Leave Workspace Section - Only for non-admin members */}
      {currentUserRole !== "admin" && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 pr-0 sm:pr-6">
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-1 sm:mb-2">
                Leave Workspace
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                If you leave this workspace, you'll lose access to all tasks,
                materials, and discussions. You can rejoin at any time using a
                valid invite code.
              </p>
            </div>

            <Button
              onClick={() =>
                openDialog("CONFIRM_ACTION", {
                  title: "Leave Workspace?",
                  description:
                    "Are you sure you want to leave this workspace? You will lose access to all its content. You can rejoin at any time using a valid invite code.",
                  actionButtonVariant: "destructive",
                  actionButtonText: "Leave",
                  handleAction: closeDialog,
                })
              }
              variant="destructive"
            >
              <UserMinus className="w-4 h-4" />
              Leave
            </Button>
          </div>
        </div>
      )}

      {/* Delete Workspace Section - Only for admins */}
      {isAdmin && (
        <div className="bg-white rounded-lg border border-red-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 pr-0 sm:pr-6">
              <h3 className="text-base sm:text-lg font-semibold text-red-800 mb-1 sm:mb-2">
                Delete Workspace
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Permanently delete this workspace and all its data including
                tasks, materials, discussions, and member information. This
                action cannot be undone.
              </p>
            </div>

            <Button
              onClick={() =>
                openDialog("CONFIRM_DELETE_WORKSPACE", {
                  workspaceName: workspace?.name,
                })
              }
              variant="destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete Workspace
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceSettingsPage;
