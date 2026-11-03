import { useGetUserWorkspace, useSemesterContext } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type {
  Material,
  MaterialGroupDetail,
  SemesterMaterialGroup,
} from "@/types";
import type { MaterialSchema } from "@/zod-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import type z from "zod";

function useGetMaterialGroups() {
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.materialGroups.list(workspace?.id!, semester),
    queryFn: async () =>
      (
        await api.get<SemesterMaterialGroup[]>(
          `/workspaces/${workspace!.id}/material-groups`,
          { params: { semester } }
        )
      ).data,
    enabled: !!workspace,
  });
}

// the group and its materials come from the same endpoint
function useMaterialGroupQuery<T = MaterialGroupDetail>(
  materialGroupId: string,
  select?: (group: MaterialGroupDetail) => T
) {
  const { data: workspace } = useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.materialGroups.detail(
      workspace?.id!,
      materialGroupId
    ),
    queryFn: async () =>
      (
        await api.get<MaterialGroupDetail>(
          `/workspaces/${workspace!.id}/material-groups/${materialGroupId}`
        )
      ).data,
    select,
    enabled: !!workspace && !!materialGroupId,
  });
}

function useGetMaterialGroup(materialGroupId: string) {
  return useMaterialGroupQuery(materialGroupId);
}

function useGetMaterials(materialGroupId: string) {
  return useMaterialGroupQuery(materialGroupId, (group) => group.materials);
}

function useAddMaterialGroup() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (newMaterialGroup: {
      subjectId: string;
      title: string;
      description?: string | undefined;
    }) =>
      (
        await api.post<{ id: string }>(
          `/workspaces/${workspace!.id}/material-groups`,
          newMaterialGroup
        )
      ).data,
    onSuccess: (materialGroup) => {
      navigate(`/workspace/${workspace?.id}/materials/${materialGroup.id}`);
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspace?.id!),
      });
    },
  });
}

function useUpdateMaterialGroup() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async ({
      id,
      ...materialGroup
    }: {
      id: string;
      subjectId: string;
      title: string;
      description?: string | undefined;
    }) => {
      await api.patch(
        `/workspaces/${workspace!.id}/material-groups/${id}`,
        materialGroup
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspace?.id!),
      });
    },
  });
}

function useDeleteMaterialGroup() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (materialGroupId: string) => {
      await api.delete(
        `/workspaces/${workspace!.id}/material-groups/${materialGroupId}`
      );
    },
    onSuccess: (_, materialGroupId) => {
      navigate(`/workspace/${workspace?.id}/materials`);
      queryClient.removeQueries({
        queryKey: queryKeys.materialGroups.detail(
          workspace?.id!,
          materialGroupId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspace?.id!),
      });
    },
  });
}

function useAddMaterials() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

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
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file.originalFile));
      formData.append(
        "links",
        JSON.stringify(links.map(({ name, url }) => ({ name, url })))
      );

      await api.post(
        `/workspaces/${workspace!.id}/material-groups/${materialGroupId}/materials`,
        formData
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspace?.id!),
      });
    },
  });
}

function useDownloadMaterial() {
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (material: Material) => {
      const { data } = await api.get<Blob>(
        `/workspaces/${workspace!.id}/materials/${material.id}/download`,
        { responseType: "blob" }
      );

      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = material.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}

function useDeleteMaterial() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();

  return useMutation({
    mutationFn: async (material: Material) => {
      await api.delete(
        `/workspaces/${workspace!.id}/materials/${material.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspace?.id!),
      });
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
  useDeleteMaterial,
};
