"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModalProps {
     isOpen: boolean;
     onClose: () => void;
     children: React.ReactNode;
     size?: "sm" | "md" | "lg" | "xl";
     closeOnBackdropClick?: boolean;
}

const sizeClasses = {
     sm: "max-w-sm",
     md: "max-w-md",
     lg: "max-w-lg",
     xl: "max-w-xl",
};

export default function Modal({
     isOpen,
     onClose,
     children,
     size = "md",
     closeOnBackdropClick = true,
}: ModalProps) {
     const modalRef = useRef<HTMLDivElement>(null);

     // Handle ESC key to close modal
     useEffect(() => {
          const handleEsc = (e: KeyboardEvent) => {
               if (e.key === "Escape" && isOpen) {
                    onClose();
               }
          };

          window.addEventListener("keydown", handleEsc);
          return () => window.removeEventListener("keydown", handleEsc);
     }, [isOpen, onClose]);

     // Lock body scroll when modal is open
     useEffect(() => {
          if (isOpen) {
               document.body.style.overflow = "hidden";
          } else {
               document.body.style.overflow = "unset";
          }

          return () => {
               document.body.style.overflow = "unset";
          };
     }, [isOpen]);

     if (!isOpen) return null;

     return (
          <div className="fixed inset-0 z-50 overflow-y-auto">
               <div className="flex min-h-screen items-center justify-center p-4">
                    {/* Backdrop with blur */}
                    <div
                         className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                         onClick={closeOnBackdropClick ? onClose : undefined}
                         aria-hidden="true"
                    />

                    {/* Modal */}
                    <div
                         ref={modalRef}
                         className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl ${sizeClasses[size]} w-full transform transition-all`}
                         role="dialog"
                         aria-modal="true"
                    >
                         {children}
                    </div>
               </div>
          </div>
     );
}

// Modal Header Component
interface ModalHeaderProps {
     title: string;
     onClose: () => void;
     subtitle?: string;
}

export function ModalHeader({ title, onClose, subtitle }: ModalHeaderProps) {
     return (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
               <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                         {title}
                    </h2>
                    {subtitle && (
                         <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              {subtitle}
                         </p>
                    )}
               </div>
               <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Close modal"
               >
                    <X size={24} />
               </button>
          </div>
     );
}

// Modal Body Component
interface ModalBodyProps {
     children: React.ReactNode;
}

export function ModalBody({ children }: ModalBodyProps) {
     return (
          <div className="p-6">
               {children}
          </div>
     );
}

// Modal Footer Component
interface ModalFooterProps {
     children: React.ReactNode;
}

export function ModalFooter({ children }: ModalFooterProps) {
     return (
          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
               {children}
          </div>
     );
}
