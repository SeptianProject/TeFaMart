"use client";

import { useEffect, useState } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { TableSkeleton } from "@/components/Skeleton";

interface Request {
     id: string;
     productId: string;
     product: {
          name: string;
          price: number;
          tefa: {
               name: string;
               major: string;
          };
     };
     clientName: string;
     clientEmail: string;
     quantity: number;
     type: "PURCHASE_ORDER" | "INVESTMENT";
     status: "PENDING" | "APPROVED" | "REJECTED";
     notes: string | null;
     createdAt: string;
}

export default function RequestsPage() {
     const [requests, setRequests] = useState<Request[]>([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState<string>("");
     const [filterStatus, setFilterStatus] = useState<string>("ALL");
     const [filterType, setFilterType] = useState<string>("ALL");

     useEffect(() => {
          fetchRequests();
     }, []);

     const fetchRequests = async () => {
          try {
               const response = await fetch("/api/admin/requests");
               if (response.ok) {
                    const data = await response.json();
                    setRequests(data);
               }
          } catch (error) {
               console.error("Error fetching requests:", error);
          } finally {
               setLoading(false);
          }
     };

     const handleUpdateStatus = async (
          requestId: string,
          status: "APPROVED" | "REJECTED"
     ) => {
          const message =
               status === "APPROVED"
                    ? "Apakah Anda yakin ingin menyetujui permintaan ini?"
                    : "Apakah Anda yakin ingin menolak permintaan ini?";

          if (!confirm(message)) return;

          try {
               const response = await fetch(`/api/admin/requests/${requestId}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status }),
               });

               if (response.ok) {
                    await response.json();
                    setRequests(
                         requests.map((req) =>
                              req.id === requestId ? { ...req, status } : req
                         )
                    );
                    alert(
                         `Permintaan berhasil ${status === "APPROVED" ? "disetujui" : "ditolak"
                         }`
                    );
               } else {
                    alert("Gagal memperbarui status permintaan");
               }
          } catch (error) {
               console.error("Error updating request status:", error);
               alert("Terjadi kesalahan saat memperbarui status");
          }
     };

     const filteredRequests = requests.filter((request: Request) => {
          const matchSearch =
               request?.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               request?.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               request?.product?.name?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchStatus =
               filterStatus === "ALL" || request.status === filterStatus;
          const matchType = filterType === "ALL" || request.type === filterType;

          return matchSearch && matchStatus && matchType;
     });

     const getStatusBadge = (status: string) => {
          const statusStyles: Record<string, string> = {
               PENDING: "bg-yellow-100 text-yellow-800",
               APPROVED: "bg-green-100 text-green-800",
               REJECTED: "bg-red-100 text-red-800",
          };

          const statusText: Record<string, string> = {
               PENDING: "Pending",
               APPROVED: "Disetujui",
               REJECTED: "Ditolak",
          };

          return (
               <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || "bg-gray-100 text-gray-800"
                         }`}
               >
                    {statusText[status] || status}
               </span>
          );
     };

     const getTypeBadge = (type: string) => {
          const typeStyles: Record<string, string> = {
               PURCHASE_ORDER: "bg-blue-100 text-blue-800",
               INVESTMENT: "bg-purple-100 text-purple-800",
          };

          const typeText: Record<string, string> = {
               PURCHASE_ORDER: "Purchase Order",
               INVESTMENT: "Investasi",
          };

          return (
               <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${typeStyles[type] || "bg-gray-100 text-gray-800"
                         }`}
               >
                    {typeText[type] || type}
               </span>
          );
     };

     const formatCurrency = (value: number) => {
          return new Intl.NumberFormat("id-ID", {
               style: "currency",
               currency: "IDR",
          }).format(value);
     };

     return (
          <div className="space-y-6 pb-20 ">
               <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-2xl font-bold text-gray-900">
                              Kelola Permintaan
                         </h1>
                         <p className="mt-1 text-sm text-gray-500">
                              Review dan kelola permintaan dari client
                         </p>
                    </div>
               </div>

               {/* Filters */}
               <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="relative">
                              <Search
                                   className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                   size={20}
                              />
                              <input
                                   type="text"
                                   placeholder="Cari client atau product..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                         </div>
                         <div>
                              <select
                                   value={filterStatus}
                                   onChange={(e) => setFilterStatus(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                   <option value="ALL">Semua Status</option>
                                   <option value="PENDING">Pending</option>
                                   <option value="APPROVED">Disetujui</option>
                                   <option value="REJECTED">Ditolak</option>
                              </select>
                         </div>
                         <div>
                              <select
                                   value={filterType}
                                   onChange={(e) => setFilterType(e.target.value)}
                                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                   <option value="ALL">Semua Tipe</option>
                                   <option value="PURCHASE_ORDER">Purchase Order</option>
                                   <option value="INVESTMENT">Investasi</option>
                              </select>
                         </div>
                    </div>
               </div>

               {/* Requests Table */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                   <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Client
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Tipe
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                             Aksi
                                        </th>
                                   </tr>
                              </thead>
                              {loading ? (
                                   <tbody>
                                        <tr>
                                             <td colSpan={7} className="p-0">
                                                  <TableSkeleton rows={5} columns={7} />
                                             </td>
                                        </tr>
                                   </tbody>
                              ) : (
                                   <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredRequests.length === 0 ? (
                                             <tr>
                                                  <td
                                                       colSpan={7}
                                                       className="px-6 py-4 text-center text-gray-500"
                                                  >
                                                       {searchTerm
                                                            ? "Tidak ada permintaan ditemukan"
                                                            : "Belum ada permintaan"}
                                                  </td>
                                             </tr>
                                        ) : (
                                             filteredRequests.map((request) => (
                                                  <tr key={request.id} className="hover:bg-gray-50">
                                                       <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                 <div className="text-sm font-medium text-gray-900">
                                                                      {request.clientName}
                                                                 </div>
                                                                 <div className="text-sm text-gray-500">
                                                                      {request.clientEmail}
                                                                 </div>
                                                            </div>
                                                       </td>
                                                       <td className="px-6 py-4">
                                                            <div className="text-sm text-gray-900">
                                                                 {request.product.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                 {request.product.tefa.name} -{" "}
                                                                 {request.product.tefa.major}
                                                            </div>
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {request.quantity} unit
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatCurrency(request.product.price * request.quantity)}
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap">
                                                            {getTypeBadge(request.type)}
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap">
                                                            {getStatusBadge(request.status)}
                                                       </td>
                                                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            {request.status === "PENDING" ? (
                                                                 <div className="flex items-center justify-end gap-2">
                                                                      <button
                                                                           onClick={() =>
                                                                                handleUpdateStatus(request.id, "APPROVED")
                                                                           }
                                                                           className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded"
                                                                           title="Setujui"
                                                                      >
                                                                           <CheckCircle size={18} />
                                                                      </button>
                                                                      <button
                                                                           onClick={() =>
                                                                                handleUpdateStatus(request.id, "REJECTED")
                                                                           }
                                                                           className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                                                                           title="Tolak"
                                                                      >
                                                                           <XCircle size={18} />
                                                                      </button>
                                                                 </div>
                                                            ) : (
                                                                 <span className="text-gray-400 text-xs">
                                                                      {request.status === "APPROVED"
                                                                           ? "Disetujui"
                                                                           : "Ditolak"}
                                                                 </span>
                                                            )}
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
