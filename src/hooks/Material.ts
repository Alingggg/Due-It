import useSemesterContext from "@/hooks/Semester";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { SemesterMaterials } from "@/types/Material";
import { toCamelCase } from "@/utils/caseConversion";
import { useQuery } from "@tanstack/react-query";

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

      return data.map<SemesterMaterials>(toCamelCase);
    },
    enabled: !!workspace && !!semester && !isLoadingWorkspace,
  });
}

export { useGetMaterialGroups };
