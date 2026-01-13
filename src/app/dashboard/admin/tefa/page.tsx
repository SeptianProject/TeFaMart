"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import TefaModal, { TefaFormData } from "@/components/TefaModal";
import { TefaCardSkeleton } from "@/components/Skeleton";

interface Tefa {
     id: string;
     name: string;
     major: string;
     description: string | null;
     campusId: string;
     createdAt: string;
     _count?: {
          products: number;
     };
}

export default function TefaPage() {
     const [tefas, setTefas] = useState<Tefa[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [modalMode, setModalMode] = useState<"create" | "edit">("create");
     const [selectedTefa, setSelectedTefa] = useState<TefaFormData | null>(null);

     useEffect(() => {
          fetchTefas();
     }, []);

     const fetchTefas = async () => {
          try {
               const response = await fetch("/api/admin/tefa");
               if (response.ok) {
                    const data = await response.json();
                    setTefas(data);
               }
          } catch (error) {
               console.error("Error fetching tefas:", error);
          } finally {
               setLoading(false);
          }
     };

     const handleOpenAddModal = () => {
          setModalMode("create");
          setSelectedTefa(null);
          setIsModalOpen(true);
     };

     const handleOpenEditModal = (tefa: Tefa) => {
          setModalMode("edit");
          setSelectedTefa({
               id: tefa.id,
               name: tefa.name,
               major: tefa.major,
               description: tefa.description || "",
          });
          setIsModalOpen(true);
     };

     const handleSubmitTefa = async (data: TefaFormData) => {
          try {
               if (modalMode === "create") {
                    const response = await fetch("/api/admin/tefa", {
                         method: "POST",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify(data),
                    });

                    if (response.ok) {
                         const newTefa = await response.json();
                         setTefas((prev) => [newTefa, ...prev]);
                         alert("TEFA berhasil ditambahkan");
                    } else {
                         const error = await response.json();
                         alert(error.error || "Gagal menambahkan TEFA");
                    }
               } else {
                    const response = await fetch(`/api/admin/tefa/${data.id}`, {
                         method: "PUT",
                         headers: { "Content-Type": "application/json" },
                         body: JSON.stringify(data),
                    });

                    if (response.ok) {
                         const updatedTefa = await response.json();
                         setTefas((prev) =>
                              prev.map((tefa) =>
                                   tefa.id === updatedTefa.id ? updatedTefa : tefa
                              )
                         );
                         alert("TEFA berhasil diperbarui");
                    } else {
                         const error = await response.json();
                         alert(error.error || "Gagal memperbarui TEFA");
                    }
               }
          } catch (error) {
               console.error("Error submitting tefa:", error);
               alert("Terjadi kesalahan saat menyimpan data");
          }
     };

     const handleDeleteTefa = async (tefaId: string) => {
          if (!confirm("Apakah Anda yakin ingin menghapus TEFA ini?")) return;

          try {
               const response = await fetch(`/api/admin/tefa/${tefaId}`, {
                    method: "DELETE",
               });

               if (response.ok) {
                    setTefas(tefas.filter((tefa) => tefa.id !== tefaId));
                    alert("TEFA berhasil dihapus");
               } else {
                    const error = await response.json();
                    alert(error.error || "Gagal menghapus TEFA");
               }
          } catch (error) {
               console.error("Error deleting tefa:", error);
               alert("Terjadi kesalahan saat menghapus TEFA");
          }
     };

     const filteredTefas = tefas.filter(
          (tefa) =>
               tefa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               tefa.major.toLowerCase().includes(searchTerm.toLowerCase())
     );

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900">Kelola TEFA</h1>
                         <p className="mt-1 text-sm text-gray-500">
                              Kelola TEFA untuk setiap jurusan di kampus Anda
                         </p>
                    </div>
                    <button
                         onClick={handleOpenAddModal}
                         className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                         <Plus size={20} className="mr-2" />
                         Tambah TEFA
                    </button>
               </div>

               {/* Search */}
               <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="relative">
                         <Search
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                              size={20}
                         />
                         <input
                              type="text"
                              placeholder="Cari nama TEFA atau jurusan..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                         />
                    </div>
               </div>

               {/* TEFA Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                         <>
                              <div className="col-span-full">
                                   <TefaCardSkeleton count={6} />
                              </div>
                         </>
                    ) : filteredTefas.length === 0 ? (
                         <div className="col-span-full text-center py-12 text-gray-500">
                              {searchTerm
                                   ? "Tidak ada TEFA ditemukan"
                                   : "Belum ada TEFA. Tambahkan TEFA pertama Anda!"}
                         </div>
                    ) : (
                         filteredTefas.map((tefa) => (
                              <div
                                   key={tefa.id}
                                   className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                              >
                                   <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                             <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                  {tefa.name}
                                             </h3>
                                             <p className="text-sm text-blue-600 font-medium">
                                                  {tefa.major}
                                             </p>
                                        </div>
                                   </div>

                                   {tefa.description && (
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                             {tefa.description}
                                        </p>
                                   )}

                                   <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="text-sm text-gray-500">
                                             {tefa._count?.products || 0} Product
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <button
                                                  onClick={() => handleOpenEditModal(tefa)}
                                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                             >
                                                  <Pencil size={18} />
                                             </button>
                                             <button
                                                  onClick={() => handleDeleteTefa(tefa.id)}
                                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                             >
                                                  <Trash2 size={18} />
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         ))
                    )}
               </div>

               {/* Modal */}
               <TefaModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmitTefa}
                    initialData={selectedTefa}
                    mode={modalMode}
               />
          </div>
     );
}
