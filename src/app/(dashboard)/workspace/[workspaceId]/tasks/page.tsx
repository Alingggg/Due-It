"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import {
  getTasksByWorkspaceId,
  mockSubjects,
  getSubjectById,
  getCurrentUserRole,
} from "@/data/mockData";
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

function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const tasks = getTasksByWorkspaceId(workspaceId);
  const { openDialog } = useDialogContext();

  // Get current user's role in this workspace
  const currentUserRole = getCurrentUserRole(workspaceId);

  // Initialize states from URL params or defaults
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "dueDate");
  const [filterType, setFilterType] = useState(
    searchParams.get("type") || "all"
  );
  const [filterDoneBy, setFilterDoneBy] = useState(
    searchParams.get("doneBy") || "all"
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    // Only add non-default values to keep URL clean
    if (sortBy !== "dueDate") params.set("sort", sortBy);
    if (filterType !== "all") params.set("type", filterType);
    if (filterDoneBy !== "all") params.set("doneBy", filterDoneBy);

    const newUrl = params.toString()
      ? `/workspace/${workspaceId}/tasks?${params.toString()}`
      : `/workspace/${workspaceId}/tasks`;

    // Replace current URL without page reload
    router.replace(newUrl, { scroll: false });
  }, [sortBy, filterType, filterDoneBy, router, workspaceId]);

  // Get subjects for this workspace
  const workspaceSubjects = mockSubjects.filter(
    (subject) => subject.workspaceId === workspaceId
  );

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const typeMatch = filterType === "all" || task.type === filterType;
    const doneByMatch = filterDoneBy === "all" || task.doneBy === filterDoneBy;
    return typeMatch && doneByMatch;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortBy === "subject") {
      const subjectA =
        workspaceSubjects.find((s) => s.id === a.subjectId)?.name || "";
      const subjectB =
        workspaceSubjects.find((s) => s.id === b.subjectId)?.name || "";
      return subjectA.localeCompare(subjectB);
    }
    return 0;
  });

  // Group tasks by subject when sorted by subject
  const groupedTasks =
    sortBy === "subject"
      ? sortedTasks.reduce((groups, task) => {
          const subject = getSubjectById(task.subjectId);
          const subjectName = subject?.name || "Unknown Subject";
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
      groupedTasks[subjectName].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    });
  }

  const renderTasks = () => {
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
                    {subjectTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        workspaceId={workspaceId}
                        task={task}
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
        <TaskCard key={task.id} workspaceId={workspaceId} task={task} />
      ));
    }
  };

  // Dropdown options
  const sortOptions = [
    { value: "dueDate", label: "Due Date" },
    { value: "subject", label: "Subject" },
  ];

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "activity", label: "Activity" },
    { value: "quiz", label: "Quiz" },
  ];

  const doneByOptions = [
    { value: "all", label: "All" },
    { value: "individual", label: "Individual" },
    { value: "pair", label: "Pair" },
    { value: "group", label: "Group" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Tasks</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-500">
            {sortedTasks.length} of {tasks.length} tasks
          </div>
          {(currentUserRole === "admin" || currentUserRole === "co") && (
            <Button onClick={() => openDialog("UPSERT_TASK")}>
              <Plus className="w-4 h-4" />
              <span>Create</span>
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center text-sm text-slate-600">
          <Filter className="w-4 h-4 mr-2" />
          <span>Filters:</span>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-600">Sort by:</label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Type */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-600">Type:</label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Done By */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-600">Done by:</label>
          <Select value={filterDoneBy} onValueChange={setFilterDoneBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {doneByOptions.map((option) => (
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
          <div className="text-slate-400 mb-2">
            <ClipboardList className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-1">
            {tasks.length === 0
              ? "No tasks created yet"
              : "No tasks match your filters"}
          </h3>
          <p className="text-slate-600 mb-4">
            {tasks.length === 0
              ? "Create your first task to get started."
              : "Try adjusting your filters to see more tasks."}
          </p>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
