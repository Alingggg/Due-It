"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { ClipboardList, Filter, Plus } from "lucide-react";
import useDialogContext from "@/hooks/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { useGetTasks } from "@/hooks/Task";
import {
  useGetUserWorkspace,
  useGetUserWorkspaceRole,
} from "@/hooks/Workspace";
import { useGetSubjects } from "@/hooks/Subject";
import LoadingPage from "@/components/LoadingPage";

const SORT_OPTIONS = [
  { value: "dueDate", label: "Due Date" },
  { value: "subject", label: "Subject" },
];

const TASK_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "activity", label: "Activity" },
  { value: "quiz", label: "Quiz" },
];

const COMPLETION_TYPE_OPTIONS = [
  { value: "all", label: "All" },
  { value: "individual", label: "Individual" },
  { value: "pair", label: "Pair" },
  { value: "group", label: "Group" },
];

function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"pending" | "past-due">("pending");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "dueDate");
  const [filterTaskType, setFilterTaskType] = useState(
    searchParams.get("taskType") || "all"
  );
  const [filterCompletionType, setFilterCompletionType] = useState(
    searchParams.get("completionType") || "all"
  );
  const { data: workspace, isLoading: isLoadingWorkspace } =
    useGetUserWorkspace();
  const workspaceId = workspace?.id!;

  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks();
  const { data: subjects, isLoading: isLoadingSubjects } = useGetSubjects();
  const { data: currentUserRole, isLoading: isLoadingCurrentUserRole } =
    useGetUserWorkspaceRole();
  const { openDialog } = useDialogContext();
  const isPageLoading =
    isLoadingWorkspace ||
    isLoadingTasks ||
    isLoadingSubjects ||
    isLoadingCurrentUserRole;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (sortBy !== "dueDate") params.set("sort", sortBy);
    if (filterTaskType !== "all") params.set("taskType", filterTaskType);
    if (filterCompletionType !== "all")
      params.set("completionType", filterCompletionType);

    const newUrl = params.toString()
      ? `/workspace/${workspaceId}/tasks?${params.toString()}`
      : `/workspace/${workspaceId}/tasks`;

    // Replace current URL without page reload
    router.replace(newUrl, { scroll: false });
  }, [sortBy, filterTaskType, filterCompletionType, router, workspaceId]);

  // Filter tasks by tab (pending/past due)
  const now = new Date();
  const tabFilteredTasks =
    tasks?.filter((task) => {
      const dueDate = new Date(task.dueDate);
      if (activeTab === "pending") {
        return dueDate >= now;
      } else {
        return dueDate < now;
      }
    }) ?? [];

  // Filter tasks by other filters
  const filteredTasks = tabFilteredTasks?.filter((task) => {
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
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
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
        }, {} as Record<string, typeof tasks>)
      : null;

  // Sort tasks within each subject by due date
  if (groupedTasks) {
    Object.keys(groupedTasks).forEach((subjectName) => {
      groupedTasks[subjectName]?.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
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
              <AccordionItem key={index} value={subjectName}>
                <AccordionTrigger className="text-xl font-semibold text-slate-800 pr-4 whitespace-nowrap">
                  {subjectName}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {subjectTasks?.map((task) => (
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
    return <LoadingPage message="Loading tasks..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-500">
            {sortedTasks.length} of {tabFilteredTasks.length} tasks
          </div>
          {(currentUserRole === "admin" || currentUserRole === "co-admin") && (
            <Button onClick={() => openDialog("UPSERT_TASK", { subjects })}>
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "pending"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveTab("past-due")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "past-due"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Past Due
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center text-sm text-slate-600">
          <Filter className="w-4 h-4 mr-2" />
          <span>Filters:</span>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="sortBy">Sort by:</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sortBy">
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
        </div>

        {/* Filter by Task Type */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="filterTaskType">Task Type:</Label>
          <Select value={filterTaskType} onValueChange={setFilterTaskType}>
            <SelectTrigger id="filterTaskType">
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
        </div>

        {/* Filter by Completion Type */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="filterCompletionType">Completion Type:</Label>
          <Select
            value={filterCompletionType}
            onValueChange={setFilterCompletionType}
          >
            <SelectTrigger id="filterCompletionType">
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

      {/* Tasks List */}
      <div className="space-y-6">{renderTasks()}</div>

      {/* Empty State */}
      {sortedTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <ClipboardList className="w-12 h-12 mx-auto" />
          </div>
          {tasks?.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                No tasks yet
              </h3>
              <p className="text-slate-600 max-w-sm mx-auto">
                This workspace doesn't have any tasks yet.
              </p>
            </>
          ) : tabFilteredTasks.length === 0 ? (
            <>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                {activeTab === "pending"
                  ? "No pending tasks"
                  : "No past-due tasks"}
              </h3>
              <p className="text-slate-600 max-w-sm mx-auto">
                {activeTab === "pending"
                  ? "There are no upcoming tasks."
                  : "You're all caught up! There are no overdue tasks."}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                No tasks match your filters
              </h3>
              <p className="text-slate-600 max-w-sm mx-auto">
                Try adjusting or clearing your filters to see more tasks.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default TasksPage;
