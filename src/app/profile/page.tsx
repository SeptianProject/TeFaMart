"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, EyeOff, User, Lock, LogOut, Pencil, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Alert, { AlertType } from "@/components/Alert";

interface UserData {
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  province: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // State Utama User
  const [user, setUser] = useState<UserData>({
    name: "",
    email: "",
    image: "",
    phoneNumber: "",
    address: "",
    city: "",
    province: "",
  });

  // State untuk Tab & UI
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [showPassword, setShowPassword] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. STATE UNTUK MENGONTROL ALERT
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    type: AlertType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
  });

  // Helper untuk menutup alert
  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // State untuk Image Upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // State untuk Password Form
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_new_password: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchDataUser();
    }
  }, [status, router]);

  async function fetchDataUser() {
    try {
      setLoadingData(true);
      const res = await fetch("/api/client/account");
      if (res.ok) {
        const dataUser = await res.json();
        setUser({
          name: dataUser.name || "",
          email: dataUser.email || "",
          image: dataUser.image || "",
          phoneNumber: dataUser.phoneNumber || "",
          address: dataUser.address || "",
          city: dataUser.city || "",
          province: dataUser.province || "",
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    } finally {
      setLoadingData(false);
    }
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("phoneNumber", user.phoneNumber);
      formData.append("address", user.address);
      formData.append("city", user.city);
      formData.append("province", user.province);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch("/api/client/account", {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal update profil");

      // 3. GANTI ALERT BIASA DENGAN SET ALERT CONFIG (SUKSES)
      setAlertConfig({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Profil Anda berhasil diperbarui!",
      });
      
      setUser((prev) => ({ ...prev, ...data }));
      setImageFile(null);
      
    } catch (error: any) {
      // 3. GANTI ALERT BIASA DENGAN SET ALERT CONFIG (ERROR)
      setAlertConfig({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: error.message || "Terjadi kesalahan saat update profil",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      // 3. ALERT WARNING
      setAlertConfig({
        isOpen: true,
        type: "warning",
        title: "Perhatian",
        message: "Password baru dan konfirmasi password tidak cocok!",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/client/account/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal ganti password");

      // 3. ALERT SUKSES
      setAlertConfig({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Password berhasil diubah!",
      });

      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_new_password: "",
      });
    } catch (error: any) {
      // 3. ALERT ERROR
      setAlertConfig({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  if (status === "loading" || loadingData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-6 lg:px-5">
            <Skeleton className="h-5 w-48 mb-6" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <div className="bg-white p-6 rounded-xl shadow space-y-6">
                <div className="flex gap-4 items-center">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!session) return null;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 lg:px-5">
          {/* Breadcrumb */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Beranda</span>
            <span>›</span>
            <span className="font-medium text-black">Profil Saya</span>
          </div>

          <h1 className="mb-6 text-xl font-semibold lg:text-2xl">
            Pengaturan Akun
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr]">
            {/* --- SIDEBAR MENU --- */}
            <aside className="flex flex-col gap-2 rounded-xl bg-white p-4 shadow h-fit">
              <button
                onClick={() => setActiveTab("info")}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "info"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User size={18} />
                Edit Profil
              </button>

              <button
                onClick={() => setActiveTab("password")}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === "password"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Lock size={18} />
                Ubah Password
              </button>

              <hr className="my-2 border-gray-100" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={18} />
                Keluar
              </button>
            </aside>

            {/* --- CONTENT AREA --- */}
            <section className="rounded-xl bg-white p-4 shadow sm:p-6 min-h-100">
              
              {/* === TAB 1: EDIT PROFIL === */}
              {activeTab === "info" && (
                <div className="animate-in fade-in zoom-in duration-300">
                  <h2 className="mb-6 text-lg font-semibold text-gray-800 border-b pb-3">
                    Informasi Pribadi
                  </h2>

                  {/* Foto Profil */}
                  <div className="mb-8 flex justify-center lg:justify-start">
                    <div className="relative inline-block group">
                      <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center relative">
                        {imagePreview ? (
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                          />
                        ) : user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "Profile"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-gray-400">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        )}
                        
                        {/* Overlay loading jika upload */}
                        {isSubmitting && imageFile && (
                           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-white animate-spin" />
                           </div>
                        )}
                      </div>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      
                      <button
                        type="button"
                        onClick={handleImageClick}
                        className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors z-10"
                        title="Ganti Foto Profil"
                      >
                        <Pencil size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Form Profil */}
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={user.name}
                          onChange={(e) => setUser({ ...user, name: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          readOnly
                          className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500 focus:outline-none cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          No. Handphone
                        </label>
                        <input
                          type="text"
                          value={user.phoneNumber}
                          onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
                          placeholder="08xxxxxxxxxx"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alamat Lengkap
                        </label>
                        <input
                          type="text"
                          value={user.address}
                          onChange={(e) => setUser({ ...user, address: e.target.value })}
                          placeholder="Nama Jalan, RT/RW"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kota/Kabupaten
                        </label>
                        <input
                          type="text"
                          value={user.city}
                          onChange={(e) => setUser({ ...user, city: e.target.value })}
                          placeholder="Contoh: Banyuwangi"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Provinsi
                        </label>
                        <input
                          type="text"
                          value={user.province}
                          onChange={(e) => setUser({ ...user, province: e.target.value })}
                          placeholder="Contoh: Jawa Timur"
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full bg-orange-500 hover:bg-orange-600 sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Menyimpan...
                          </>
                        ) : (
                          "Simpan Profil"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* === TAB 2: UBAH PASSWORD === */}
              {activeTab === "password" && (
                <div className="animate-in fade-in zoom-in duration-300">
                  <h2 className="mb-6 text-lg font-semibold text-gray-800 border-b pb-3">
                    Keamanan Akun
                  </h2>
                  
                  <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Saat Ini
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.current_password}
                          onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                          placeholder="Masukkan password lama"
                          required
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.new_password}
                          onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                          placeholder="Masukkan password baru"
                          required
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Konfirmasi Password Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordForm.confirm_new_password}
                          onChange={(e) => setPasswordForm({...passwordForm, confirm_new_password: e.target.value})}
                          placeholder="Ulangi password baru"
                          required
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                         {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

            </section>
          </div>
        </div>
      </div>

      <Footer />

      {/* 4. RENDER KOMPONEN ALERT */}
      {alertConfig.isOpen && (
        <Alert
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          onClose={closeAlert}
          autoClose={alertConfig.type === "success" ? 2000 : undefined} // Auto close jika sukses
        />
      )}
    </>
  );
}