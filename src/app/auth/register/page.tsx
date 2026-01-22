"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    industryName: "", // Untuk role INDUSTRI
    campusName: "", // Untuk role ADMIN
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect jika tidak ada role parameter
  useEffect(() => {
    if (!roleParam || !["CLIENT", "INDUSTRI", "ADMIN"].includes(roleParam)) {
      router.push("/auth");
    }
  }, [roleParam, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper untuk mendapatkan label role dalam bahasa Indonesia
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "CLIENT":
        return "Masyarakat Umum";
      case "INDUSTRI":
        return "Mitra Industri";
      case "ADMIN":
        return "Internal Tefa";
      default:
        return role;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi
    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak sama");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    // Validasi tambahan untuk INDUSTRI dan ADMIN
    if (roleParam === "INDUSTRI" && !formData.industryName.trim()) {
      setError("Nama industri harus diisi");
      return;
    }

    if (roleParam === "ADMIN" && !formData.campusName.trim()) {
      setError("Nama instansi/campus harus diisi");
      return;
    }

    setIsLoading(true);

    try {
      const requestBody: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: roleParam,
      };

      // Tambahkan industryName atau campusName sesuai role
      if (roleParam === "INDUSTRI") {
        requestBody.industryName = formData.industryName;
      } else if (roleParam === "ADMIN") {
        requestBody.campusName = formData.campusName;
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registrasi gagal");
      }

      // Untuk INDUSTRI dan ADMIN, tampilkan pesan pending approval
      if (roleParam === "INDUSTRI" || roleParam === "ADMIN") {
        setError("");
        // Redirect ke halaman success atau login dengan pesan
        router.push("/auth/login?message=pending");
        return;
      }

      // Auto login untuk CLIENT
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Registrasi berhasil, silakan login");
        router.push("/auth/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Biarkan auth callback yang menentukan redirect berdasarkan role
      await signIn("google");
    } catch (error) {
      setError("Terjadi kesalahan saat login dengan Google");
      setIsLoading(false);
    }
  };

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
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-xl border-none shadow-none bg-gray-50 space-y-5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/auth"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Kembali ke pilihan role
              </Link>
            </div>
            <CardTitle className="text-5xl font-bold text-left">
              Buat akun <br />
              sekarang juga
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Nama Lengkap"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                {/* Input tambahan untuk INDUSTRI */}
                {roleParam === "INDUSTRI" && (
                  <div className="space-y-2">
                    <Label htmlFor="industryName">Nama Industri</Label>
                    <Input
                      id="industryName"
                      name="industryName"
                      type="text"
                      required
                      placeholder="PT. Nama Perusahaan"
                      value={formData.industryName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Akun Anda akan diverifikasi oleh admin sebelum dapat
                      digunakan
                    </p>
                  </div>
                )}

                {/* Input tambahan untuk ADMIN */}
                {roleParam === "ADMIN" && (
                  <div className="space-y-2">
                    <Label htmlFor="campusName">Nama Instansi/Campus</Label>
                    <Input
                      id="campusName"
                      name="campusName"
                      type="text"
                      required
                      placeholder="SMK/Universitas Nama Instansi"
                      value={formData.campusName}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Akun Anda akan diverifikasi oleh super admin sebelum dapat
                      digunakan
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="nama@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="Konfirmasi Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="text-muted-foreground text-sm">
                <p>
                  Sudah punya akun?{" "}
                  <Link
                    href="/auth/login"
                    className="text-accent hover:underline">
                    Masuk Sekarang
                  </Link>
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Memproses..." : "Daftar"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau daftar dengan
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full rounded-full">
                <svg
                  className="w-5 h-5 mr-2 rounded-full"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Daftar dengan Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }>
      <RegisterForm />
    </Suspense>
  );
}
