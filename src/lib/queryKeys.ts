type Semester = 1 | 2;

const queryKeys = {
  // Profile (outside workspace)
  profile: {
    all: ["profile"] as const,
    detail: () => [...queryKeys.profile.all, "detail"] as const,
  },

  // Workspace info
  workspaces: {
    all: ["workspaces"] as const,
    list: () => [...queryKeys.workspaces.all, "list"] as const,
    detail: (workspaceId: string) =>
      [...queryKeys.workspaces.all, "detail", workspaceId] as const,
  },

  // Semesters within workspace
  defaultSemesters: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "default_semesters"] as const,
    detail: (workspaceId: string) =>
      [...queryKeys.defaultSemesters.all(workspaceId), "detail"] as const,
  },

  // Tasks within semester
  // tasks: {
  //   all: (workspaceId: string, semester: Semester) =>
  //     ["workspaces", workspaceId, "semesters", semester, "tasks"] as const,
  //   list: (workspaceId: string, semester: Semester) =>
  //     [...queryKeys.tasks.all(workspaceId, semester), "list"] as const,
  //   detail: (workspaceId: string, semester: Semester, taskId: string) =>
  //     [
  //       ...queryKeys.tasks.all(workspaceId, semester),
  //       "detail",
  //       taskId,
  //     ] as const,
  // },

  // Material Groups within semester
  // materialGroups: {
  //   all: (workspaceId: string, semester: Semester) =>
  //     [
  //       "workspaces",
  //       workspaceId,
  //       "semesters",
  //       semester,
  //       "materialGroups",
  //     ] as const,
  //   list: (workspaceId: string, semester: Semester) =>
  //     [
  //       ...queryKeys.materialGroups.all(workspaceId, semester),
  //       "list",
  //     ] as const,
  //   detail: (workspaceId: string, semester: Semester, groupId: string) =>
  //     [
  //       ...queryKeys.materialGroups.all(workspaceId, semester),
  //       "detail",
  //       groupId,
  //     ] as const,
  // },

  // Materials within semester (and optionally within a group)
  // materials: {
  //   all: (workspaceId: string, semester: Semester, groupId: string) =>
  //     [
  //       "workspaces",
  //       workspaceId,
  //       "semesters",
  //       semester,
  //       "materialGroups",
  //       groupId,
  //       "materials",
  //     ] as const,

  //   list: (workspaceId: string, semester: Semester, groupId: string) =>
  //     [
  //       ...queryKeys.materials.all(workspaceId, semester, groupId),
  //       "list",
  //     ] as const,
  //   detail: (
  //     workspaceId: string,
  //     semester: Semester,
  //     materialId: string,
  //     groupId: string
  //   ) =>
  //     [
  //       ...queryKeys.materials.all(workspaceId, semester, groupId),
  //       "detail",
  //       materialId,
  //     ] as const,
  // },

  // Subjects within semester
  subjects: {
    all: (workspaceId: string, semester: Semester) =>
      ["workspaces", workspaceId, "semesters", semester, "subjects"] as const,
    list: (workspaceId: string, semester: Semester) =>
      [...queryKeys.subjects.all(workspaceId, semester), "list"] as const,
  },

  // Schedule within semester
  schedule: {
    all: (workspaceId: string, semester: Semester) =>
      ["workspaces", workspaceId, "semesters", semester, "schedule"] as const,
    list: (workspaceId: string, semester: Semester) =>
      [...queryKeys.schedule.all(workspaceId, semester), "list"] as const,
  },

  // Code within semester
  code: {
    all: (workspaceId: string, semester: Semester) =>
      ["workspaces", workspaceId, "semesters", semester, "code"] as const,
    detail: (workspaceId: string, semester: Semester) =>
      [...queryKeys.code.all(workspaceId, semester), "detail"] as const,
  },

  // Workspace members
  members: {
    all: (workspaceId: string) =>
      ["workspaces", workspaceId, "members"] as const,
    list: (workspaceId: string) =>
      [...queryKeys.members.all(workspaceId), "list"] as const,
  },

  // Workspace roles
  roles: {
    all: (workspaceId: string) => ["workspaces", workspaceId, "roles"] as const,
    detail: (workspaceId: string) =>
      [...queryKeys.roles.all(workspaceId), "detail"] as const,
  },
} as const;

export { queryKeys };
