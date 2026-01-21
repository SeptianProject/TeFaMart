"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import SidebarEditProfile from "@/components/ui/sidebarEditProfil";

export default function ProfileEditPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 lg:px-5">
          {/* Breadcrumb */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Beranda</span>
            <span>›</span>
            <span className="text-black font-medium">My Profile</span>
          </div>

          <h1 className="mb-6 text-xl font-semibold lg:text-2xl">
            My Profile
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            {/* SIDEBAR */}
            <SidebarEditProfile
              active="info"
              onLogout={() => console.log("logout")}
            />

            {/* CONTENT */}
            <section className="rounded-xl bg-white p-4 shadow sm:p-6">
              {/* FORM */}
              <form className="space-y-4">
                {[
                  ["Nama *", "Septian"],
                  ["Email", "septian@gmail.com"],
                  ["No. Hp *", "081234567890"],
                  ["Alamat *", "Jalan"],
                  ["Kota/Kabupaten *", "Banyuwangi"],
                  ["Provinsi *", "Jawa Timur"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="block text-sm font-medium">
                      {label}
                    </label>
                    <input
                      defaultValue={value}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <div className="pt-3">
                  <Button className="w-full outline sm:w-auto">
                    Konfirmasi
                  </Button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
