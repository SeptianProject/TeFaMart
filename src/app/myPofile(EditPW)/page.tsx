"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SidebarEditProfile from "@/components/ui/sidebarEditProfil";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfileEditPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);

  const passwordFields = [
    { label: "Password Saat Ini", value: "septian123" },
    { label: "Password Baru *", value: "" },
    { label: "Konfirmasi Password *", value: "" },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6 lg:px-5">
          {/* Breadcrumb */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Beranda</span>
            <span>›</span>
            <span className="font-medium text-black">My Profile</span>
          </div>

          <h1 className="mb-6 text-xl font-semibold lg:text-2xl">
            My Profile
          </h1>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
            {/* sidebar */}
            <SidebarEditProfile
              active="password"
              onLogout={() => console.log("logout")}
            />

            {/* content */}
            <section className="rounded-xl bg-white p-4 shadow sm:p-6">
              <form className="space-y-4">
                {passwordFields.map(({ label, value }) => (
                  <div key={label}>
                    <label className="block text-sm font-medium">
                      {label}
                    </label>

                    <div className="relative mt-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        defaultValue={value}
                        className="w-full rounded-lg border px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />

                      {/* icon hide */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-3">
                  <Button className="w-full sm:w-auto">
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