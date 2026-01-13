"use client";

import { useState, useCallback } from "react";
import Alert, { AlertType, AlertProps } from "@/components/Alert";

interface ShowAlertOptions {
  type: AlertType;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  autoClose?: number;
}

export function useAlert() {
  const [alertConfig, setAlertConfig] = useState<AlertProps | null>(null);

  const showAlert = useCallback(
    ({
      type,
      title,
      message,
      confirmText,
      cancelText,
      autoClose,
    }: ShowAlertOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setAlertConfig({
          type,
          title,
          message,
          confirmText,
          cancelText,
          autoClose,
          onClose: () => {
            setAlertConfig(null);
            resolve(false);
          },
          onConfirm: () => {
            setAlertConfig(null);
            resolve(true);
          },
          onCancel: () => {
            setAlertConfig(null);
            resolve(false);
          },
        });
      });
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, title?: string, autoClose?: number) => {
      return showAlert({ type: "success", title, message, autoClose });
    },
    [showAlert]
  );

  const showError = useCallback(
    (message: string, title?: string) => {
      return showAlert({ type: "error", title, message });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (message: string, title?: string) => {
      return showAlert({ type: "warning", title, message });
    },
    [showAlert]
  );

  const showInfo = useCallback(
    (message: string, title?: string) => {
      return showAlert({ type: "info", title, message });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (
      message: string,
      title?: string,
      confirmText?: string,
      cancelText?: string
    ) => {
      return showAlert({
        type: "confirm",
        title,
        message,
        confirmText,
        cancelText,
      });
    },
    [showAlert]
  );

  const AlertComponent = alertConfig ? <Alert {...alertConfig} /> : null;

  return {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    AlertComponent,
  };
} 