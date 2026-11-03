import { Button, FormError, LoadingPage } from "@/components";
import {
  useDeleteMaterial,
  useDeleteMaterialGroup,
  useDialogContext,
  useDownloadMaterial,
  useGetMaterialGroup,
  useGetMaterials,
  useGetSubjects,
  useGetUserWorkspaceRole,
} from "@/hooks";
import type { Material } from "@/types";
import { formatFileSize } from "@/utils";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  Folder,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { useNavigate, useParams } from "react-router";

function MaterialDetails() {
  const navigate = useNavigate();
  const { materialGroupId } = useParams();
  const { openDialog } = useDialogContext();
  const { data: materialGroup, isLoading: isLoadingMaterialGroup } =
    useGetMaterialGroup(materialGroupId!);
  const { data: materials, isLoading: isLoadingMaterials } = useGetMaterials(
    materialGroupId!
  );
  const { data: subjects, isLoading: isLoadingSubject } = useGetSubjects(
    materialGroup?.semester
  );
  const currentUserRole = useGetUserWorkspaceRole();
  const { mutateAsync: deleteMaterialGroup } = useDeleteMaterialGroup();
  const {
    mutate: downloadMaterial,
    isPending: isDownloadingMaterial,
    error: downloadError,
  } = useDownloadMaterial();
  const { mutateAsync: deleteMaterial } = useDeleteMaterial();
  const canManage =
    currentUserRole === "admin" || currentUserRole === "co-admin";
  const isPageLoading =
    isLoadingMaterialGroup ||
    isLoadingMaterials ||
    isLoadingSubject;

  function handleOpenMaterial(material: Material) {
    if (material.isLink)
      window.open(material.url, "_blank", "noopener,noreferrer");
    else downloadMaterial(material);
  }

  function handleDeleteMaterial(material: Material) {
    openDialog("CONFIRM_ACTION", {
      title: `Delete "${material.name}"?`,
      description: `Are you sure you want to delete this material? This action cannot be undone.`,
      actionButtonVariant: "destructive",
      actionButtonText: "Delete",
      handleAction: () => deleteMaterial(material),
    });
  }

  if (isPageLoading)
    return <LoadingPage message="Loading material details..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button
          onClick={() => navigate(-1)}
          className="text-blue-600"
          variant="ghost"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
          Material Details
        </h1>
        {canManage && (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() =>
                openDialog("UPSERT_MATERIAL", { subjects, materialGroup })
              }
              variant="outline"
            >
              <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
              Edit
            </Button>
            <Button
              onClick={() =>
                openDialog("CONFIRM_ACTION", {
                  title: `Delete "${materialGroup?.title}"?`,
                  description: `Are you sure you want to delete "${materialGroup?.title}"? This will also delete all ${materialGroup?.materialCount} materials in this group. This action cannot be undone.`,
                  actionButtonVariant: "destructive",
                  actionButtonText: "Delete",
                  handleAction: () => deleteMaterialGroup(materialGroupId!),
                })
              }
              variant="destructive"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="p-3 sm:p-4 bg-blue-50 rounded-xl w-fit">
            <Folder className="w-6 h-6 sm:w-8 sm:h-8 fill-blue-600 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
              {materialGroup?.title}
            </h2>
            <div className="text-sm text-blue-600 mb-3 sm:mb-4">
              {materialGroup?.subjectName}
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-3 sm:mb-4">
              {materialGroup?.description}
            </p>
            <div className="flex items-center text-xs sm:text-sm text-slate-500">
              {materialGroup?.createdAt &&
                format(
                  new Date(materialGroup.createdAt.split(".")[0] + "Z"),
                  "MMMM d, yyyy"
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-semibold text-slate-800">
            Materials ({materials?.length})
          </h3>
          {canManage && (
            <Button
              onClick={() => openDialog("ADD_MATERIAL", { materialGroupId })}
              variant="outline"
            >
              <Plus className="w-4 h-4" />
              Add Material
            </Button>
          )}
        </div>

        <FormError error={downloadError} className="px-4 pt-4 sm:px-6" />

        <div className="divide-y divide-slate-100">
          {materials?.map((material) => (
            <div
              key={material.id}
              className="p-4 sm:p-6 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium text-slate-800 mb-2">
                    {material.name}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500">
                    {material.isLink ? (
                      <span>External Link</span>
                    ) : (
                      <>
                        <span>{formatFileSize(material.size || 0)}</span>
                        <span className="capitalize">
                          {material?.type
                            ?.split("/")[1]
                            ?.replace(
                              "vnd.openxmlformats-officedocument.",
                              ""
                            ) || "File"}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between sm:justify-start sm:gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => handleOpenMaterial(material)}
                    variant="outline"
                    disabled={isDownloadingMaterial}
                  >
                    {material.isLink ? (
                      <>
                        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                        Open
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                        Download
                      </>
                    )}
                  </Button>
                  {canManage && (
                    <Button
                      onClick={() => handleDeleteMaterial(material)}
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-600 hover:bg-red-50"
                      aria-label="Delete material"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {materials?.length === 0 && (
          <div className="p-8 sm:p-12 text-center">
            <div className="text-slate-400 mb-4">
              <Folder className="w-10 h-10 sm:w-12 sm:h-12 mx-auto" />
            </div>
            <h4 className="text-base sm:text-lg font-medium text-slate-800">
              No materials yet
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}

export default MaterialDetails;
