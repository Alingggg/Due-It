import type { SemesterMaterialGroup } from "@/types";
import { format } from "date-fns";
import { Folder, Paperclip } from "lucide-react";
import { useNavigate } from "react-router";

interface MaterialGroupCardProps {
  materialGroup: SemesterMaterialGroup;
  workspaceId: string;
}

function MaterialGroupCard({
  materialGroup,
  workspaceId,
}: MaterialGroupCardProps) {
  const navigate = useNavigate();

  function handleCardClick() {
    navigate(`/workspace/${workspaceId}/materials/${materialGroup.id}`);
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div className="flex items-start sm:items-center flex-1">
          <div className="p-2 sm:p-3 bg-blue-50 rounded-lg mr-2 sm:mr-4 shrink-0 flex items-center justify-center">
            <Folder className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-600 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-lg font-semibold text-slate-800 mb-0.5 sm:mb-1 leading-tight">
              {materialGroup.title}
            </h3>

            <div className="text-xs sm:text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center space-y-0.5 sm:space-y-0 sm:space-x-4">
              {materialGroup.subjectName && (
                <>
                  <span className="truncate text-blue-600">
                    {materialGroup.subjectName}
                  </span>
                  <span className="text-slate-400 hidden sm:inline">•</span>
                </>
              )}
              <div className="flex items-center space-x-2">
                <Paperclip className="w-3 h-3" />
                <span>
                  {materialGroup.materialCount} file
                  {materialGroup.materialCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-2 sm:mb-0 line-clamp-2">
              {materialGroup.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center items-end min-w-[100px]">
          <div className="text-xs sm:text-sm text-slate-500 sm:mb-0 sm:text-right">
            {format(
              new Date(materialGroup.createdAt.split(".")[0] + "Z"),
              "MMM d, yyyy"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialGroupCard;
