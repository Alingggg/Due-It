import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Label,
  LoadingPage,
  MaterialGroupCard,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components";
import {
  useDialogContext,
  useGetMaterialGroups,
  useGetSubjects,
  useGetUserWorkspace,
  useGetUserWorkspaceRole,
} from "@/hooks";
import { Filter, FolderOpen, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

function Materials() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "createdDate"
  );
  const [filterSubject, setFilterSubject] = useState(
    searchParams.get("subject") || "all"
  );
  const { data: workspace } = useGetUserWorkspace();
  const workspaceId = workspace?.id!;
  const { data: materialGroups, isLoading: isLoadingMaterialGroups } =
    useGetMaterialGroups();
  const currentUserRole = useGetUserWorkspaceRole();
  const { data: subjects, isLoading: isLoadingSubject } = useGetSubjects();
  const { openDialog } = useDialogContext();
  const isPageLoading =
    isLoadingMaterialGroups ||
    isLoadingSubject;

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();

    if (sortBy !== "createdDate") newParams.set("sort", sortBy);
    if (filterSubject !== "all") newParams.set("subject", filterSubject);

    // This automatically updates the URL without reload
    setSearchParams(newParams, { replace: true });
  }, [sortBy, filterSubject, setSearchParams]);

  // Filter material groups
  const filteredMaterialGroups =
    materialGroups?.filter((group) => {
      const subjectMatch =
        filterSubject === "all" || group.subjectId === filterSubject;
      return subjectMatch;
    }) ?? [];

  const sortedMaterialGroups = [...filteredMaterialGroups].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "subject") {
      const subjectA = subjects?.find((s) => s.id === a.subjectId)?.name || "";
      const subjectB = subjects?.find((s) => s.id === b.subjectId)?.name || "";
      return subjectA.localeCompare(subjectB);
    }
    return 0;
  });

  // Group material groups by subject when sorted by subject
  const groupedMaterialGroups =
    sortBy === "subject"
      ? sortedMaterialGroups.reduce((groups, materialGroup) => {
          const subjectName = materialGroup.subjectName || "Unknown Subject";
          if (!groups[subjectName]) {
            groups[subjectName] = [];
          }
          groups[subjectName].push(materialGroup);
          return groups;
        }, {} as Record<string, typeof materialGroups>)
      : null;

  // Sort material groups within each subject by created date (latest first)
  if (groupedMaterialGroups) {
    Object.keys(groupedMaterialGroups).forEach((subjectName) => {
      groupedMaterialGroups[subjectName]?.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    });
  }

  function renderMaterialGroups() {
    if (sortBy === "subject" && groupedMaterialGroups) {
      return (
        <Accordion
          type="multiple"
          defaultValue={Object.entries(groupedMaterialGroups).map(
            ([subjectName]) => subjectName
          )}
        >
          {Object.entries(groupedMaterialGroups).map(
            ([subjectName, subjectMaterialGroups], index) => (
              <AccordionItem key={index} value={subjectName}>
                <AccordionTrigger className="text-xl font-semibold text-slate-800 pr-4 whitespace-nowrap">
                  {subjectName}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {subjectMaterialGroups?.map((materialGroup) => (
                      <MaterialGroupCard
                        key={materialGroup.id}
                        materialGroup={materialGroup}
                        workspaceId={workspaceId}
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
      return sortedMaterialGroups.map((materialGroup) => (
        <MaterialGroupCard
          key={materialGroup.id}
          materialGroup={materialGroup}
          workspaceId={workspaceId}
        />
      ));
    }
  }

  const SORT_OPTIONS = [
    { value: "createdDate", label: "Created Date" },
    { value: "subject", label: "Subject" },
  ];

  const SUBJECT_OPTIONS = [
    { value: "all", label: "All Subjects" },
    ...(subjects ?? []).map((subject) => ({
      value: subject.id,
      label: subject.name,
    })),
  ];

  if (isPageLoading) {
    return <LoadingPage message="Loading materials..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Materials</h1>
        {(currentUserRole === "admin" || currentUserRole === "co-admin") && (
          <Button onClick={() => openDialog("UPSERT_MATERIAL", { subjects })}>
            <Plus className="w-4 h-4" />
            Create
          </Button>
        )}
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
          <Label htmlFor="filterSubject">Subject:</Label>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger id="filterSubject">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {SUBJECT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-6">{renderMaterialGroups()}</div>

      {sortedMaterialGroups.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <FolderOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-1">
            No materials found
          </h3>
          <p className="text-slate-600 mb-4">
            {filterSubject !== "all"
              ? "Try selecting a different subject to see more materials."
              : "No materials have been created yet."}
          </p>
        </div>
      )}
    </div>
  );
}

export default Materials;
