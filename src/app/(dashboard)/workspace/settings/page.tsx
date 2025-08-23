"use client";
import { useState } from "react";
import {
  getInviteCodeByWorkspaceId,
  getCurrentUserRole,
  canManageWorkspace,
  currentUser,
  generateNewInviteCode,
  mockWorkspaceMembers,
  mockInviteCodes,
} from "@/data/mockData";
import { FaUserTimes, FaCheck } from "react-icons/fa";
import { FiCopy, FiRefreshCw } from "react-icons/fi";
import { Button } from "@/components";

function WorkspaceSettingsPage() {
  const workspaceId = "1"; // Hardcoded for now
  const [inviteCode, setInviteCode] = useState(
    getInviteCodeByWorkspaceId(workspaceId)
  );
  const [copied, setCopied] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);

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

  // Handle leaving workspace
  const handleLeaveWorkspace = () => {
    // Remove current user from workspace members
    const index = mockWorkspaceMembers.findIndex(
      (member) =>
        member.workspaceId === workspaceId && member.userId === currentUser.id
    );
    if (index !== -1) {
      mockWorkspaceMembers.splice(index, 1);
    }

    // In a real app, you would redirect to workspace selection or dashboard
    console.log("Left workspace");
    setShowLeaveConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Workspace Settings
        </h1>
      </div>

      {/* Invite Code Section - Only for admins and co-admins */}
      {canManage && inviteCode && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Invite Code
          </h2>

          <div className="space-y-4">
            {/* Code Display */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border">
              <div className="font-mono text-base">{inviteCode.code}</div>

              <div className="relative">
                <button
                  onClick={handleCopyCode}
                  className="p-2 text-slate-500 hover:text-slate-700 transition-colors group"
                  title={copied ? "Copied!" : "Copy"}
                >
                  {copied ? (
                    <FaCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <FiCopy className="w-4 h-4" />
                  )}
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {copied ? "Copied!" : "Copy"}
                </div>
              </div>
            </div>

            {/* Status and Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-slate-700">
                    Status:
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      inviteCode.enabled
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {inviteCode.enabled ? "Active" : "Disabled"}
                  </span>
                </div>

                {canManage && (
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={handleToggleInviteCode}
                      variant="outline"
                      className={`text-sm border ${
                        inviteCode.enabled
                          ? "border-red-600 text-red-700 bg-red-50 hover:bg-red-100"
                          : "border-green-600 text-green-700 bg-green-50 hover:bg-green-100"
                      }`}
                    >
                      {inviteCode.enabled ? "Disable" : "Enable"}
                    </Button>

                    <Button
                      onClick={handleRenewCode}
                      variant="outline"
                      className="text-sm flex items-center space-x-1.5"
                    >
                      <FiRefreshCw className="w-3.5 h-3.5" />
                      <span>Renew</span>
                    </Button>
                  </div>
                )}
              </div>

              {/* Subtle disabled message */}
              {!inviteCode.enabled && (
                <p className="text-xs text-slate-500">
                  New members cannot join using this code
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Leave Workspace Section - Only for non-admin members */}
      {userRole !== "admin" && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 pr-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Leave Workspace
              </h3>
              <p className="text-sm text-slate-600">
                If you leave this workspace, you'll lose access to all tasks,
                materials, and discussions. You can rejoin at any time using a
                valid invite code.
              </p>
            </div>

            <Button
              onClick={() => setShowLeaveConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 flex-shrink-0"
            >
              <FaUserTimes className="w-4 h-4" />
              <span>Leave</span>
            </Button>
          </div>
        </div>
      )}

      {/* Leave Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Leave Workspace?
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to leave this workspace? You will lose
              access to all its content. You can rejoin later using a valid
              invite code if joining is enabled.
            </p>

            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowLeaveConfirm(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLeaveWorkspace}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
              >
                <FaUserTimes className="w-4 h-4" />
                <span>Leave Workspace</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkspaceSettingsPage;
