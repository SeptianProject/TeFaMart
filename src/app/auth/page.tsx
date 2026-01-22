import { Button } from "@/components/ui/button";
import { GraduationCap, Handshake, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const RolePage = () => {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-tertiary rounded-lg">
        <Image src="/logo-white.png" alt="logo white" width={80} height={80} />
        <div className="text-white space-y-4">
          <p className="text-6xl font-light">
            Selamat datang <br />
            di <span className="font-bold">TeFaMart!</span>
          </p>
          <p>Jelajahi hasil karya Siswa/Mahasiswa Indonesia.</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-4 sm:px-0">
        <div className="w-full max-w-xl space-y-8 sm:space-y-12 lg:space-y-16">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="TeFaMart Logo"
              width={80}
              height={80}
              className="object-contain"
            />
          </div>

          {/* Header */}
          <div className="space-y-2 text-foreground text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Buat akun sekarang juga
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Pilih tipe akun yang akan didaftarkan.
            </p>
          </div>

          {/* Role Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 w-full">
            <Link href="/auth/register?role=CLIENT" className="w-full">
              <Button
                size="icon-lg"
                variant="default"
                className="w-full h-auto py-4 px-6 text-base sm:text-lg gap-3 flex items-center justify-center shadow-md shadow-[#1F5197] bg-[#1F5197] hover:bg-[#1F5197]/90">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span>Masyarakat Umum</span>
              </Button>
            </Link>
            <Link href="/auth/register?role=INDUSTRI" className="w-full">
              <Button
                size="icon-lg"
                variant="default"
                className="w-full h-auto py-4 px-6 text-base sm:text-lg gap-3 flex items-center justify-center shadow-md shadow-[#10357D] bg-[#10357D] hover:bg-[#10357D]/90">
                <Handshake className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span>Mitra Industri</span>
              </Button>
            </Link>
            <Link href="/auth/register?role=ADMIN" className="w-full">
              <Button
                size="icon-lg"
                variant="default"
                className="w-full h-auto py-4 px-6 text-base sm:text-lg gap-3 flex items-center justify-center shadow-md shadow-accent bg-accent hover:bg-accent/90">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                <span>Internal Tefa</span>
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm sm:text-base text-foreground">
              Sudah punya akun?{" "}
              <Link
                href="/auth/login"
                className="text-accent hover:text-accent/80 font-semibold">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePage;
