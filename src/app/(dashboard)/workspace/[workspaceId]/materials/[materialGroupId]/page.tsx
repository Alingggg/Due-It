"use client";
import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  getMaterialGroupById,
  getMaterialsByGroupId,
  getSubjectById,
  formatFileSize,
  canManageWorkspace,
} from "@/data/mockData";
import { Button } from "@/components";
import {
  FaArrowLeft,
  FaDownload,
  FaFolder,
  FaTrash,
  FaEdit,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { format } from "date-fns";

interface MaterialGroupDetailsPageProps {
  params: Promise<{
    workspaceId: string;
    materialGroupId: string;
  }>;
}

function MaterialGroupDetailsPage({ params }: MaterialGroupDetailsPageProps) {
  const { workspaceId, materialGroupId } = use(params);
  const router = useRouter();
  const materialGroup = getMaterialGroupById(materialGroupId);
  const materials = getMaterialsByGroupId(materialGroupId);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!materialGroup) {
    notFound();
  }

  const subject = getSubjectById(materialGroup.subjectId);
  const canManage = canManageWorkspace(workspaceId);

  const handleOpenMaterial = (material: any) => {
    // For both files and links, open in new tab
    window.open(material.downloadUrl, "_blank");
  };

  const handleDelete = () => {
    // In a real app, this would delete from Supabase and update state
    console.log("Deleting material group:", materialGroup.id);
    setShowDeleteConfirm(false);
    router.push(`/workspace/${workspaceId}/materials`);
  };

  const handleEdit = () => {
    // Navigate to edit page (to be implemented)
    console.log("Edit material group:", materialGroup.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button Row */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors hover:cursor-pointer"
        >
          <FaArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Material Details
        </h1>
        {canManage && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              className="space-x-2"
            >
              <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Edit</span>
            </Button>
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 hover:bg-red-700 text-white space-x-2"
            >
              <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Delete</span>
            </Button>
          </div>
        )}
      </div>

      {/* Material Group Info */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-xl w-fit">
            <FaFolder className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              {materialGroup.title}
            </h2>
            <div className="text-sm text-blue-600 mb-3 sm:mb-4">
              {subject?.name}
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-3 sm:mb-4">
              {materialGroup.description}
            </p>
            <div className="flex items-center text-xs sm:text-sm text-slate-500">
              {format(new Date(materialGroup.createdDate), "MMMM d, yyyy")}
            </div>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800">
            Materials ({materials.length})
          </h3>
        </div>

        {/* Materials List */}
        <div className="divide-y divide-slate-100">
          {materials.map((material) => (
            <div
              key={material.id}
              className="p-4 sm:p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium text-slate-800 mb-2">
                    {material.fileName}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500">
                    {material.isLink ? (
                      <>
                        <span className="capitalize">
                          {material.fileType.replace("link/", "")}
                        </span>
                        <span>External Link</span>
                      </>
                    ) : (
                      <>
                        <span>{formatFileSize(material.fileSize || 0)}</span>
                        <span className="capitalize">
                          {material.fileType
                            .split("/")[1]
                            ?.replace(
                              "vnd.openxmlformats-officedocument.",
                              ""
                            ) || "File"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => handleOpenMaterial(material)}
                  variant="outline"
                  className="flex items-center justify-center space-x-2 text-xs sm:text-sm px-3 py-2 w-full sm:w-auto"
                >
                  {material.isLink ? (
                    <>
                      <FaExternalLinkAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Open</span>
                    </>
                  ) : (
                    <>
                      <FaDownload className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Download</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Materials State */}
        {materials.length === 0 && (
          <div className="p-8 sm:p-12 text-center">
            <div className="text-slate-400 mb-4">
              <FaFolder className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
            </div>
            <h4 className="text-base sm:text-lg font-medium text-slate-800 mb-2">
              No materials yet
            </h4>
            <p className="text-sm sm:text-base text-slate-600 max-w-sm mx-auto">
              This material group doesn't have any files or links uploaded yet.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 mx-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">
              Delete Material Group?
            </h3>
            <p className="text-sm text-slate-600 mb-4 sm:mb-6">
              Are you sure you want to delete "{materialGroup.title}"? This will
              also delete all {materials.length} materials in this group. This
              action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="text-sm px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center space-x-2 text-sm px-4 py-2"
              >
                <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Delete Group</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MaterialGroupDetailsPage;
