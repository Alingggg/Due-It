import {
  createContext,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";

interface DialogContextType {
  openDialog: <P extends { onClose: () => void }>(
    component: ComponentType<P>,
    props: Omit<P, "onClose">
  ) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

function DialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<ReactNode>(null);

  const closeDialog = () => setDialog(null);

  const openDialog = <P extends { onClose: () => void }>(
    Component: ComponentType<P>,
    props: Omit<P, "onClose">
  ) => {
    setDialog(<Component {...({ ...props, onClose: closeDialog } as P)} />);
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {dialog}
    </DialogContext.Provider>
  );
}

export { DialogProvider, DialogContext };
