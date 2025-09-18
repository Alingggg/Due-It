import { DialogContext } from "@/context";
import { useContext } from "react";

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context)
    throw new Error("useDialogContext must be used within a DialogProvider");

  return context;
}

export default useDialogContext;
