import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting seeding...");

  // Create Campus
  const campus1 = await prisma.campus.upsert({
    where: { id: "campus-1" },
    update: {},
    create: {
      id: "campus-1",
      name: "Politeknik Negeri Jakarta",
      location: "Jakarta",
      description: "Kampus vokasi terkemuka di Jakarta",
    },
  });

  const campus2 = await prisma.campus.upsert({
    where: { id: "campus-2" },
    update: {},
    create: {
      id: "campus-2",
      name: "Politeknik Negeri Bandung",
      location: "Bandung",
      description: "Kampus vokasi terkemuka di Bandung",
    },
  });

  console.log("Kampus created");

  // Create Users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@tefamart.com" },
    update: {},
    create: {
      email: "superadmin@tefamart.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  const admin1 = await prisma.user.upsert({
    where: { email: "admin.pnj@tefamart.com" },
    update: {},
    create: {
      email: "admin.pnj@tefamart.com",
      name: "Admin PNJ",
      password: hashedPassword,
      role: "ADMIN",
      campusId: campus1.id,
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: "admin.polban@tefamart.com" },
    update: {},
    create: {
      email: "admin.polban@tefamart.com",
      name: "Admin Polban",
      password: hashedPassword,
      role: "ADMIN",
      campusId: campus2.id,
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {},
    create: {
      email: "client@example.com",
      name: "Client Test",
      password: hashedPassword,
      role: "CLIENT",
    },
  });

  console.log("Users created");

  // Create TEFA for Campus 1
  const tefa1 = await prisma.tefa.create({
    data: {
      name: "TEFA Teknik Informatika",
      major: "Teknik Informatika",
      description: "Teaching Factory untuk jurusan Teknik Informatika",
      campusId: campus1.id,
    },
  });

  const tefa2 = await prisma.tefa.create({
    data: {
      name: "TEFA Teknik Mesin",
      major: "Teknik Mesin",
      description: "Teaching Factory untuk jurusan Teknik Mesin",
      campusId: campus1.id,
    },
  });

  // Create TEFA for Campus 2
  const tefa3 = await prisma.tefa.create({
    data: {
      name: "TEFA Teknik Elektro",
      major: "Teknik Elektro",
      description: "Teaching Factory untuk jurusan Teknik Elektro",
      campusId: campus2.id,
    },
  });

  console.log("✅ TEFA created");

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: "Website Company Profile",
        description: "Pembuatan website company profile profesional",
        price: 5000000,
        stock: 10,
        tefaId: tefa1.id,
      },
      {
        name: "Aplikasi Mobile Android",
        description: "Pengembangan aplikasi mobile berbasis Android",
        price: 15000000,
        stock: 5,
        tefaId: tefa1.id,
      },
      {
        name: "Sistem Informasi Manajemen",
        description: "Pembuatan sistem informasi manajemen terintegrasi",
        price: 25000000,
        stock: 3,
        tefaId: tefa1.id,
      },
      {
        name: "Mesin CNC Custom",
        description: "Pembuatan mesin CNC sesuai kebutuhan",
        price: 50000000,
        stock: 2,
        tefaId: tefa2.id,
      },
      {
        name: "Komponen Mesin Presisi",
        description: "Produksi komponen mesin dengan presisi tinggi",
        price: 2000000,
        stock: 20,
        tefaId: tefa2.id,
      },
      {
        name: "Panel Listrik Industri",
        description: "Pembuatan panel listrik untuk industri",
        price: 8000000,
        stock: 8,
        tefaId: tefa3.id,
      },
      {
        name: "Sistem Kontrol Otomatis",
        description: "Instalasi sistem kontrol otomatis berbasis PLC",
        price: 12000000,
        stock: 4,
        tefaId: tefa3.id,
      },
    ],
  });

  console.log("Products created");

  const products = await prisma.product.findMany({ take: 3 });

  await prisma.request.createMany({
    data: [
      {
        productId: products[0].id,
        clientName: "PT. Tech Indonesia",
        clientEmail: "purchasing@techindonesia.com",
        quantity: 1,
        type: "PURCHASE_ORDER",
        status: "PENDING",
        notes: "Mohon segera diproses",
      },
      {
        productId: products[1].id,
        clientName: "CV. Digital Solutions",
        clientEmail: "admin@digitalsolutions.com",
        quantity: 2,
        type: "PURCHASE_ORDER",
        status: "APPROVED",
        notes: "Approved by admin",
      },
      {
        productId: products[2].id,
        clientName: "PT. Innovation Labs",
        clientEmail: "contact@innovationlabs.com",
        quantity: 1,
        type: "INVESTMENT",
        status: "PENDING",
        notes: "Ingin melakukan investasi",
      },
    ],
  });

  console.log("Requests created");

  console.log("Seeding completed!");
  console.log("\n Login credentials:");
  console.log("Super Admin: superadmin@tefamart.com / password123");
  console.log("Admin PNJ: admin.pnj@tefamart.com / password123");
  console.log("Admin Polban: admin.polban@tefamart.com / password123");
  console.log("Client: client@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
