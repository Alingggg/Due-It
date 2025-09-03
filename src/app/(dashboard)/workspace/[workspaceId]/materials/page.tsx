"use client";
import { useState, useEffect, useContext } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import MaterialGroupCard from "@/components/MaterialGroupCard";
import { Button } from "@/components/ui/button";
import {
  getMaterialGroupsByWorkspaceId,
  getSubjectsByWorkspaceId,
  getSubjectById,
  getCurrentUserRole,
} from "@/data/mockData";
import { FolderOpen, Filter, Plus } from "lucide-react";
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
import { SemesterContext } from "@/context/SemesterProvider";

function MaterialsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const semesterContext = useContext(SemesterContext);
  const semester = semesterContext?.semester ?? 1;

  const materialGroups = getMaterialGroupsByWorkspaceId(workspaceId, semester);
  const { openDialog } = useDialogContext();

  // Get current user's role in this workspace
  const currentUserRole = getCurrentUserRole(workspaceId);

  const subjects = getSubjectsByWorkspaceId(workspaceId, semester);

  // Initialize states from URL params or defaults
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort") || "createdDate"
  );
  const [filterSubject, setFilterSubject] = useState(
    searchParams.get("subject") || "all"
  );

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    // Only add non-default values to keep URL clean
    if (sortBy !== "createdDate") params.set("sort", sortBy);
    if (filterSubject !== "all") params.set("subject", filterSubject);

    const newUrl = params.toString()
      ? `/workspace/${workspaceId}/materials?${params.toString()}`
      : `/workspace/${workspaceId}/materials`;

    // Replace current URL without page reload
    router.replace(newUrl, { scroll: false });
  }, [sortBy, filterSubject, router]);

  // Filter material groups
  const filteredMaterialGroups = materialGroups.filter((group) => {
    const subjectMatch =
      filterSubject === "all" || group.subjectId === filterSubject;
    return subjectMatch;
  });

  // Sort material groups
  const sortedMaterialGroups = [...filteredMaterialGroups].sort((a, b) => {
    if (sortBy === "createdDate") {
      return (
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      ); // Latest first
    } else if (sortBy === "subject") {
      const subjectA = subjects.find((s) => s.id === a.subjectId)?.name || "";
      const subjectB = subjects.find((s) => s.id === b.subjectId)?.name || "";
      return subjectA.localeCompare(subjectB);
    }
    return 0;
  });

  // Group material groups by subject when sorted by subject
  const groupedMaterialGroups =
    sortBy === "subject"
      ? sortedMaterialGroups.reduce((groups, materialGroup) => {
          const subject = getSubjectById(materialGroup.subjectId);
          const subjectName = subject?.name || "Unknown Subject";
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
      groupedMaterialGroups[subjectName].sort(
        (a, b) =>
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    });
  }

  const renderMaterialGroups = () => {
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
                    {subjectMaterialGroups.map((materialGroup) => (
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
          workspaceId={workspaceId}
          materialGroup={materialGroup}
          subjectName={materialGroup.subjectName}
        />
      ));
    }
  };

  // Dropdown options
  const sortOptions = [
    { value: "createdDate", label: "Created Date" },
    { value: "subject", label: "Subject" },
  ];

  const subjectOptions = [
    { value: "all", label: "All Subjects" },
    ...subjects.map((subject) => ({
      value: subject.id,
      label: subject.name,
    })),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Materials</h1>
        {(currentUserRole === "admin" || currentUserRole === "co") && (
          <Button onClick={() => openDialog("UPSERT_MATERIAL", { subjects })}>
            <Plus className="w-4 h-4" />
            Create
          </Button>
        )}
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
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter by Subject */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="filterSubject">Subject:</Label>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger id="filterSubject">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Materials List */}
      <div className="space-y-6">{renderMaterialGroups()}</div>

      {/* Empty State */}
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
          {(currentUserRole === "admin" || currentUserRole === "co") && (
            <Button>
              <Plus className="w-4 h-4" />
              <span>Create First Material</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default MaterialsPage;
