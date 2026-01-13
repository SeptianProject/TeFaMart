"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface TefaModalProps {
     isOpen: boolean;
     onClose: () => void;
     onSubmit: (data: TefaFormData) => Promise<void>;
     initialData?: TefaFormData | null;
     mode: "create" | "edit";
}

export interface TefaFormData {
     id?: string;
     name: string;
     major: string;
     description: string;
}

export default function TefaModal({
     isOpen,
     onClose,
     onSubmit,
     initialData,
     mode,
}: TefaModalProps) {
     const [formData, setFormData] = useState<TefaFormData>({
          name: "",
          major: "",
          description: "",
     });
     const [loading, setLoading] = useState(false);
     const [errors, setErrors] = useState<{ [key: string]: string }>({});

     useEffect(() => {
          if (initialData) {
               setFormData(initialData);
          } else {
               setFormData({ name: "", major: "", description: "" });
          }
          setErrors({});
     }, [initialData, isOpen]);

     const validate = () => {
          const newErrors: { [key: string]: string } = {};

          if (!formData.name.trim()) {
               newErrors.name = "Nama TEFA wajib diisi";
          }

          if (!formData.major.trim()) {
               newErrors.major = "Jurusan wajib diisi";
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
               setFormData({ name: "", major: "", description: "" });
          } catch (error) {
               console.error("Error submitting form:", error);
          } finally {
               setLoading(false);
          }
     };

     if (!isOpen) return null;

     return (
          <div className="fixed inset-0 z-50 overflow-y-auto">
               <div className="flex min-h-screen items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                         className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                         onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-10">
                         {/* Header */}
                         <div className="flex items-center justify-between mb-6">
                              <h2 className="text-xl font-bold text-gray-900">
                                   {mode === "create" ? "Tambah TEFA Baru" : "Edit TEFA"}
                              </h2>
                              <button
                                   onClick={onClose}
                                   className="text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                   <X size={24} />
                              </button>
                         </div>

                         {/* Form */}
                         <form onSubmit={handleSubmit} className="space-y-4">
                              {/* Nama TEFA */}
                              <div>
                                   <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                   >
                                        Nama TEFA <span className="text-red-500">*</span>
                                   </label>
                                   <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) =>
                                             setFormData({ ...formData, name: e.target.value })
                                        }
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? "border-red-500" : "border-gray-300"
                                             }`}
                                        placeholder="Contoh: TEFA Otomotif"
                                   />
                                   {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                   )}
                              </div>

                              {/* Jurusan */}
                              <div>
                                   <label
                                        htmlFor="major"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                   >
                                        Jurusan <span className="text-red-500">*</span>
                                   </label>
                                   <input
                                        type="text"
                                        id="major"
                                        value={formData.major}
                                        onChange={(e) =>
                                             setFormData({ ...formData, major: e.target.value })
                                        }
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.major ? "border-red-500" : "border-gray-300"
                                             }`}
                                        placeholder="Contoh: Teknik Kendaraan Ringan"
                                   />
                                   {errors.major && (
                                        <p className="text-red-500 text-sm mt-1">{errors.major}</p>
                                   )}
                              </div>

                              {/* Deskripsi */}
                              <div>
                                   <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                   >
                                        Deskripsi
                                   </label>
                                   <textarea
                                        id="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) =>
                                             setFormData({ ...formData, description: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Deskripsi tentang TEFA ini (opsional)"
                                   />
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-end gap-3 pt-4">
                                   <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        disabled={loading}
                                   >
                                        Batal
                                   </button>
                                   <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={loading}
                                   >
                                        {loading
                                             ? "Menyimpan..."
                                             : mode === "create"
                                                  ? "Tambah TEFA"
                                                  : "Simpan Perubahan"}
                                   </button>
                              </div>
                         </form>
                    </div>
               </div>
          </div>
     );
}
