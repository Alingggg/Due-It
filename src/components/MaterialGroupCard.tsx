"use client";
import { useRouter } from "next/navigation";
import {
  MaterialGroup,
  getSubjectById,
  getMaterialsByGroupId,
} from "@/data/mockData";
import { FaFolder, FaPaperclip } from "react-icons/fa";
import { format } from "date-fns";

interface MaterialGroupCardProps {
  materialGroup: MaterialGroup;
  workspaceId: string;
  hideSubject?: boolean;
}

function MaterialGroupCard({
  materialGroup,
  workspaceId,
  hideSubject = false,
}: MaterialGroupCardProps) {
  const router = useRouter();
  const subject = getSubjectById(materialGroup.subjectId);
  const materials = getMaterialsByGroupId(materialGroup.id);

  const handleCardClick = () => {
    router.push(`/workspace/${workspaceId}/materials/${materialGroup.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        {/* Main Content */}
        <div className="flex items-start sm:items-center flex-1">
          <div className="p-2 sm:p-3 bg-blue-50 rounded-lg mr-2 sm:mr-4 shrink-0 flex items-center justify-center">
            <FaFolder className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-0.5 sm:mb-1 leading-tight">
              {materialGroup.title}
            </h3>

            <div className="text-xs sm:text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center space-y-0.5 sm:space-y-0 sm:space-x-4">
              {!hideSubject && (
                <>
                  <span className="truncate text-blue-600">
                    {subject?.name || "Unknown Subject"}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                </>
              )}
              <div className="flex items-center space-x-2">
                <FaPaperclip className="w-3 h-3" />
                <span>
                  {materials.length} file{materials.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-2 sm:mb-0 line-clamp-2">
              {materialGroup.description}
            </p>
          </div>
        </div>

        {/* Date Section */}
        <div className="flex flex-col justify-center items-end min-w-[100px]">
          <div className="text-xs sm:text-sm text-slate-500 sm:mb-0 sm:text-right">
            {format(new Date(materialGroup.createdDate), "MMM d, yyyy")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialGroupCard;
