"use client";
import useSemesterContext from "@/hooks/Semester";
import { useGetUserWorkspace } from "@/hooks/Workspace";
import { queryKeys } from "@/lib/queryKeys";
import supabase from "@/lib/supabase";
import { SemesterSchedule } from "@/types/Schedule";
import { Database } from "@/types/supabase";
import { toCamelCase, toSnakeCase } from "@/utils/caseConversion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function useGetSchedules(semester: 1 | 2) {
  const { data: workspace } = useGetUserWorkspace();

  return useQuery({
    queryKey: queryKeys.schedule.list(workspace?.id || "", semester),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("semester_schedules")
        .select("*")
        .eq("semester", semester);

      if (error) {
        throw new Error(error.message);
      }

      return data.map<SemesterSchedule>(toCamelCase);
    },
  });
}

function useAddSchedule() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (
      newSchedule: Omit<SemesterSchedule, "id" | "semester" | "subjectName">
    ) => {
      const snakeCaseData = toSnakeCase(newSchedule) as {
        subject_id: string;
        day_of_week: Database["public"]["Enums"]["day_of_week"];
        start_time: string;
        end_time: string;
      };

      const { error } = await supabase.from("schedules").insert(snakeCaseData);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.list(workspace?.id || "", semester),
      });
    },
  });
}

function useUpdateSchedule() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (
      newSchedule: Omit<SemesterSchedule, "semester" | "subjectName">
    ) => {
      const snakeCaseData = toSnakeCase(newSchedule) as {
        subject_id: string;
        day_of_week: Database["public"]["Enums"]["day_of_week"];
        start_time: string;
        end_time: string;
      };

      const { error } = await supabase
        .from("schedules")
        .update(snakeCaseData)
        .eq("id", newSchedule.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.list(workspace?.id || "", semester),
      });
    },
  });
}

function useDeleteSchedule() {
  const queryClient = useQueryClient();
  const { data: workspace } = useGetUserWorkspace();
  const { semester } = useSemesterContext();

  return useMutation({
    mutationFn: async (scheduleId: string) => {
      const { error } = await supabase
        .from("schedules")
        .delete()
        .eq("id", scheduleId);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedule.list(workspace?.id || "", semester),
      });
    },
  });
}

export {
  useGetSchedules,
  useAddSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
};
