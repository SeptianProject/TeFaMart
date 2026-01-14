"use client";

import { useEffect } from "react";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export type AlertType = "success" | "error" | "warning" | "info" | "confirm";

export interface AlertProps {
     type: AlertType;
     title?: string;
     message: string;
     onClose?: () => void;
     onConfirm?: () => void;
     onCancel?: () => void;
     confirmText?: string;
     cancelText?: string;
     autoClose?: number; // auto close after milliseconds
}

const alertStyles = {
     success: {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-500",
          text: "text-green-800 dark:text-green-200",
          icon: "text-green-600 dark:text-green-400",
          button: "bg-green-600 hover:bg-green-700",
     },
     error: {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-500",
          text: "text-red-800 dark:text-red-200",
          icon: "text-red-600 dark:text-red-400",
          button: "bg-red-600 hover:bg-red-700",
     },
     warning: {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-500",
          text: "text-yellow-800 dark:text-yellow-200",
          icon: "text-yellow-600 dark:text-yellow-400",
          button: "bg-yellow-600 hover:bg-yellow-700",
     },
     info: {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-500",
          text: "text-blue-800 dark:text-blue-200",
          icon: "text-blue-600 dark:text-blue-400",
          button: "bg-blue-600 hover:bg-blue-700",
     },
     confirm: {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-gray-500",
          text: "text-gray-800 dark:text-gray-200",
          icon: "text-gray-600 dark:text-gray-400",
          button: "bg-red-600 hover:bg-red-700",
     },
};

export default function Alert({
     type,
     title,
     message,
     onClose,
     onConfirm,
     onCancel,
     confirmText = "Konfirmasi",
     cancelText = "Batal",
     autoClose,
}: AlertProps) {
     const styles = alertStyles[type];

     useEffect(() => {
          if (autoClose && onClose) {
               const timer = setTimeout(() => {
                    onClose();
               }, autoClose);
               return () => clearTimeout(timer);
          }
     }, [autoClose, onClose]);

     const getIcon = () => {
          switch (type) {
               case "success":
                    return <CheckCircle2 className="w-6 h-6" />;
               case "error":
                    return <AlertCircle className="w-6 h-6" />;
               case "warning":
                    return <AlertTriangle className="w-6 h-6" />;
               case "info":
                    return <Info className="w-6 h-6" />;
               case "confirm":
                    return <AlertTriangle className="w-6 h-6" />;
               default:
                    return <Info className="w-6 h-6" />;
          }
     };

     return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
               <div
                    className={cn(
                         "w-full max-w-md mx-4 p-6 rounded-lg border-l-4 shadow-xl",
                         styles.bg,
                         styles.border
                    )}
               >
                    <div className="flex items-start gap-4">
                         <div className={styles.icon}>{getIcon()}</div>
                         <div className="flex-1">
                              {title && (
                                   <h3 className={cn("text-lg font-semibold mb-2", styles.text)}>
                                        {title}
                                   </h3>
                              )}
                              <p className={styles.text}>{message}</p>
                         </div>
                         {onClose && type !== "confirm" && (
                              <Button
                                   variant="ghost"
                                   size="icon"
                                   onClick={onClose}
                                   className={cn(styles.icon, "hover:opacity-70 h-8 w-8")}
                              >
                                   <X className="w-5 h-5" />
                              </Button>
                         )}
                    </div>

                    {type === "confirm" ? (
                         <div className="mt-6 flex gap-3 justify-end">
                              <Button variant="outline" onClick={onCancel || onClose}>
                                   {cancelText}
                              </Button>
                              <Button
                                   onClick={onConfirm}
                                   className={styles.button}
                              >
                                   {confirmText}
                              </Button>
                         </div>
                    ) : (
                         <div className="mt-6 flex justify-end">
                              <Button
                                   onClick={onClose}
                                   className={cn(styles.button, "text-white")}
                              >
                                   OK
                              </Button>
                         </div>
                    )}
               </div>
          </div>
     );
}
