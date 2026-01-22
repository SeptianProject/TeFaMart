"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createRequest,
  type CreateRequestData,
} from "@/services/requestService";

interface RequestFormProps {
  productId: string;
  productName: string;
  productPrice: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RequestForm({
  productId,
  productName,
  productPrice,
  onSuccess,
  onCancel,
}: RequestFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<
    Omit<CreateRequestData, "productId">
  >({
    clientName: "",
    clientEmail: "",
    quantity: 1,
    type: "PURCHASE_ORDER",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? parseInt(value) : value,
    }));
  };

  const calculateTotal = () => {
    return productPrice * formData.quantity;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createRequest({
        productId,
        ...formData,
      });

      alert("Permintaan berhasil dikirim!");

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Permintaan</h2>

      {/* Product Info */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Produk</h3>
        <p className="text-lg font-semibold text-gray-900">{productName}</p>
        <p className="text-sm text-gray-600">
          Harga: {formatCurrency(productPrice)} per unit
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Name */}
        <div>
          <label
            htmlFor="clientName"
            className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        {/* Client Email */}
        <div>
          <label
            htmlFor="clientEmail"
            className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="clientEmail"
            name="clientEmail"
            value={formData.clientEmail}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="email@example.com"
          />
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-gray-700 mb-1">
            Jumlah <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Request Type */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1">
            Tipe Permintaan <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="PURCHASE_ORDER">Purchase Order</option>
            <option value="INVESTMENT">Investasi</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1">
            Catatan (Opsional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Tambahkan catatan atau permintaan khusus..."
          />
        </div>

        {/* Total */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Total Estimasi:
            </span>
            <span className="text-xl font-bold text-blue-600">
              {formatCurrency(calculateTotal())}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? "Mengirim..." : "Kirim Permintaan"}
          </button>
        </div>
      </form>
    </div>
  );
}
