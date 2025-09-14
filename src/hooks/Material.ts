import useSemesterContext from "@/hooks/Semester";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { Material, SemesterMaterialGroup } from "@/types/Material";
import { toCamelCase, toSnakeCase } from "@/utils/caseConversion";
import { MaterialSchema } from "@/zod-schema/Material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as z from "zod";

function useGetMaterialGroups() {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
    queryFn: async () => {
      if (!workspace?.id || !semester) {
        throw new Error("Workspace or semester is not available");
      }

      const { data, error } = await supabase
        .from("semester_materials")
        .select("*")
        .eq("semester", semester);

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return data.map<SemesterMaterialGroup>(toCamelCase);
    },
    enabled: !!workspace && !!semester && !isLoadingWorkspace,
  });
}

function useGetMaterialGroup(materialGroupId: string) {
  const queryClient = useQueryClient();
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.materialGroups.detail(
      workspace?.id!,
      semester,
      materialGroupId
    ),
    queryFn: async () => {
      if (!workspace?.id || !semester) {
        throw new Error("Workspace or semester is not available");
      }

      const { data, error } = await supabase
        .from("semester_materials")
        .select("*")
        .eq("id", materialGroupId)
        .single();

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return toCamelCase(data);
    },
    initialData: queryClient
      .getQueryData<SemesterMaterialGroup[]>(
        queryKeys.materialGroups.list(workspace?.id!, semester)
      )
      ?.find((mg) => mg.id === materialGroupId),
    enabled:
      !!workspace && !!semester && !isLoadingWorkspace && !!materialGroupId,
  });
}

function useGetMaterials(materialGroupId: string) {
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.materials.list(
      workspace?.id!,
      semester,
      materialGroupId
    ),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .eq("material_group_id", materialGroupId);
      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return data.map<Material>(toCamelCase);
    },
    enabled: !!workspace && !!semester && !isLoadingWorkspace,
  });
}

function useAddMaterialGroup() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();
  const router = useRouter();

  return useMutation({
    mutationFn: async (newMaterialGroup: {
      subjectId: string;
      title: string;
      description?: string | undefined;
    }) => {
      const snakeCaseData = toSnakeCase(newMaterialGroup) as {
        subject_id: string;
        title: string;
        description?: string | undefined;
      };

      const { data, error } = await supabase
        .from("material_groups")
        .insert(snakeCaseData)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return toCamelCase(data);
    },
    onSuccess: (materialGroup) => {
      router.push(`/workspace/${workspace?.id}/materials/${materialGroup.id}`);
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error adding material group:", error);
    },
  });
}

function useUpdateMaterialGroup() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (updatedMaterialGroup: {
      id: string;
      subjectId: string;
      title: string;
      description?: string | undefined;
    }) => {
      const snakeCaseData = toSnakeCase(updatedMaterialGroup) as {
        id: string;
        subject_id: string;
        title: string;
        description?: string | undefined;
      };

      const { error } = await supabase
        .from("material_groups")
        .update(snakeCaseData)
        .eq("id", updatedMaterialGroup.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_, updatedMaterialGroup) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.detail(
          workspace?.id!,
          semester,
          updatedMaterialGroup.id
        ),
      });
    },
    onError: (error) => {
      console.log("Error updating material group:", error);
    },
  });
}

function useDeleteMaterialGroup() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();
  const router = useRouter();

  return useMutation({
    mutationFn: async (materialGroupId: string) => {
      const { error: deleteError } = await supabase
        .from("material_groups")
        .delete()
        .eq("id", materialGroupId);

      if (deleteError) throw new Error(deleteError.message);

      const storagePrefix = `${workspace?.id}/${materialGroupId}/`;

      const { data: files, error: listError } = await supabase.storage
        .from("Materials")
        .list(storagePrefix);

      if (listError) throw new Error(listError.message);

      const paths = files.map((file) => `${storagePrefix}${file.name}`);

      const { error: removeError } = await supabase.storage
        .from("Materials")
        .remove(paths);

      if (removeError) throw new Error(removeError.message);
    },
    onSuccess: () => {
      router.push(`/workspace/${workspace?.id}/materials`);
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
      });
    },
    onError: (error) => {
      console.log("Error deleting material group:", error);
    },
  });
}

function useAddMaterials() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async ({
      files,
      links,
      materialGroupId,
    }: {
      files: (z.infer<typeof MaterialSchema> & { originalFile: File })[];
      links: z.infer<typeof MaterialSchema>[];
      materialGroupId: string;
    }) => {
      const materialsToInsert = [
        ...files.map((file) => ({ ...file, materialGroupId })),
        ...links.map((link) => ({ ...link, materialGroupId })),
      ];

      const snakeCaseData = materialsToInsert.map(toSnakeCase) as {
        material_group_id: string;
        is_link: boolean;
        name: string;
        url: string;
        size?: number | undefined;
        type?: string | undefined;
        original_file?: File | undefined;
      }[];

      const { data: insertedMaterials, error: insertError } = await supabase
        .from("materials")
        .insert(
          snakeCaseData.map((material) => {
            const { original_file, ...rest } = material;
            return rest;
          })
        )
        .select();

      if (insertError) throw new Error(insertError.message);

      const fileMaterials = insertedMaterials.filter(
        (material) => !material.is_link
      );

      const failedUploads = [];

      for (let i = 0; i < fileMaterials.length; i++) {
        const material = fileMaterials[i];
        const file = files[i].originalFile;

        try {
          const fileExt = file.name.split(".").pop();
          const fileName = `${material.id}.${fileExt}`;
          const storagePath = `${workspace?.id}/${materialGroupId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("Materials")
            .upload(storagePath, file, {
              upsert: true,
            });

          if (uploadError)
            throw new Error(`Storage upload failed: ${uploadError.message}`);

          // Update material record with actual storage URL
          await supabase
            .from("materials")
            .update({ url: storagePath })
            .eq("id", material.id);
        } catch (error) {
          console.error(`Upload failed for material ${material.id}:`, error);
          failedUploads.push({
            materialId: material.id,
            fileName: file.name,
          });
        }
      }

      if (failedUploads.length > 0) {
        const failedMaterialIds = failedUploads.map((f) => f.materialId);

        await supabase.from("materials").delete().in("id", failedMaterialIds);
      }
    },
    onSuccess: (_, newMaterials) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.materials.list(
          workspace?.id!,
          semester,
          newMaterials.materialGroupId
        ),
      });
    },
    onError: (error) => {
      console.log("Error adding material:", error);
    },
  });
}

function useDownloadMaterial() {
  return useMutation({
    mutationFn: async (material: Material) => {
      const { data, error } = await supabase.storage
        .from("Materials")
        .download(material.url);

      if (error) throw new Error(error.message);

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = material.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.log("Error downloading material:", error);
    },
  });
}

export {
  useGetMaterialGroups,
  useGetMaterialGroup,
  useGetMaterials,
  useAddMaterialGroup,
  useUpdateMaterialGroup,
  useDeleteMaterialGroup,
  useAddMaterials,
  useDownloadMaterial,
};
