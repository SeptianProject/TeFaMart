"use client";

import Navbar from "@/components/layout_client/Navbar";
import Footer from "@/components/layout_client/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Pencil } from "lucide-react";
import SidebarEditProfile from "@/components/ui/sidebarEditProfil";

export default function ProfileInformationPage() {
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
              {/* Avatar */}
              <div className="mb-6 flex justify-center lg:justify-start">
                <div className="relative inline-block">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-gray-200 sm:h-24 sm:w-24">
                    <Image
                      src="/assets/logo/logo-smea.png"
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow ring-2 ring-white hover:bg-blue-700 sm:h-8 sm:w-8"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              </div>

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
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 sm:w-auto">
                    Edit Info
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