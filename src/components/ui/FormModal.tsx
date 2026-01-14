"use client";

import { useState, useEffect } from "react";
import {
     Dialog,
     DialogContent,
     DialogDescription,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Label } from "./label";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "./select";

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

          switch (field.type) {
               case "textarea":
                    return (
                         <Textarea
                              id={field.name as string}
                              rows={field.rows || 4}
                              value={(value as string) || ""}
                              onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              className={error ? "border-red-500" : ""}
                         />
                    );

               case "number":
                    return (
                         <Input
                              type="number"
                              id={field.name as string}
                              value={(value as number) || 0}
                              onChange={(e) =>
                                   handleFieldChange(field.name, Number(e.target.value))
                              }
                              placeholder={field.placeholder}
                              min={field.min}
                              max={field.max}
                              className={error ? "border-red-500" : ""}
                         />
                    );

               case "select":
                    return (
                         <Select
                              value={(value as string) || ""}
                              onValueChange={(val) => handleFieldChange(field.name, val)}
                         >
                              <SelectTrigger
                                   className={error ? "border-red-500" : ""}
                              >
                                   <SelectValue placeholder={`Pilih ${field.label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                   {field.options?.map((option) => (
                                        <SelectItem
                                             key={option.value}
                                             value={String(option.value)}
                                        >
                                             {option.label}
                                        </SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>
                    );

               default:
                    return (
                         <Input
                              type={field.type}
                              id={field.name as string}
                              value={(value as string) || ""}
                              onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              placeholder={field.placeholder}
                              className={error ? "border-red-500" : ""}
                         />
                    );
          }
     };

     return (
          <Dialog open={isOpen} onOpenChange={onClose}>
               <DialogContent className="sm:max-w-150">
                    <DialogHeader>
                         <DialogTitle>
                              {mode === "create" ? title.create : title.edit}
                         </DialogTitle>
                         <DialogDescription>
                              {mode === "create"
                                   ? "Isi formulir di bawah untuk menambahkan data baru"
                                   : "Perbarui informasi di formulir di bawah"}
                         </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                         <div className="space-y-4 py-4">
                              {fields.map((field) => (
                                   <div key={field.name as string} className="space-y-2">
                                        <Label
                                             htmlFor={field.name as string}
                                             className="text-sm font-medium"
                                        >
                                             {field.label}
                                             {field.required && (
                                                  <span className="text-red-500 ml-1">*</span>
                                             )}
                                        </Label>
                                        {renderField(field)}
                                        {errors[field.name as string] && (
                                             <p className="text-red-500 text-sm flex items-center gap-1">
                                                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                                                  {errors[field.name as string]}
                                             </p>
                                        )}
                                   </div>
                              ))}
                         </div>

                         <DialogFooter>
                              <Button
                                   type="button"
                                   variant="outline"
                                   onClick={onClose}
                                   disabled={loading}
                              >
                                   Batal
                              </Button>
                              <Button type="submit" disabled={loading}>
                                   {loading
                                        ? "Menyimpan..."
                                        : mode === "create"
                                             ? submitButtonText.create
                                             : submitButtonText.edit}
                              </Button>
                         </DialogFooter>
                    </form>
               </DialogContent>
          </Dialog>
     );
}
