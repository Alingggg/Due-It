import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  LoadingPage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TaskCard,
  TodaysClasses,
} from "@/components";
import {
  useGetUserWorkspace,
  useGetTasks,
  useGetSubjects,
  useGetUserWorkspaceRole,
  useDialogContext,
} from "@/hooks";
import type { SemesterTask } from "@/types";
import { parseISO } from "date-fns";
import { Plus, ClipboardList } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

type TaskTab = "pending" | "past-due" | "completed";

const TABS: { value: TaskTab; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "past-due", label: "Past due" },
  { value: "completed", label: "Completed" },
];

const SORT_OPTIONS = [
  { value: "dueDate", label: "Due date" },
  { value: "subject", label: "Subject" },
];

const TASK_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "activity", label: "Activity" },
  { value: "exam", label: "Exam" },
];

const COMPLETION_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "individual", label: "Individual" },
  { value: "pair", label: "Pair" },
  { value: "group", label: "Group" },
];

const filterTriggerClass =
  "h-[38px]! gap-1.5 rounded-[10px] border-0 bg-blue-50 px-3 text-[13px] font-bold text-slate-800 shadow-none";

function getDueDateTime(dueDate: string, dueTime: string) {
  return parseISO(`${dueDate}T${dueTime}`);
}

function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TaskTab>(
    (searchParams.get("tab") as TaskTab | null) || "pending"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "dueDate");
  const [filterTaskType, setFilterTaskType] = useState(
    searchParams.get("taskType") || "all"
  );
  const [filterCompletionType, setFilterCompletionType] = useState(
    searchParams.get("completionType") || "all"
  );
  const { data: workspace } = useGetUserWorkspace();
  const workspaceId = workspace?.id!;

  // fetch every task once; the tabs (and their counts) are split client-side
  const { data: allTasks, isLoading: isLoadingTasks } = useGetTasks();
  const { data: subjects, isLoading: isLoadingSubjects } = useGetSubjects();
  const currentUserRole = useGetUserWorkspaceRole();
  const { openDialog } = useDialogContext();
  const isPageLoading = isLoadingTasks || isLoadingSubjects;

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (activeTab !== "pending") newParams.set("tab", activeTab);
    if (sortBy !== "dueDate") newParams.set("sort", sortBy);
    if (filterTaskType !== "all") newParams.set("taskType", filterTaskType);
    if (filterCompletionType !== "all")
      newParams.set("completionType", filterCompletionType);

    // Replace current URL without page reload
    setSearchParams(newParams, { replace: true });
  }, [activeTab, sortBy, filterTaskType, filterCompletionType, setSearchParams]);

  const now = new Date();

  function getTaskTab(task: SemesterTask): TaskTab {
    if (task.isCompleted) return "completed";
    return getDueDateTime(task.dueDate, task.dueTime) < now
      ? "past-due"
      : "pending";
  }

  const tabCounts: Record<TaskTab, number> = {
    pending: 0,
    "past-due": 0,
    completed: 0,
  };
  (allTasks || []).forEach((task) => tabCounts[getTaskTab(task)]++);

  const tabTasks = (allTasks || []).filter(
    (task) => getTaskTab(task) === activeTab
  );

  // Filter task types and completion types
  const filteredTasks = tabTasks.filter((task) => {
    const typeMatch =
      filterTaskType === "all" || task.taskType === filterTaskType;
    const completionMatch =
      filterCompletionType === "all" ||
      task.completionType === filterCompletionType;
    return typeMatch && completionMatch;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      // For "past-due" and "completed", sort descending (newest first)
      if (activeTab === "past-due" || activeTab === "completed") {
        return (
          getDueDateTime(b.dueDate, b.dueTime).getTime() -
          getDueDateTime(a.dueDate, a.dueTime).getTime()
        );
      }
      // For "pending", sort ascending (soonest first)
      return (
        getDueDateTime(a.dueDate, a.dueTime).getTime() -
        getDueDateTime(b.dueDate, b.dueTime).getTime()
      );
    } else if (sortBy === "subject") {
      const subjectA = subjects?.find((s) => s.id === a.subjectId)?.name || "";
      const subjectB = subjects?.find((s) => s.id === b.subjectId)?.name || "";
      return subjectA.localeCompare(subjectB);
    }
    return 0;
  });

  // Group tasks by subject when sorted by subject
  const groupedTasks =
    sortBy === "subject"
      ? sortedTasks.reduce((groups, task) => {
          const subjectName = task.subjectName || "Unknown Subject";
          if (!groups[subjectName]) {
            groups[subjectName] = [];
          }
          groups[subjectName].push(task);
          return groups;
        }, {} as Record<string, SemesterTask[]>)
      : null;

  // Sort tasks within each subject by due date and time
  if (groupedTasks) {
    Object.keys(groupedTasks).forEach((subjectName) => {
      groupedTasks[subjectName].sort(
        (a, b) =>
          getDueDateTime(a.dueDate, a.dueTime).getTime() -
          getDueDateTime(b.dueDate, b.dueTime).getTime()
      );
    });
  }

  function renderTasks() {
    if (sortBy === "subject" && groupedTasks) {
      return (
        <Accordion
          type="multiple"
          defaultValue={Object.entries(groupedTasks).map(
            ([subjectName]) => subjectName
          )}
        >
          {Object.entries(groupedTasks).map(
            ([subjectName, subjectTasks], index) => (
              <AccordionItem
                key={index}
                value={subjectName}
                className="border-line"
              >
                <AccordionTrigger className="text-base font-bold text-slate-800 pr-4 whitespace-nowrap">
                  {subjectName}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2.5">
                    {subjectTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        workspaceId={workspaceId}
                        task={task}
                        subjectName={subjectName}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          )}
        </Accordion>
      );
    } else {
      return sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          workspaceId={workspaceId}
          task={task}
          subjectName={task.subjectName}
        />
      ));
    }
  }

  if (isPageLoading) {
    return <LoadingPage message="Loading tasks..." fullScreen={false} />;
  }

  return (
    <div className="flex flex-col xl:flex-row xl:items-start gap-6">
      <section className="flex-1 min-w-0 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h2 className="text-xl font-extrabold text-slate-800">Tasks</h2>
            <span className="text-[13px] text-slate-500">
              {sortedTasks.length} of {tabTasks.length} tasks
            </span>
          </div>
          {(currentUserRole === "admin" || currentUserRole === "co-admin") && (
            <Button
              className="h-11 rounded-xl px-5 font-bold"
              onClick={() => openDialog("UPSERT_TASK", { subjects })}
            >
              <Plus className="w-4 h-4" />
              <span>Create task</span>
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                aria-pressed={activeTab === tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`h-[38px] px-4 rounded-full border text-[13px] transition-colors ${
                  activeTab === tab.value
                    ? "border-blue-900 bg-blue-900 text-white font-bold"
                    : "border-line bg-white text-slate-600 font-semibold hover:border-blue-200 hover:text-slate-800"
                }`}
              >
                {tab.label} · {tabCounts[tab.value]}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger aria-label="Sort by" className={filterTriggerClass}>
                <span className="font-normal text-slate-600">Sort</span>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTaskType} onValueChange={setFilterTaskType}>
              <SelectTrigger
                aria-label="Task type"
                className={filterTriggerClass}
              >
                <span className="font-normal text-slate-600">Type</span>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {TASK_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filterCompletionType}
              onValueChange={setFilterCompletionType}
            >
              <SelectTrigger
                aria-label="Completion type"
                className={filterTriggerClass}
              >
                <span className="font-normal text-slate-600">Completion</span>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {COMPLETION_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2.5">{renderTasks()}</div>

        {sortedTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <ClipboardList className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-800">
              {activeTab === "pending"
                ? "No pending tasks"
                : activeTab === "past-due"
                ? "No past-due tasks"
                : "No completed tasks"}
            </h3>
          </div>
        )}
      </section>

      {/* above the list on small screens, a side column on wide ones */}
      <TodaysClasses className="order-first xl:order-none xl:w-72 shrink-0" />
    </div>
  );
}

export default Tasks;
