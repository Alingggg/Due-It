"use client";
import { useState } from "react";
import {
  getInviteCodeByWorkspaceId,
  getCurrentUserRole,
  canManageWorkspace,
  generateNewInviteCode,
  mockInviteCodes,
} from "@/data/mockData";
import { Check, Copy, RefreshCcw, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import useDialogContext from "@/hooks/Dialog";

function WorkspaceSettingsPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [inviteCode, setInviteCode] = useState(
    getInviteCodeByWorkspaceId(workspaceId)
  );
  const [copied, setCopied] = useState(false);
  const { openDialog } = useDialogContext();

  // Get current values each render to handle temporary role changes
  const userRole = getCurrentUserRole(workspaceId);
  const canManage = canManageWorkspace(workspaceId);

  // Handle copying invite code
  const handleCopyCode = async () => {
    if (inviteCode?.code) {
      await navigator.clipboard.writeText(inviteCode.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle enabling/disabling invite code
  const handleToggleInviteCode = () => {
    if (inviteCode && canManage) {
      const updatedCode = {
        ...inviteCode,
        enabled: !inviteCode.enabled,
        updatedAt: new Date().toISOString(),
      };
      setInviteCode(updatedCode);

      // Update mock data
      const index = mockInviteCodes.findIndex(
        (code) => code.id === inviteCode.id
      );
      if (index !== -1) {
        mockInviteCodes[index] = updatedCode;
      }
    }
  };

  // Handle renewing invite code
  const handleRenewCode = () => {
    if (inviteCode && canManage) {
      const newCode = generateNewInviteCode();
      const updatedCode = {
        ...inviteCode,
        code: newCode,
        updatedAt: new Date().toISOString(),
      };
      setInviteCode(updatedCode);

      // Update mock data
      const index = mockInviteCodes.findIndex(
        (code) => code.id === inviteCode.id
      );
      if (index !== -1) {
        mockInviteCodes[index] = updatedCode;
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0">
      <div className="flex items-center justify-between">
        <h1 className="text-lg sm:text-2xl font-bold text-slate-800">
          Workspace Settings
        </h1>
      </div>

      {/* Invite Code Section - Only for admins and co-admins */}
      {canManage && inviteCode && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">
            Invite Code
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {/* Code Display */}
            <div className="flex items-center justify-between p-2 sm:p-4 bg-slate-50 rounded-lg border">
              <div className="font-mono text-sm sm:text-base break-all">
                {inviteCode.code}
              </div>

              <div className="relative">
                <Button
                  onClick={handleCopyCode}
                  variant="ghost"
                  title={copied ? "Copied!" : "Copy"}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {copied ? "Copied!" : "Copy"}
                </div>
              </div>
            </div>

            {/* Last Changed */}
            {inviteCode.updatedAt && (
              <div className="text-xs text-slate-500">
                Last changed: {new Date(inviteCode.updatedAt).toLocaleString()}
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
                      inviteCode.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {inviteCode.enabled ? "Active" : "Disabled"}
                  </span>
                </div>
                {/* Subtle disabled message - directly under status */}
                {!inviteCode.enabled && (
                  <span className="block text-xs text-slate-500 mt-1">
                    New members cannot join using this code
                  </span>
                )}
              </div>

              {/* Buttons row */}
              {canManage && (
                <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                  <Button
                    onClick={handleToggleInviteCode}
                    variant="outline"
                    className={`${
                      inviteCode.enabled
                        ? "border-red-600 text-red-700 bg-red-50 hover:bg-red-100 hover:text-red-900"
                        : "border-green-600 text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-900"
                    }`}
                  >
                    {inviteCode.enabled ? "Disable" : "Enable"}
                  </Button>

                  <Button onClick={handleRenewCode} variant="outline">
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Renew
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leave Workspace Section - Only for non-admin members */}
      {userRole !== "admin" && (
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
              onClick={() => openDialog("LEAVE_WORKSPACE")}
              variant="destructive"
            >
              <UserMinus className="w-4 h-4" />
              Leave
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceSettingsPage;
