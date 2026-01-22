/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "../../generated/prisma/client";
import bcrypt from "bcryptjs";

interface SeedUsersResult {
  superAdmin: any;
  adminPoliwangi: any;
  adminPNJ: any;
  adminPolban: any;
  client: any;
  industri: any;
}

export async function seedUsers(
  prisma: PrismaClient,
  campusIds: { campus1: string; campus2: string; campus3: string },
): Promise<SeedUsersResult> {
  console.log("👥 Seeding Users...");

  const hashedPassword = await bcrypt.hash("password123", 10);

  // Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@tefamart.com" },
    update: {
      role: "SUPER_ADMIN",
      password: hashedPassword,
      status: "APPROVED",
    },
    create: {
      email: "superadmin@tefamart.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      status: "APPROVED",
    },
  });

  // Admin Politeknik Negeri Banyuwangi
  const adminPoliwangi = await prisma.user.upsert({
    where: { email: "admin@poliwangi.ac.id" },
    update: {
      role: "ADMIN",
      password: hashedPassword,
      campusId: campusIds.campus1,
      status: "APPROVED",
    },
    create: {
      email: "admin@poliwangi.ac.id",
      name: "Admin Politeknik Negeri Banyuwangi",
      password: hashedPassword,
      role: "ADMIN",
      campusId: campusIds.campus1,
      address: "Jl. Raya Jember KM 13, Labanasem",
      city: "Banyuwangi",
      province: "Jawa Timur",
      phoneNumber: "0333-636780",
      status: "APPROVED",
    },
  });

  // Admin Politeknik Negeri Jakarta
  const adminPNJ = await prisma.user.upsert({
    where: { email: "admin@pnj.ac.id" },
    update: {
      role: "ADMIN",
      password: hashedPassword,
      campusId: campusIds.campus2,
      status: "APPROVED",
    },
    create: {
      email: "admin@pnj.ac.id",
      name: "Admin Politeknik Negeri Jakarta",
      password: hashedPassword,
      role: "ADMIN",
      campusId: campusIds.campus2,
      address: "Jl. Prof. DR. G.A. Siwabessy, Kampus Baru UI Depok",
      city: "Depok",
      province: "Jawa Barat",
      phoneNumber: "021-7270036",
      status: "APPROVED",
    },
  });

  // Admin Politeknik Negeri Bandung
  const adminPolban = await prisma.user.upsert({
    where: { email: "admin@polban.ac.id" },
    update: {
      role: "ADMIN",
      password: hashedPassword,
      campusId: campusIds.campus3,
      status: "APPROVED",
    },
    create: {
      email: "admin@polban.ac.id",
      name: "Admin Politeknik Negeri Bandung",
      password: hashedPassword,
      role: "ADMIN",
      campusId: campusIds.campus3,
      address: "Jl. Gegerkalong Hilir, Ds. Ciwaruga",
      city: "Bandung",
      province: "Jawa Barat",
      phoneNumber: "022-2013789",
      status: "APPROVED",
    },
  });

  // Client User
  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {
      role: "CLIENT",
      password: hashedPassword,
      status: "APPROVED",
    },
    create: {
      email: "client@example.com",
      name: "Client Test",
      password: hashedPassword,
      role: "CLIENT",
      address: "Jl. Contoh No. 123",
      city: "Jakarta",
      province: "DKI Jakarta",
      phoneNumber: "081234567890",
      status: "APPROVED",
    },
  });

  // Industri User (Pending Approval)
  const industri = await prisma.user.upsert({
    where: { email: "industri@example.com" },
    update: {
      role: "INDUSTRI",
      password: hashedPassword,
      status: "PENDING",
    },
    create: {
      email: "industri@example.com",
      name: "PT Industri Example",
      password: hashedPassword,
      role: "INDUSTRI",
      address: "Kawasan Industri",
      city: "Surabaya",
      province: "Jawa Timur",
      phoneNumber: "081234567899",
      status: "PENDING",
    },
  });

  console.log(`   ✅ Super Admin: ${superAdmin.email}`);
  console.log(`   ✅ Admin Poliwangi: ${adminPoliwangi.email}`);
  console.log(`   ✅ Admin PNJ: ${adminPNJ.email}`);
  console.log(`   ✅ Admin Polban: ${adminPolban.email}`);
  console.log(`   ✅ Client: ${client.email}`);
  console.log(`   ✅ Industri (Pending): ${industri.email}`);

  return {
    superAdmin,
    adminPoliwangi,
    adminPNJ,
    adminPolban,
    client,
    industri,
  };
}
