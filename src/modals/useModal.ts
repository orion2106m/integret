import { useContext } from "react";
import { ModalContext } from "./ModalManager";

export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within ModalManagerProvider");
  }

  return context;
}
