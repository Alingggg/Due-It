import { useSemesterContext, useWorkspaceId } from "@/hooks";
import { api, queryKeys } from "@/lib";
import type {
  Material,
  MaterialGroupDetail,
  MaterialInput,
  SemesterMaterialGroup,
  UploadTarget,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function useGetMaterialGroups() {
  const workspaceId = useWorkspaceId();
  const { semester } = useSemesterContext();

  return useQuery({
    queryKey: queryKeys.materialGroups.list(workspaceId, semester),
    queryFn: async () =>
      (
        await api.get<SemesterMaterialGroup[]>(
          `/workspaces/${workspaceId}/material-groups`,
          { params: { semester } }
        )
      ).data,
    enabled: !!workspaceId,
  });
}

// the group and its materials come from the same endpoint
function useMaterialGroupQuery<T = MaterialGroupDetail>(
  materialGroupId: string,
  select?: (group: MaterialGroupDetail) => T
) {
  const workspaceId = useWorkspaceId();

  return useQuery({
    queryKey: queryKeys.materialGroups.detail(
      workspaceId,
      materialGroupId
    ),
    queryFn: async () =>
      (
        await api.get<MaterialGroupDetail>(
          `/workspaces/${workspaceId}/material-groups/${materialGroupId}`
        )
      ).data,
    select,
    enabled: !!workspaceId && !!materialGroupId,
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
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (newMaterialGroup: {
      subjectId: string;
      title: string;
      description?: string | undefined;
    }) =>
      (
        await api.post<{ id: string }>(
          `/workspaces/${workspaceId}/material-groups`,
          newMaterialGroup
        )
      ).data,
    onSuccess: (materialGroup) => {
      navigate(`/workspace/${workspaceId}/materials/${materialGroup.id}`);
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspaceId),
      });
    },
  });
}

function useUpdateMaterialGroup() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

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
        `/workspaces/${workspaceId}/material-groups/${id}`,
        materialGroup
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspaceId),
      });
    },
  });
}

function useDeleteMaterialGroup() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (materialGroupId: string) => {
      await api.delete(
        `/workspaces/${workspaceId}/material-groups/${materialGroupId}`
      );
    },
    onSuccess: (_, materialGroupId) => {
      navigate(`/workspace/${workspaceId}/materials`);
      queryClient.removeQueries({
        queryKey: queryKeys.materialGroups.detail(
          workspaceId,
          materialGroupId
        ),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspaceId),
      });
    },
  });
}

// files go straight to S3 via presigned POSTs, then the server confirms them
function useAddMaterials() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async ({
      files,
      links,
      materialGroupId,
    }: {
      files: (MaterialInput & { originalFile: File })[];
      links: MaterialInput[];
      materialGroupId: string;
    }) => {
      const groupUrl = `/workspaces/${workspaceId}/material-groups/${materialGroupId}`;
      const originals = files.map((file) => file.originalFile);
      let targets: UploadTarget[] = [];

      setProgress(0);

      if (originals.length) {
        targets = (
          await api.post<UploadTarget[]>(`${groupUrl}/uploads`, {
            files: originals.map((file) => ({
              name: file.name,
              size: file.size,
              type: file.type || "application/octet-stream",
            })),
          })
        ).data;

        const totalBytes = originals.reduce((sum, file) => sum + file.size, 0);
        const loaded = originals.map(() => 0);

        await Promise.all(
          targets.map(async (target, i) => {
            const formData = new FormData();
            Object.entries(target.fields).forEach(([name, value]) =>
              formData.append(name, value)
            );
            formData.append("file", originals[i]);

            try {
              await axios.post(target.url, formData, {
                onUploadProgress: (event) => {
                  loaded[i] = event.loaded;
                  const sum = loaded.reduce((a, b) => a + b, 0);
                  setProgress(Math.min(100, Math.round((sum / totalBytes) * 100)));
                },
              });
            } catch {
              throw new Error(`Failed to upload ${originals[i].name}`);
            }
          })
        );
      }

      await api.post(`${groupUrl}/materials`, {
        links: links.map(({ name, url }) => ({ name, url })),
        files: targets.map((target, i) => ({
          key: target.key,
          name: originals[i].name,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspaceId),
      });
    },
  });

  return { ...mutation, progress };
}

function useDownloadMaterial() {
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (material: Material) => {
      const { data } = await api.get<{ url: string }>(
        `/workspaces/${workspaceId}/materials/${material.id}/download`
      );

      const link = document.createElement("a");
      link.href = data.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  });
}

function useDeleteMaterial() {
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();

  return useMutation({
    mutationFn: async (material: Material) => {
      await api.delete(
        `/workspaces/${workspaceId}/materials/${material.id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialGroups.all(workspaceId),
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
