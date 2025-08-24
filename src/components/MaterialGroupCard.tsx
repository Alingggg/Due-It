"use client";
import { useRouter } from "next/navigation";
import {
  MaterialGroup,
  getSubjectById,
  getMaterialsByGroupId,
} from "@/data/mockData";
import { FaFolder, FaPaperclip } from "react-icons/fa";

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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        {/* Folder Icon */}
        <div className="flex-shrink-0">
          <div className="p-3 bg-blue-50 rounded-lg">
            <FaFolder className="w-6 h-6 text-blue-600" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                {materialGroup.title}
              </h3>

              {!hideSubject && (
                <p className="text-sm text-blue-600 mb-2">{subject?.name}</p>
              )}

              <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                {materialGroup.description}
              </p>

              {/* Material Count */}
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <div className="flex items-center">
                  <FaPaperclip className="w-3 h-3 mr-1" />
                  <span>
                    {materials.length} file
                    {materials.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Meta Info - Only Date */}
          <div className="flex items-center mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>{formatDate(materialGroup.createdDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialGroupCard;
