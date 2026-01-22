/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { memo, useState, useEffect, Suspense } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const messageParam = searchParams.get("message");
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Tampilkan pesan pending jika ada
    if (messageParam === "pending") {
      setSuccessMessage(
        "Registrasi berhasil! Akun Anda sedang menunggu persetujuan dari admin. Anda akan menerima notifikasi setelah akun disetujui.",
      );
    }
  }, [messageParam]);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const role = session.user.role;
      console.log("User authenticated with role:", role);
      console.log("Full session:", session);
      const redirectPath =
        role === "USER"
          ? "/"
          : role === "SUPER_ADMIN"
            ? "/dashboard/super-admin"
            : role === "ADMIN"
              ? "/dashboard/admin"
              : "/";
      console.log("Redirecting to:", redirectPath);
      window.location.href = redirectPath;
    }
  }, [status, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else if (result?.ok) {
        // Login berhasil, session akan ter-update dan useEffect akan handle redirect
        // Tidak perlu set isLoading false karena akan redirect
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
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

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden bg-linear-to-br from-primary via-secondary to-tertiary rounded-lg">
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
            <CardTitle className="text-5xl font-bold text-left">
              Login ke akun <br />
              Anda
            </CardTitle>
            <CardDescription className="text-left">
              <p>Masuk untuk berbelanja</p>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {successMessage && (
                <div className="rounded-md bg-primary/10 p-4 border border-primary/20">
                  <div className="text-sm text-primary">{successMessage}</div>
                </div>
              )}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="nama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="text-muted-foreground text-sm">
                <p>
                  Belum punya akun?{" "}
                  <a href="/auth" className="text-accent hover:underline">
                    Daftar Sekarang
                  </a>
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full">
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau lanjutkan dengan
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
                  className="w-5 h-5 mr-2"
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
                Masuk dengan Google
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }>
      <LoginForm />
    </Suspense>
  );
}
