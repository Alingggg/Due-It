import { BookOpen, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Subject } from "@/types/Subject";
import useDialogContext from "@/hooks/Dialog";

interface SubjectCardProps {
  subject: Subject;
  canManage: boolean;
}

function SubjectCard({ subject, canManage }: SubjectCardProps) {
  const { openDialog, closeDialog } = useDialogContext();

  function handleEdit() {
    openDialog("UPSERT_SUBJECT", {
      initialData: {
        id: subject.id,
        name: subject.name,
        code: subject.subjectCode,
        instructor: subject.instructorName,
      },
    });
  }

  function handleDelete() {
    openDialog("CONFIRM_ACTION", {
      title: "Delete Subject?",
      description: `Are you sure you want to delete the subject "${subject.name}"?`,
      actionButtonVariant: "destructive",
      actionButtonText: "Delete",
      handleAction: closeDialog,
    });
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 hover:shadow-md hover:border-blue-200 transition-all relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-800">{subject.name}</h3>
            <div className="mt-1 flex items-baseline gap-2 text-sm text-slate-600">
              <span className="font-mono text-[0.95em]">
                {subject.subjectCode}
              </span>
              <span className="text-slate-400">•</span>
              <span>{subject.instructorName}</span>
            </div>
          </div>
        </div>

        {/* Actions Menu - Only show if user can manage subjects */}
        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={handleEdit}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Subject
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={handleDelete}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                  <span className="hover:text-red-600">Delete Subject</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

export default SubjectCard;
