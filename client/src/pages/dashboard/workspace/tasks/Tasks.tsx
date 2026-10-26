import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Label,
  LoadingPage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TaskCard,
} from "@/components";
import {
  useGetUserWorkspace,
  useGetTasks,
  useGetSubjects,
  useGetUserWorkspaceRole,
  useDialogContext,
} from "@/hooks";
import type { TaskFilters } from "@/types";
import { format, parseISO } from "date-fns";
import { Plus, Filter, ClipboardList } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

const SORT_OPTIONS = [
  { value: "dueDate", label: "Due Date" },
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

function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "pending" | "past-due" | "completed"
  >(
    (searchParams.get("tab") as "past-due" | "completed" | null) || "pending"
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

  const now = new Date();
  const currentDate = format(now, "yyyy-MM-dd");
  // Generate filters based on active tab
  const generateFilters = (): TaskFilters => {
    if (activeTab === "pending") {
      return { dueFrom: currentDate, completed: false };
    }
    if (activeTab === "past-due") {
      return { dueTo: currentDate, completed: false };
    }
    if (activeTab === "completed") {
      return { completed: true };
    }
    return {};
  };

  const { data: allTasks, isLoading: isLoadingTasks } = useGetTasks(
    generateFilters()
  );
  const { data: subjects, isLoading: isLoadingSubjects } = useGetSubjects();
  const currentUserRole = useGetUserWorkspaceRole();
  const { openDialog } = useDialogContext();
  const isPageLoading =
    isLoadingTasks ||
    isLoadingSubjects;

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

  function getDueDateTime(dueDate: string, dueTime: string) {
    return parseISO(`${dueDate}T${dueTime}`);
  }

  // Filter tasks types and due time
  const filteredTasks = (allTasks || []).filter((task) => {
    // Time filtering for pending and past-due tabs
    if (activeTab === "pending") {
      const taskDueDateTime = getDueDateTime(task.dueDate, task.dueTime);
      if (taskDueDateTime < now) {
        return false;
      }
    } else if (activeTab === "past-due") {
      const taskDueDateTime = getDueDateTime(task.dueDate, task.dueTime);
      if (taskDueDateTime >= now) {
        return false;
      }
    }

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
        }, {} as Record<string, typeof allTasks>)
      : null;

  // Sort tasks within each subject by due date and time
  if (groupedTasks) {
    Object.keys(groupedTasks).forEach((subjectName) => {
      groupedTasks[subjectName]?.sort(
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-500">
            {sortedTasks.length} of {allTasks?.length} tasks
          </div>
          {(currentUserRole === "admin" || currentUserRole === "co-admin") && (
            <Button onClick={() => openDialog("UPSERT_TASK", { subjects })}>
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Button>
          )}
        </div>
      </div>

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
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "completed"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            Completed
          </button>
        </nav>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center text-sm text-slate-600">
          <Filter className="w-4 h-4 mr-2" />
          <span>Filters:</span>
        </div>

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

      <div className="space-y-6">{renderTasks()}</div>

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
    </div>
  );
}

export default Tasks;
