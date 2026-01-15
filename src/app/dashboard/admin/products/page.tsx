"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
import Image from "next/image";
import ProductModal, { ProductFormData } from "@/components/ProductModal";
import { useAlert } from "@/hooks/useAlert";
import { ProductTableSkeleton } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  tefaId: string;
  tefa: {
    name: string;
    major: string;
  };
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedTefa, setSelectedTefa] = useState<ProductFormData | null>(
    null
  );
  const { showSuccess, showError, showConfirm, AlertComponent } = useAlert();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("create");
    setSelectedTefa(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setModalMode("edit");
    setSelectedTefa({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      imageUrl: product.imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleSubmitProduct = async (data: ProductFormData) => {
    try {
      if (modalMode === "create") {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("stock", data.stock.toString());
        formData.append("price", data.price.toString());
        if (data.imageUrl && typeof data.imageUrl === "object") {
          formData.append("imageUrl", data.imageUrl);
          console.log("imageUrl sudah masuk di formData");
        }
        const response = await fetch("/api/admin/products", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const newProduct = await response.json();
          setProducts([...products, newProduct]);
          showSuccess("Product berhasil ditambahkan", "Berhasil", 3000);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          showError("Gagal menambahkan product: " + error.message, "Error");
        }
      } else {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("stock", data.stock.toString());
        formData.append("price", data.price.toString());
        if (data.imageUrl && typeof data.imageUrl === "object") {
          formData.append("imageUrl", data.imageUrl);
          console.log("imageUrl sudah masuk di formData");
        }
        const response = await fetch(`/api/admin/products/${data.id}`, {
          method: "PUT",
          body: formData,
        });

        if (response.ok) {
          const updateProduct = await response.json();
          setProducts(
            products.map((product) =>
              product.id === updateProduct.id ? updateProduct : product
            )
          );
          showSuccess("Product berhasil diperbarui", "Berhasil", 3000);
          setIsModalOpen(false);
        } else {
          const error = await response.json();
          showError("Gagal memperbarui product: " + error.message, "Error");
        }
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      showError("Terjadi kesalahan saat menyimpan product", "Error");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const confirmed = await showConfirm(
      "Apakah Anda yakin ingin menghapus product ini? Tindakan ini tidak dapat dibatalkan.",
      "Konfirmasi Hapus",
      "Hapus",
      "Batal"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
        showSuccess("Product berhasil dihapus", "Berhasil", 3000);
      } else {
        showError("Gagal menghapus product", "Error");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      showError("Terjadi kesalahan saat menghapus product", "Error");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tefa.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tefa.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Product</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola product TEFA di kampus Anda
          </p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus size={20} className="mr-2" />
          Tambah Product
        </Button>
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
            placeholder="Cari nama product atau TEFA..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TEFA / Jurusan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
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
                    <ProductTableSkeleton rows={5} />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {searchTerm
                        ? "Tidak ada product ditemukan"
                        : "Belum ada product. Tambahkan product pertama Anda!"}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 shrink-0 relative bg-gray-100 rounded-lg overflow-hidden">
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                <Eye size={20} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {product.name}
                            </div>
                            {product.description && (
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {product.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.tefa.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.tefa.major}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.stock > 10
                              ? "bg-green-100 text-green-800"
                              : product.stock > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock} unit
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="text-primary hover:text-primary/80 p-1 hover:bg-primary/10 rounded cursor-pointer"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
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

      <ProductModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={selectedTefa}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitProduct}
      />

      <AlertComponent />
    </div>
  );
}
