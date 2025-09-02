"use client";
import DialogContainer from "@/components/DialogContainer";
import { createContext, useState } from "react";

type DialogType =
  | "REQUEST_RESET_PASSWORD"
  | "UPSERT_TASK"
  | "UPSERT_MATERIAL"
  | "UPSERT_SUBJECT"
  | "UPSERT_SCHEDULE"
  | "CONFIRM_ACTION"
  | null;

interface DialogContextType {
  openDialog: (type: DialogType, props?: any) => void;
  closeDialog: () => void;
  dialogType: DialogType;
  dialogProps: any;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

function DialogProvider({ children }: { children: any }) {
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [dialogProps, setDialogProps] = useState<any>(null);

  const openDialog = (type: DialogType, props?: any) => {
    setDialogType(type);
    setDialogProps(props || {});
  };

  const closeDialog = () => {
    setDialogType(null);
    setDialogProps(null);
  };

  return (
    <DialogContext.Provider
      value={{ dialogType, dialogProps, openDialog, closeDialog }}
    >
      {children}
      <DialogContainer />
    </DialogContext.Provider>
  );
}

export { DialogProvider, DialogContext };
