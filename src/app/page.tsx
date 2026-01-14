"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      const role = session.user.role;

      if (role === "SUPER_ADMIN") {
        router.push("/dashboard/super-admin");
      } else if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Selamat Datang di TefaMart
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Platform manajemen TEFA (Teaching Factory) untuk mengelola produk dan permintaan
        </p>

        <div className="flex gap-4 justify-center">
          {status === "loading" ? (
            <Button disabled size="lg">
              Loading...
            </Button>
          ) : session ? (
            <Button onClick={handleGetStarted} size="lg">
              Masuk ke Dashboard
            </Button>
          ) : (
            <>
              <Button onClick={handleGetStarted} size="lg">
                Mulai Sekarang
              </Button>
              <Link href="/auth/register">
                <Button variant="outline" size="lg">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}