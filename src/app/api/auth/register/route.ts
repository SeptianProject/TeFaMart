/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password, role, industryName, campusName } =
      await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 },
      );
    }

    // Validasi role
    const validRoles = ["CLIENT", "INDUSTRI", "ADMIN"];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
    }

    // Validasi field tambahan berdasarkan role
    if (role === "INDUSTRI" && !industryName?.trim()) {
      return NextResponse.json(
        { error: "Nama industri harus diisi" },
        { status: 400 },
      );
    }

    if (role === "ADMIN" && !campusName?.trim()) {
      return NextResponse.json(
        { error: "Nama instansi/campus harus diisi" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      role: role || "CLIENT",
      // CLIENT langsung APPROVED, INDUSTRI & ADMIN perlu approval
      status: role === "CLIENT" ? "APPROVED" : "PENDING",
    };

    // Handle INDUSTRI - buat Industry baru
    if (role === "INDUSTRI") {
      const industry = await prisma.industry.create({
        data: {
          name: industryName,
        },
      });
      userData.industryId = industry.id;
    }

    // Handle ADMIN - buat Campus baru
    if (role === "ADMIN") {
      const campus = await prisma.campus.create({
        data: {
          name: campusName,
        },
      });
      userData.campusId = campus.id;
    }

    const user = await prisma.user.create({
      data: userData,
    });

    const { password: _, ...userWithoutPassword } = user;

    const message =
      role === "CLIENT"
        ? "Registrasi berhasil"
        : "Registrasi berhasil. Akun Anda sedang menunggu persetujuan dari admin.";

    return NextResponse.json(
      {
        message,
        user: userWithoutPassword,
        needsApproval: role !== "CLIENT",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat registrasi" },
      { status: 500 },
    );
  }
}
