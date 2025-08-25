import { ModalContainer } from "@/components";
import { createContext, useState } from "react";

type ModalType = "REQUEST_RESET_PASSWORD" | null;

interface ModalContextType {
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
  modalType: ModalType;
  modalProps: any;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function ModalProvider({ children }: { children: any }) {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<any>(null);

  const openModal = (type: ModalType, props?: any) => {
    setModalType(type);
    setModalProps(props || {});
  };

  const closeModal = () => {
    setModalType(null);
    setModalProps(null);
  };

  return (
    <ModalContext.Provider
      value={{ modalType, modalProps, openModal, closeModal }}
    >
      {children}
      <ModalContainer />
    </ModalContext.Provider>
  );
}

export { ModalProvider, ModalContext };
