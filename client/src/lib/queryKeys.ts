import type { Semester, TaskFilters } from "@/types";

const queryKeys = {
  profile: {
    all: ["profile"] as const,
    detail: () => [...queryKeys.profile.all, "detail"] as const,
  },

  workspaces: {
    all: ["workspaces"] as const,
    mine: () => [...queryKeys.workspaces.all, "mine"] as const,
  },

  tasks: {
    all: (workspaceId: string, semester: Semester) =>
      ["workspaces", workspaceId, "semesters", semester, "tasks"] as const,
    list: (workspaceId: string, semester: Semester, filters?: TaskFilters) =>
      [
        ...queryKeys.tasks.all(workspaceId, semester),
        "list",
        ...(filters ? [JSON.stringify(filters)] : []),
      ] as const,
    detail: (workspaceId: string, semester: Semester, taskId: string) =>
      [
        ...queryKeys.tasks.all(workspaceId, semester),
        "detail",
        taskId,
      ] as const,
  },

  materialGroups: {
    all: (workspaceId: string, semester: Semester) =>
      [
        "workspaces",
        workspaceId,
        "semesters",
        semester,
        "materialGroups",
      ] as const,
    list: (workspaceId: string, semester: Semester) =>
      [...queryKeys.materialGroups.all(workspaceId, semester), "list"] as const,
    detail: (workspaceId: string, semester: Semester, groupId: string) =>
      [
        ...queryKeys.materialGroups.all(workspaceId, semester),
        "detail",
        groupId,
      ] as const,
  },

  subjects: {
    all: (workspaceId: string, semester: Semester) =>
      ["workspaces", workspaceId, "semesters", semester, "subjects"] as const,
    list: (workspaceId: string, semester: Semester) =>
      [...queryKeys.subjects.all(workspaceId, semester), "list"] as const,
  },

  schedule: {
    all: (workspaceId: string, semester: Semester) =>
      ["workspaces", workspaceId, "semesters", semester, "schedule"] as const,
    list: (workspaceId: string, semester: Semester) =>
      [...queryKeys.schedule.all(workspaceId, semester), "list"] as const,
  },

  code: {
    all: (workspaceId: string, semester: Semester) =>
      ["workspaces", workspaceId, "semesters", semester, "code"] as const,
    detail: (workspaceId: string, semester: Semester) =>
      [...queryKeys.code.all(workspaceId, semester), "detail"] as const,
  },

  members: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "members"] as const,
    list: (workspaceId: string) =>
      [...queryKeys.members.all(workspaceId), "list"] as const,
  },
} as const;

export { queryKeys };
