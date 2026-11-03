import type { Semester, TaskFilters } from "@/types";

const queryKeys = {
  profile: {
    all: ["profile"] as const,
    detail: () => [...queryKeys.profile.all, "detail"] as const,
  },

  workspaces: {
    all: ["workspaces"] as const,
    list: () => [...queryKeys.workspaces.all, "list"] as const,
  },

  tasks: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "tasks"] as const,
    list: (workspaceId: string, semester: Semester, filters?: TaskFilters) =>
      [
        ...queryKeys.tasks.all(workspaceId),
        "list",
        semester,
        ...(filters ? [JSON.stringify(filters)] : []),
      ] as const,
    detail: (workspaceId: string, taskId: string) =>
      [...queryKeys.tasks.all(workspaceId), "detail", taskId] as const,
  },

  materialGroups: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "materialGroups"] as const,
    list: (workspaceId: string, semester: Semester) =>
      [...queryKeys.materialGroups.all(workspaceId), "list", semester] as const,
    detail: (workspaceId: string, groupId: string) =>
      [...queryKeys.materialGroups.all(workspaceId), "detail", groupId] as const,
  },

  subjects: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "subjects"] as const,
    list: (workspaceId: string, semester: Semester) =>
      [...queryKeys.subjects.all(workspaceId), "list", semester] as const,
  },

  schedule: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "schedule"] as const,
    list: (workspaceId: string, semester: Semester) =>
      [...queryKeys.schedule.all(workspaceId), "list", semester] as const,
  },

  code: {
    detail: (workspaceId: string) =>
      ["workspaces", workspaceId, "code"] as const,
  },

  members: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "members"] as const,
    list: (workspaceId: string) =>
      [...queryKeys.members.all(workspaceId), "list"] as const,
  },
} as const;

export { queryKeys };
