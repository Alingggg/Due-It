"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MaterialGroupCard, Dropdown, Button } from "@/components";
import {
  getMaterialGroupsByWorkspaceId,
  mockSubjects,
  getSubjectById,
} from "@/data/mockData";
import { FaFolderOpen, FaFilter, FaPlus } from "react-icons/fa";

function MaterialsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const materialGroups = getMaterialGroupsByWorkspaceId("1");

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
      ? `/workspace/materials?${params.toString()}`
      : "/workspace/materials";

    // Replace current URL without page reload
    router.replace(newUrl, { scroll: false });
  }, [sortBy, filterSubject, router]);

  // Get subjects for this workspace
  const workspaceSubjects = mockSubjects.filter(
    (subject) => subject.workspaceId === "1"
  );

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
      const subjectA =
        workspaceSubjects.find((s) => s.id === a.subjectId)?.name || "";
      const subjectB =
        workspaceSubjects.find((s) => s.id === b.subjectId)?.name || "";
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
      return Object.entries(groupedMaterialGroups).map(
        ([subjectName, subjectMaterialGroups]) => (
          <div key={subjectName} className="space-y-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-slate-800 pr-4 whitespace-nowrap">
                {subjectName}
              </h2>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>
            <div className="space-y-4">
              {subjectMaterialGroups.map((materialGroup) => (
                <MaterialGroupCard
                  key={materialGroup.id}
                  materialGroup={materialGroup}
                  hideSubject={true}
                />
              ))}
            </div>
          </div>
        )
      );
    } else {
      return sortedMaterialGroups.map((materialGroup) => (
        <MaterialGroupCard
          key={materialGroup.id}
          materialGroup={materialGroup}
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
    ...workspaceSubjects.map((subject) => ({
      value: subject.id,
      label: subject.name,
    })),
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Materials</h1>
        <Button className="flex items-center space-x-2">
          <FaPlus className="w-4 h-4" />
          <span>Create</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center text-sm text-slate-600">
          <FaFilter className="w-4 h-4 mr-2" />
          <span>Filters:</span>
        </div>

        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-600">Sort by:</label>
          <Dropdown value={sortBy} onChange={setSortBy} options={sortOptions} />
        </div>

        {/* Filter by Subject */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-slate-600">Subject:</label>
          <Dropdown
            value={filterSubject}
            onChange={setFilterSubject}
            options={subjectOptions}
          />
        </div>
      </div>

      {/* Material Groups List */}
      <div className="space-y-6">{renderMaterialGroups()}</div>

      {/* Empty State */}
      {sortedMaterialGroups.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <FaFolderOpen className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-1">
            No material groups found
          </h3>
          <p className="text-slate-600 mb-4">
            {filterSubject !== "all"
              ? "Try selecting a different subject to see more materials."
              : "No material groups have been created yet."}
          </p>
          <Button className="flex items-center space-x-2 mx-auto">
            <FaPlus className="w-4 h-4" />
            <span>Create First Material Group</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default MaterialsPage;
