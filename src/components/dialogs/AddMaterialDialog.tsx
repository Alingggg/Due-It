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
import { useFieldArray, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddMaterials } from "@/hooks/Material";
import { MaterialsSchema } from "@/zod-schema/Material";

type FormValues = z.infer<typeof MaterialsSchema>;

interface AddMaterialDialogProps {
  onClose: () => void;
  materialGroupId: string;
}

function AddMaterialDialog({
  onClose,
  materialGroupId,
}: AddMaterialDialogProps) {
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [tempLinkUrl, setTempLinkUrl] = useState("");
  const [tempLinkName, setTempLinkName] = useState("");
  const [urlError, setUrlError] = useState("");
  const [fileMap, setFileMap] = useState<Map<number, File>>(new Map());
  const { mutate: addMaterials, isPending: isAddingMaterials } =
    useAddMaterials();

  const form = useForm<FormValues>({
    defaultValues: {
      files: [],
      links: [],
    },
    resolver: zodResolver(MaterialsSchema),
  });

  const {
    fields: materialFields,
    append: appendMaterial,
    remove: removeMaterial,
  } = useFieldArray({
    control: form.control,
    name: "files",
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const materials = form.watch("files");
  const links = form.watch("links");

  function validateAndFormatUrl(url: string): {
    isValid: boolean;
    formattedUrl: string;
    error: string;
  } {
    if (!url.trim()) {
      return { isValid: false, formattedUrl: "", error: "URL is required" };
    }

    let formattedUrl = url.trim();

    if (formattedUrl.includes(" ")) {
      return {
        isValid: false,
        formattedUrl: "",
        error: "Please enter a valid URL",
      };
    }

    if (
      !formattedUrl.startsWith("http://") &&
      !formattedUrl.startsWith("https://")
    ) {
      formattedUrl = "https://" + formattedUrl;
    }

    try {
      new URL(formattedUrl);
      return { isValid: true, formattedUrl, error: "" };
    } catch {
      return {
        isValid: false,
        formattedUrl: "",
        error: "Please enter a valid URL",
      };
    }
  }

  function handleAddFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const currentLength = materials.length;

      files.forEach((file, index) => {
        const materialIndex = currentLength + index;

        setFileMap((prev) => new Map(prev).set(materialIndex, file));

        appendMaterial({
          name: file.name,
          isLink: false,
          url: "",
          size: file.size,
          type: file.type,
        });
      });

      setShowFileUpload(false);
      e.target.value = "";
    }
  }

  function handleAddLink() {
    if (!tempLinkName.trim()) {
      setUrlError("Link name is required");
      return;
    }

    const urlValidation = validateAndFormatUrl(tempLinkUrl);

    if (!urlValidation.isValid) {
      setUrlError(urlValidation.error);
      return;
    }

    appendLink({
      name: tempLinkName.trim(),
      isLink: true,
      url: urlValidation.formattedUrl,
      size: undefined,
      type: undefined,
    });

    setShowLinkInput(false);
    setTempLinkUrl("");
    setTempLinkName("");
    setUrlError("");
  }

  function handleRemoveMaterial(index: number) {
    setFileMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(index);
      // Adjust indices for remaining files
      const updatedMap = new Map();
      Array.from(newMap.entries()).forEach(([key, value]) => {
        const newKey = key > index ? key - 1 : key;
        updatedMap.set(newKey, value);
      });
      return updatedMap;
    });

    removeMaterial(index);
  }

  function handleRemoveLink(index: number) {
    removeLink(index);
  }

  function handleShowFileUpload() {
    setShowFileUpload(true);
    setShowLinkInput(false);
  }

  function handleShowLinkInput() {
    setShowLinkInput(true);
    setShowFileUpload(false);
    setTempLinkUrl("");
    setTempLinkName("");
    setUrlError("");
  }

  function onSubmit(data: FormValues) {
    const materialsWithFiles = data.files.map((material, index) => ({
      ...material,
      originalFile: fileMap.get(index) as File,
    }));

    addMaterials(
      { files: materialsWithFiles, links, materialGroupId },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  }

  function renderAllItems() {
    const allItems = [
      ...materialFields.map((field, index) => ({
        ...field,
        data: materials[index],
        type: "material" as const,
        index,
      })),
      ...linkFields.map((field, index) => ({
        ...field,
        data: links[index],
        type: "link" as const,
        index,
      })),
    ];

    return allItems.map((item) => (
      <div
        key={item.id}
        className="p-3 border border-slate-200 rounded-lg space-y-2"
      >
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm font-medium text-slate-700 break-words min-w-0 flex-1">
            <>
              {item.data.isLink ? (
                <LucideLink className="inline w-4 h-4 mr-2 flex-shrink-0" />
              ) : (
                <LucideFile className="inline w-4 h-4 mr-2 flex-shrink-0" />
              )}
              <span className="break-all">{item.data.name}</span>
            </>
          </h4>
          <Button
            onClick={() => {
              if (item.type === "material") {
                handleRemoveMaterial(item.index);
              } else {
                handleRemoveLink(item.index);
              }
            }}
            disabled={isAddingMaterials}
            className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 flex-shrink-0"
            variant="ghost"
            type="button"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Material Details */}
        <div className="text-sm text-slate-600">
          {item.data.isLink ? (
            <div className="break-all">
              <strong>URL:</strong> {item.data.url}
            </div>
          ) : (
            <div className="space-y-1">
              {item.data.size && (
                <div>
                  <strong>Size:</strong>{" "}
                  {(item.data.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
              {item.data.type && (
                <div>
                  <strong>Type:</strong> {item.data.type}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ));
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-slate-800">Add Materials</DialogTitle>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3 sm:space-y-4"
          >
            {/* Add Material Section */}
            <div className="space-y-2">
              <Label>
                Add Materials <span className="text-red-500">*</span>
              </Label>

              <div className="flex flex-col sm:flex-row gap-2 justify-center mb-3">
                <Button
                  onClick={handleShowFileUpload}
                  variant="outline"
                  disabled={isAddingMaterials}
                  type="button"
                >
                  <LucideFile className="w-4 h-4" />
                  Upload Files
                </Button>
                <Button
                  onClick={handleShowLinkInput}
                  variant="outline"
                  disabled={isAddingMaterials}
                  type="button"
                >
                  <LucideLink className="w-4 h-4" />
                  Add Link
                </Button>
              </div>

              {(form.formState.errors.files || form.formState.errors.links) && (
                <p className="mb-2 text-xs text-red-600">
                  {form.formState.errors.files?.message ||
                    form.formState.errors.links?.message ||
                    "Materials are required"}
                </p>
              )}

              {/* File Upload Container */}
              {showFileUpload && (
                <div className="mb-3 p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="text-center">
                    <Input
                      type="file"
                      multiple
                      onChange={handleAddFiles}
                      className="hidden"
                      id="file-upload"
                      disabled={isAddingMaterials}
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                    />
                    <Label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer transition-colors hover:border-slate-400 hover:bg-slate-100"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-600 mb-1">
                        Click to select files
                      </p>
                      <p className="text-xs text-slate-500">
                        or drag and drop (multiple files allowed)
                      </p>
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
                        placeholder="Enter link name"
                        disabled={isAddingMaterials}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        URL <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={tempLinkUrl}
                        onChange={(e) => {
                          setTempLinkUrl(e.target.value);
                          if (urlError) setUrlError("");
                        }}
                        placeholder="https://example.com"
                        disabled={isAddingMaterials}
                      />
                      {urlError && (
                        <p className="text-xs text-red-600">{urlError}</p>
                      )}
                    </div>
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
            {(materials.length > 0 || links.length > 0) && (
              <div className="space-y-2">
                <Label>Materials ({materials.length + links.length})</Label>
                <div className="space-y-3">{renderAllItems()}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-slate-200">
              <Button
                onClick={onClose}
                variant="outline"
                disabled={isAddingMaterials}
                type="button"
              >
                Cancel
              </Button>
              <Button disabled={isAddingMaterials} type="submit">
                {isAddingMaterials ? (
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddMaterialDialog;
