"use client";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { FaUpload, FaLink, FaFile, FaTrash } from "react-icons/fa";
import { FiX } from "react-icons/fi";

export interface MaterialGroup {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  createdDate: string;
  materialCount?: number;
}

export interface Material {
  id: string;
  materialGroupId: string;
  fileName: string;
  fileSize?: number;
  fileType: string;
  downloadUrl: string;
  isLink: boolean;
}

interface UpsertMaterialModalProps {
  onClose: () => void;
  materialGroup?: MaterialGroup;
  materials?: Material[];
}

interface MaterialItem {
  id: string;
  fileName: string;
  isLink: boolean;
  url?: string;
  file?: File;
  fileSize?: number;
  fileType?: string;
}

const EMPTY_MATERIALS: Material[] = [];

function UpsertMaterialModal({
  onClose,
  materialGroup,
  materials: initialMaterials = EMPTY_MATERIALS,
}: UpsertMaterialModalProps) {
  const memoizedInitialMaterials = useMemo(
    () => initialMaterials,
    [initialMaterials]
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [tempLinkUrl, setTempLinkUrl] = useState("");
  const [tempLinkName, setTempLinkName] = useState("");

  const isEditing = !!materialGroup;

  useEffect(() => {
    if (materialGroup) {
      setTitle(materialGroup.title);
      setDescription(materialGroup.description);
      setMaterials(
        memoizedInitialMaterials.map((material) => ({
          id: material.id,
          fileName: material.fileName,
          isLink: material.isLink,
          url: material.isLink ? material.downloadUrl : undefined,
          fileSize: material.fileSize,
          fileType: material.fileType,
        }))
      );
    } else {
      setTitle("");
      setDescription("");
      setMaterials([]);
    }
    setTempLinkUrl("");
    setTempLinkName("");
  }, [materialGroup, memoizedInitialMaterials]);

  const handleShowFileUpload = () => {
    setShowFileUpload(true);
    setShowLinkInput(false);
  };

  const handleShowLinkInput = () => {
    setShowLinkInput(true);
    setShowFileUpload(false);
    setTempLinkUrl("");
    setTempLinkName("");
  };

  const handleFileSelect = (file: File) => {
    const newMaterial: MaterialItem = {
      id: `temp-${Date.now()}`,
      fileName: file.name,
      isLink: false,
      file,
      fileSize: file.size,
      fileType: file.type || "application/octet-stream",
    };
    setMaterials([...materials, newMaterial]);
    setShowFileUpload(false);
  };

  const handleAddLink = () => {
    if (!tempLinkName.trim() || !tempLinkUrl.trim()) {
      setErrors({
        ...errors,
        tempLink: "Both name and URL are required",
      });
      return;
    }

    try {
      new URL(tempLinkUrl);
    } catch {
      setErrors({
        ...errors,
        tempLink: "Please enter a valid URL",
      });
      return;
    }

    const newMaterial: MaterialItem = {
      id: `temp-${Date.now()}`,
      fileName: tempLinkName,
      isLink: true,
      url: tempLinkUrl,
    };
    setMaterials([...materials, newMaterial]);
    setShowLinkInput(false);
    setTempLinkUrl("");
    setTempLinkName("");

    // Clear temp link errors
    const newErrors = { ...errors };
    delete newErrors.tempLink;
    setErrors(newErrors);
  };

  const removeMaterial = (id: string) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  const updateMaterial = (id: string, updates: Partial<MaterialItem>) => {
    setMaterials(
      materials.map((material) =>
        material.id === id ? { ...material, ...updates } : material
      )
    );
    const newErrors = { ...errors };
    delete newErrors[`material-${id}-fileName`];
    delete newErrors[`material-${id}-url`];
    delete newErrors[`material-${id}-file`];
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (materials.length === 0)
      newErrors.materials = "At least one material is required";

    materials.forEach((material) => {
      if (!material.fileName.trim()) {
        newErrors[`material-${material.id}-fileName`] = "Name is required";
      }
      if (material.isLink) {
        if (!material.url?.trim()) {
          newErrors[`material-${material.id}-url`] = "URL is required";
        } else {
          try {
            new URL(material.url);
          } catch {
            newErrors[`material-${material.id}-url`] =
              "Please enter a valid URL";
          }
        }
      } else if (!isEditing && !material.file) {
        newErrors[`material-${material.id}-file`] = "Please select a file";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // UI only, no save
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to save material group. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) onClose();
  };

  return (
    <div className="bg-white rounded-lg max-w-4xl w-full p-4 sm:p-5 mx-4 max-h-[90vh] overflow-y-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
          {isEditing ? "Edit Material Group" : "Create Material Group"}
        </h3>
        <Button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
          variant="ghost"
          size="icon"
        >
          <FiX className="w-6 h-6" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Title *
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.title ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter material group title"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
              errors.description ? "border-red-500" : "border-slate-300"
            }`}
            placeholder="Enter material group description"
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Subject - Just display, not editable for now */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subject
            </label>
            <div className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50 text-slate-600">
              Subject Name (Not editable for now)
            </div>
          </div>
        )}

        {/* Add Material Section */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Add Materials *
          </label>
          {errors.materials && (
            <p className="mb-2 text-xs text-red-600">{errors.materials}</p>
          )}

          {/* Add Material Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3">
            <Button
              onClick={handleShowFileUpload}
              variant="outline"
              disabled={isSubmitting}
            >
              <FaFile className="w-4 h-4" />
              Upload File
            </Button>
            <Button
              onClick={handleShowLinkInput}
              variant="outline"
              disabled={isSubmitting}
            >
              <FaLink className="w-4 h-4" />
              Add Link
            </Button>
          </div>

          {/* File Upload Container */}
          {showFileUpload && (
            <div className="mb-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="text-center">
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileSelect(file);
                    }
                  }}
                  className="hidden"
                  id="file-upload"
                  disabled={isSubmitting}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer transition-colors hover:border-slate-400 hover:bg-slate-100"
                >
                  <FaUpload className="w-8 h-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600 mb-1">
                    Click to select file
                  </p>
                  <p className="text-xs text-slate-500">or drag and drop</p>
                </label>
              </div>
            </div>
          )}

          {/* Link Input Container */}
          {showLinkInput && (
            <div className="mb-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    Link Name *
                  </label>
                  <input
                    value={tempLinkName}
                    onChange={(e) => setTempLinkName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter link name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">
                    URL *
                  </label>
                  <input
                    value={tempLinkUrl}
                    onChange={(e) => setTempLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.tempLink && (
                  <p className="text-xs text-red-600">{errors.tempLink}</p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button onClick={handleAddLink}>Add Link</Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Materials List */}
        {materials.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Materials ({materials.length})
            </label>
            <div className="space-y-3">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="p-3 border border-slate-200 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-slate-700">
                      {material.isLink ? (
                        <>
                          <FaLink className="inline w-4 h-4 mr-2" />
                          {material.fileName}
                        </>
                      ) : (
                        <>
                          <FaFile className="inline w-4 h-4 mr-2" />
                          {material.fileName}
                        </>
                      )}
                    </h4>
                    <Button
                      onClick={() => removeMaterial(material.id)}
                      disabled={isSubmitting}
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      variant="ghost"
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Material Details */}
                  <div className="text-sm text-slate-600">
                    {material.isLink ? (
                      <div>
                        <strong>URL:</strong> {material.url}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {material.fileSize && (
                          <div>
                            <strong>Size:</strong>{" "}
                            {(material.fileSize / 1024 / 1024).toFixed(2)} MB
                          </div>
                        )}
                        {material.fileType && (
                          <div>
                            <strong>Type:</strong> {material.fileType}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Edit Material Name */}
                  {!material.isLink ? null : (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Name *
                      </label>
                      <input
                        value={material.fileName}
                        onChange={(e) =>
                          updateMaterial(material.id, {
                            fileName: e.target.value,
                          })
                        }
                        className={`w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`material-${material.id}-fileName`]
                            ? "border-red-500"
                            : "border-slate-300"
                        }`}
                        placeholder="Link name"
                        disabled={isSubmitting}
                      />
                      {errors[`material-${material.id}-fileName`] && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[`material-${material.id}-fileName`]}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Edit URL for links */}
                  {material.isLink && (
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        URL *
                      </label>
                      <input
                        value={material.url || ""}
                        onChange={(e) =>
                          updateMaterial(material.id, { url: e.target.value })
                        }
                        className={`w-full px-2 py-1.5 border rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`material-${material.id}-url`]
                            ? "border-red-500"
                            : "border-slate-300"
                        }`}
                        placeholder="https://example.com"
                        disabled={isSubmitting}
                      />
                      {errors[`material-${material.id}-url`] && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors[`material-${material.id}-url`]}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-200">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEditing ? "Updating..." : "Creating..."}</span>
              </>
            ) : (
              <>
                <FaUpload className="w-4 h-4" />
                <span>{isEditing ? "Update" : "Create"}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpsertMaterialModal;
