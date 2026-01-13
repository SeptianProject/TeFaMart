"use client";

import { useState, useEffect } from "react";
import Modal, { ModalHeader, ModalBody, ModalFooter } from "./Modal";

export type FieldType = "text" | "number" | "textarea" | "email" | "url" | "select";

export interface FormField<T = Record<string, unknown>> {
     name: keyof T;
     label: string;
     type: FieldType;
     placeholder?: string;
     required?: boolean;
     min?: number;
     max?: number;
     rows?: number;
     options?: { value: string | number; label: string }[];
     validation?: (value: unknown) => string | undefined;
}

interface FormModalProps<T> {
     isOpen: boolean;
     onClose: () => void;
     onSubmit: (data: T) => Promise<void>;
     initialData?: T | null;
     mode: "create" | "edit";
     title: {
          create: string;
          edit: string;
     };
     fields: FormField<T>[];
     size?: "sm" | "md" | "lg" | "xl";
     submitButtonText?: {
          create: string;
          edit: string;
     };
     customValidation?: (data: T) => { [key: string]: string };
}

export default function FormModal<T extends Record<string, unknown> = Record<string, unknown>>({
     isOpen,
     onClose,
     onSubmit,
     initialData,
     mode,
     title,
     fields,
     size = "md",
     submitButtonText = {
          create: "Tambah",
          edit: "Simpan Perubahan",
     },
     customValidation,
}: FormModalProps<T>) {
     const [formData, setFormData] = useState<T>({} as T);
     const [loading, setLoading] = useState(false);
     const [errors, setErrors] = useState<{ [key: string]: string }>({});

     // Initialize form data
     useEffect(() => {
          if (initialData) {
               setFormData(initialData);
          } else {
               const emptyData = {} as T;
               fields.forEach((field) => {
                    if (field.type === "number") {
                         (emptyData[field.name] as number) = 0;
                    } else {
                         (emptyData[field.name] as string) = "";
                    }
               });
               setFormData(emptyData);
          }
          setErrors({});
     }, [initialData, isOpen, fields]);

     const validate = (): boolean => {
          const newErrors: { [key: string]: string } = {};

          fields.forEach((field) => {
               const value = formData[field.name];

               // Required validation
               if (field.required) {
                    if (
                         value === undefined ||
                         value === null ||
                         (typeof value === "string" && !value.trim())
                    ) {
                         newErrors[field.name as string] = `${field.label} wajib diisi`;
                         return;
                    }
               }

               // Number validation
               if (field.type === "number" && typeof value === "number") {
                    if (field.min !== undefined && value < field.min) {
                         newErrors[field.name as string] = `${field.label} harus minimal ${field.min}`;
                    }
                    if (field.max !== undefined && value > field.max) {
                         newErrors[field.name as string] = `${field.label} maksimal ${field.max}`;
                    }
               }

               // Custom validation
               if (field.validation) {
                    const error = field.validation(value);
                    if (error) {
                         newErrors[field.name as string] = error;
                    }
               }
          });

          // Custom form-level validation
          if (customValidation) {
               const customErrors = customValidation(formData);
               Object.assign(newErrors, customErrors);
          }

          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();

          if (!validate()) {
               return;
          }

          setLoading(true);
          try {
               await onSubmit(formData);
               onClose();
          } catch (error) {
               console.error("Error submitting form:", error);
          } finally {
               setLoading(false);
          }
     };

     const handleFieldChange = (name: keyof T, value: string | number) => {
          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }));
          // Clear error when user starts typing
          if (errors[name as string]) {
               setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors[name as string];
                    return newErrors;
               });
          }
     };

     const renderField = (field: FormField<T>) => {
          const value = formData[field.name];
          const error = errors[field.name as string];
          const inputClassName = `w-full px-4 py-2.5 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
               } text-gray-900 dark:text-gray-100`;

          switch (field.type) {
               case "textarea":
                    return (
                         <textarea
                              id={field.name as string}
                              rows={field.rows || 4}
                              value={(value as string) || ""}
                              onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              className={`${inputClassName} resize-none`}
                              placeholder={field.placeholder}
                         />
                    );

               case "number":
                    return (
                         <input
                              type="number"
                              id={field.name as string}
                              value={(value as number) || 0}
                              onChange={(e) =>
                                   handleFieldChange(field.name, Number(e.target.value))
                              }
                              className={inputClassName}
                              placeholder={field.placeholder}
                              min={field.min}
                              max={field.max}
                         />
                    );

               case "select":
                    return (
                         <select
                              id={field.name as string}
                              value={(value as string) || ""}
                              onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              className={inputClassName}
                         >
                              <option value="">Pilih {field.label}</option>
                              {field.options?.map((option) => (
                                   <option key={option.value} value={option.value}>
                                        {option.label}
                                   </option>
                              ))}
                         </select>
                    );

               default:
                    return (
                         <input
                              type={field.type}
                              id={field.name as string}
                              value={(value as string) || ""}
                              onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              className={inputClassName}
                              placeholder={field.placeholder}
                         />
                    );
          }
     };

     return (
          <Modal isOpen={isOpen} onClose={onClose} size={size}>
               <ModalHeader
                    title={mode === "create" ? title.create : title.edit}
                    onClose={onClose}
               />

               <form onSubmit={handleSubmit}>
                    <ModalBody>
                         <div className="space-y-5">
                              {fields.map((field) => (
                                   <div key={field.name as string}>
                                        <label
                                             htmlFor={field.name as string}
                                             className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                        >
                                             {field.label}
                                             {field.required && (
                                                  <span className="text-red-500 ml-1">*</span>
                                             )}
                                        </label>
                                        {renderField(field)}
                                        {errors[field.name as string] && (
                                             <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
                                                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                                                  {errors[field.name as string]}
                                             </p>
                                        )}
                                   </div>
                              ))}
                         </div>
                    </ModalBody>

                    <ModalFooter>
                         <button
                              type="button"
                              onClick={onClose}
                              className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              disabled={loading}
                         >
                              Batal
                         </button>
                         <button
                              type="submit"
                              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                              disabled={loading}
                         >
                              {loading
                                   ? "Menyimpan..."
                                   : mode === "create"
                                        ? submitButtonText.create
                                        : submitButtonText.edit}
                         </button>
                    </ModalFooter>
               </form>
          </Modal>
     );
}
