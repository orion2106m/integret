import type { ReactNode } from "react";

export type ModalVariant = "alert" | "confirm" | "form" | "drawer";
export type ModalTone = "neutral" | "info" | "success" | "warning" | "danger";
export type DrawerSide = "left" | "right";
export type ModalSize = "sm" | "md" | "lg" | "xl";

export interface ModalBaseConfig {
  title: string;
  description?: string;
  dismissible?: boolean;
  size?: ModalSize;
}

export interface AlertModalConfig extends ModalBaseConfig {
  kind: "alert";
  tone?: ModalTone;
  body: ReactNode;
}

export interface ConfirmModalConfig extends ModalBaseConfig {
  kind: "confirm";
  tone?: ModalTone;
  body: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
}

export interface FormModalConfig extends ModalBaseConfig {
  kind: "form";
  body: ReactNode;
  footer?: ReactNode;
  submitLabel?: string;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
}

export interface DrawerModalConfig extends ModalBaseConfig {
  kind: "drawer";
  side?: DrawerSide;
  body: ReactNode;
}

export type ModalConfig =
  | AlertModalConfig
  | ConfirmModalConfig
  | FormModalConfig
  | DrawerModalConfig;

export interface ModalInstance {
  id: string;
  config: ModalConfig;
}

export interface ModalManagerValue {
  stack: ModalInstance[];
  openModal: (config: ModalConfig) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  alert: (config: Omit<AlertModalConfig, "kind">) => string;
  confirm: (config: Omit<ConfirmModalConfig, "kind">) => Promise<boolean>;
  form: (config: Omit<FormModalConfig, "kind">) => string;
  drawer: (config: Omit<DrawerModalConfig, "kind">) => string;
}
