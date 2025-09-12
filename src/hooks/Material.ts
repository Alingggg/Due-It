import useSemesterContext from "@/hooks/Semester";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { Material, SemesterMaterialGroup } from "@/types/Material";
import { toCamelCase } from "@/utils/caseConversion";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
        .eq("semester", semester)
        .eq("id", materialGroupId);

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
    enabled: !!workspace && !!semester && !isLoadingWorkspace,
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
        .eq("group_id", materialGroupId);

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }

      return data.map<Material>(toCamelCase);
    },
    enabled: !!workspace && !!semester && !isLoadingWorkspace,
  });
}

export { useGetMaterialGroups, useGetMaterialGroup, useGetMaterials };
