"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { TableSkeleton } from "@/components/Skeleton";
import FormModal from "@/components/ui/FormModal";

interface User {
     id: string;
     name: string | null;
     email: string;
     role: string;
     campusId: string | null;
     campus?: {
          name: string;
     } | null;
     createdAt: string;
}

export default function UsersPage() {
     const [users, setUsers] = useState<User[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState("");
     const [filterRole, setFilterRole] = useState<string>("ALL");

     useEffect(() => {
          fetchUsers();
     }, []);

     const fetchUsers = async () => {
          try {
               const response = await fetch("/api/super-admin/users");
               if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
               }
          } catch (error) {
               console.error("Error fetching users:", error);
          } finally {
               setLoading(false);
          }
     };

     const handleDeleteUser = async (userId: string) => {
          if (!confirm("Apakah Anda yakin ingin menghapus user ini?")) return;

          try {
               const response = await fetch(`/api/super-admin/users/${userId}`, {
                    method: "DELETE",
               });

               if (response.ok) {
                    setUsers(users.filter((user) => user.id !== userId));
                    alert("User berhasil dihapus");
               } else {
                    alert("Gagal menghapus user");
               }
          } catch (error) {
               console.error("Error deleting user:", error);
               alert("Terjadi kesalahan saat menghapus user");
          }
     };

     const filteredUsers = users.filter((user) => {
          const matchSearch =
               user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase());
          const matchRole = filterRole === "ALL" || user.role === filterRole;

          return matchSearch && matchRole;
     });

     const getRoleBadge = (role: string) => {
          const roleColors: Record<string, string> = {
               SUPER_ADMIN: "bg-red-100 text-red-800",
               ADMIN: "bg-primary/10 text-primary",
               CLIENT: "bg-green-100 text-green-800",
          };

          return (
               <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${roleColors[role] || "bg-gray-100 text-gray-800"
                         }`}
               >
                    {role}
               </span>
          );
     };

     return (
          <div className="space-y-6">
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900">Kelola User</h1>
                         <p className="mt-1 text-sm text-gray-500">
                              Kelola semua user di platform TefaMart
                         </p>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                         <Plus size={20} className="mr-2" />
                         Tambah User
                    </button>
               </div>

               {/* Filters */}
               <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="relative">
                              <Search
                                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                   size={20}
                              />
                              <input
                                   type="text"
                                   placeholder="Cari nama atau email..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              />
                         </div>
                         <div>
                              <select
                                   value={filterRole}
                                   onChange={(e) => setFilterRole(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              >
                                   <option value="ALL">Semua Role</option>
                                   <option value="SUPER_ADMIN">Super Admin</option>
                                   <option value="ADMIN">Admin</option>
                                   <option value="CLIENT">Client</option>
                              </select>
                         </div>
                    </div>
               </div>

               {/* Users Table */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                   <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Kampus
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Tanggal Dibuat
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Aksi
                                        </th>
                                   </tr>
                              </thead>
                              {loading ? (
                                   <tbody>
                                        <tr>
                                             <td colSpan={5} className="p-0">
                                                  <TableSkeleton rows={5} columns={5} />
                                             </td>
                                        </tr>
                                   </tbody>
                              ) : (
                                   <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.length === 0 ? (
                                             <tr>
                                                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                                       Tidak ada user ditemukan
                                                  </td>
                                             </tr>
                                        ) : (
                                             filteredUsers.map((user) => (
                                                  <tr key={user.id} className="hover:bg-gray-50">
                                                       <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                 <div className="text-sm font-medium text-gray-900">
                                                                      {user.name || "Tidak ada nama"}
                                                                 </div>
                                                                 <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap">
                                                            {getRoleBadge(user.role)}
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {user.campus?.name || "-"}
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(user.createdAt).toLocaleDateString("id-ID")}
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex items-center justify-end gap-2">
                                                                 <button className="text-primary hover:text-primary/80 p-1 hover:bg-primary/10 rounded cursor-pointer">
                                                                      <Pencil size={18} />
                                                                 </button>
                                                                 <button
                                                                      onClick={() => handleDeleteUser(user.id)}
                                                                      className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded cursor-pointer"
                                                                 >
                                                                      <Trash2 size={18} />
                                                                 </button>
                                                            </div>
                                                       </td>
                                                  </tr>
                                             ))
                                        )}
                                   </tbody>
                              )}
                         </table>
                    </div>
               </div>
          </div>
     );
}
