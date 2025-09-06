"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Link as LucideLink,
  File as LucideFile,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface MaterialItem {
  id: string;
  fileName: string;
  isLink: boolean;
  url?: string;
  file?: File;
  fileSize?: number;
  fileType?: string;
}

interface AddMaterialDialogProps {
  onClose: () => void;
  materialGroupId: string;
}

function AddMaterialDialog({
  onClose,
  materialGroupId,
}: AddMaterialDialogProps) {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [tempLinkUrl, setTempLinkUrl] = useState("");
  const [tempLinkName, setTempLinkName] = useState("");

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
      let urlToValidate = tempLinkUrl;

      // Only add protocol if none is present
      if (!/^https?:\/\//i.test(tempLinkUrl)) {
        urlToValidate = `https://${tempLinkUrl}`;
      }

      const url = new URL(urlToValidate);

      // Basic validation - ensure it has a valid hostname
      if (!url.hostname || url.hostname === "localhost") {
        throw new Error("Invalid hostname");
      }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (materials.length === 0) {
      newErrors.materials = "At least one material is required";
    }

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
      } else if (!material.file) {
        newErrors[`material-${material.id}-file`] = "Please select a file";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      // Add materials to materialGroupId
      console.log("Adding materials to group:", materialGroupId, materials);
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to add materials. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">Add Materials</DialogTitle>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Add Material Section */}
          <div className="space-y-2">
            <Label>
              Add Materials <span className="text-red-500">*</span>
            </Label>
            {errors.materials && (
              <p className="mb-2 text-xs text-red-600">{errors.materials}</p>
            )}

            {/* Add Material Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3">
              <Button
                onClick={handleShowFileUpload}
                variant="outline"
                disabled={isSubmitting}
                type="button"
              >
                <LucideFile className="w-4 h-4" />
                Upload File
              </Button>
              <Button
                onClick={handleShowLinkInput}
                variant="outline"
                disabled={isSubmitting}
                type="button"
              >
                <LucideLink className="w-4 h-4" />
                Add Link
              </Button>
            </div>

            {/* File Upload Container */}
            {showFileUpload && (
              <div className="mb-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="text-center">
                  <Input
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
                  <Label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer transition-colors hover:border-slate-400 hover:bg-slate-100"
                  >
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600 mb-1">
                      Click to select file
                    </p>
                    <p className="text-xs text-slate-500">or drag and drop</p>
                  </Label>
                </div>
              </div>
            )}

            {/* Link Input Container */}
            {showLinkInput && (
              <div className="mb-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                <div className="space-y-2">
                  <div className="space-y-2">
                    <Label>
                      Link Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={tempLinkName}
                      onChange={(e) => setTempLinkName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter link name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
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
                    <Button onClick={handleAddLink} type="button">
                      Add Link
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Materials List */}
          {materials.length > 0 && (
            <div className="space-y-2">
              <Label>Materials ({materials.length})</Label>
              <div className="space-y-3">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="p-3 border border-slate-200 rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-medium text-slate-700 break-words min-w-0 flex-1">
                        <>
                          {material.isLink ? (
                            <LucideLink className="inline w-4 h-4 mr-2 flex-shrink-0" />
                          ) : (
                            <LucideFile className="inline w-4 h-4 mr-2 flex-shrink-0" />
                          )}
                          <span className="break-all">{material.fileName}</span>
                        </>
                      </h4>
                      <Button
                        onClick={() => removeMaterial(material.id)}
                        disabled={isSubmitting}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 flex-shrink-0"
                        variant="ghost"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Material Details */}
                    <div className="text-sm text-slate-600">
                      {material.isLink ? (
                        <div className="break-all">
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
            <Button
              onClick={onClose}
              variant="outline"
              disabled={isSubmitting}
              type="button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Add Materials</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddMaterialDialog;
