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
    },
  });

  const campus2 = await prisma.campus.upsert({
    where: { id: "campus-2" },
    update: {},
    create: {
      id: "campus-2",
      name: "Politeknik Negeri Bandung",
    },
  });

  console.log("✅ Kampus created");

  // Create Users
  const hashedPassword = await bcrypt.hash("password123", 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@tefamart.com" },
    update: {
      role: "SUPER_ADMIN",
      password: hashedPassword,
    },
    create: {
      email: "superadmin@tefamart.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  const admin1 = await prisma.user.upsert({
    where: { email: "admin.pnj@tefamart.com" },
    update: {
      role: "ADMIN",
      password: hashedPassword,
      campusId: campus1.id,
    },
    create: {
      email: "admin.pnj@tefamart.com",
      name: "Admin PNJ",
      password: hashedPassword,
      role: "ADMIN",
      campusId: campus1.id,
      address: "Jl. Prof. DR. G.A. Siwabessy, Kampus Baru UI Depok",
      city: "Depok",
      province: "Jawa Barat",
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: "admin.polban@tefamart.com" },
    update: {
      role: "ADMIN",
      password: hashedPassword,
      campusId: campus2.id,
    },
    create: {
      email: "admin.polban@tefamart.com",
      name: "Admin Polban",
      password: hashedPassword,
      role: "ADMIN",
      campusId: campus2.id,
      address: "Jl. Gegerkalong Hilir, Ds. Ciwaruga",
      city: "Bandung",
      province: "Jawa Barat",
    },
  });

  const client = await prisma.user.upsert({
    where: { email: "client@example.com" },
    update: {
      role: "CLIENT",
      password: hashedPassword,
    },
    create: {
      email: "client@example.com",
      name: "Client Test",
      password: hashedPassword,
      role: "CLIENT",
    },
  });

  console.log("✅ Users created/updated");
  console.log(`   - Super Admin: ${superAdmin.email} (${superAdmin.role})`);
  console.log(`   - Admin PNJ: ${admin1.email} (${admin1.role})`);
  console.log(`   - Admin Polban: ${admin2.email} (${admin2.role})`);
  console.log(`   - Client: ${client.email} (${client.role})`);

  // Create TEFA for Campus 1
  const tefa1 = await prisma.tefa.upsert({
    where: { id: "tefa-1" },
    update: {},
    create: {
      id: "tefa-1",
      name: "TEFA Teknik Informatika",
      major: "Teknik Informatika",
      description: "Teaching Factory untuk jurusan Teknik Informatika",
      campusId: campus1.id,
    },
  });

  const tefa2 = await prisma.tefa.upsert({
    where: { id: "tefa-2" },
    update: {},
    create: {
      id: "tefa-2",
      name: "TEFA Teknik Mesin",
      major: "Teknik Mesin",
      description: "Teaching Factory untuk jurusan Teknik Mesin",
      campusId: campus1.id,
    },
  });

  // Create TEFA for Campus 2
  const tefa3 = await prisma.tefa.upsert({
    where: { id: "tefa-3" },
    update: {},
    create: {
      id: "tefa-3",
      name: "TEFA Teknik Elektro",
      major: "Teknik Elektro",
      description: "Teaching Factory untuk jurusan Teknik Elektro",
      campusId: campus2.id,
    },
  });

  console.log("✅ TEFA created");

  // Create Categories
  const categories = [
    {
      id: "cat-1",
      name: "Digital",
      slug: "digital",
    },
    {
      id: "cat-2",
      name: "Manufaktur",
      slug: "manufaktur",
    },
    {
      id: "cat-3",
      name: "Elektronik",
      slug: "elektronik",
    },
    {
      id: "cat-4",
      name: "Fashion",
      slug: "fashion",
    },
    {
      id: "cat-5",
      name: "Kuliner",
      slug: "kuliner",
    },
    {
      id: "cat-6",
      name: "Kerajinan",
      slug: "kerajinan",
    },
  ];

  for (const categoryData of categories) {
    await prisma.category.upsert({
      where: { id: categoryData.id },
      update: {},
      create: categoryData,
    });
  }

  console.log("✅ Categories created");

  // Create Products
  const productData = [
    {
      name: "Website Company Profile",
      description: "Pembuatan website company profile profesional",
      price: 5000000,
      isAvailable: "Tersedia",
      tefaId: tefa1.id,
      categoryId: "cat-1",
    },
    {
      name: "Aplikasi Mobile Android",
      description: "Pengembangan aplikasi mobile berbasis Android",
      price: 15000000,
      isAvailable: "Tersedia",
      tefaId: tefa1.id,
      categoryId: "cat-1",
    },
    {
      name: "Sistem Informasi Manajemen",
      description: "Pembuatan sistem informasi manajemen terintegrasi",
      price: 25000000,
      isAvailable: "Tersedia",
      tefaId: tefa1.id,
      categoryId: "cat-1",
    },
    {
      name: "Mesin CNC Custom",
      description: "Pembuatan mesin CNC sesuai kebutuhan",
      price: 50000000,
      isAvailable: "Tersedia",
      tefaId: tefa2.id,
      categoryId: "cat-2",
    },
    {
      name: "Komponen Mesin Presisi",
      description: "Produksi komponen mesin dengan presisi tinggi",
      price: 2000000,
      isAvailable: "Tersedia",
      tefaId: tefa2.id,
      categoryId: "cat-2",
    },
    {
      name: "Panel Listrik Industri",
      description: "Pembuatan panel listrik untuk industri",
      price: 8000000,
      isAvailable: "Tersedia",
      tefaId: tefa3.id,
      categoryId: "cat-3",
    },
    {
      name: "Sistem Kontrol Otomatis",
      description: "Instalasi sistem kontrol otomatis berbasis PLC",
      price: 12000000,
      isAvailable: "Tersedia",
      tefaId: tefa3.id,
      categoryId: "cat-3",
    },
  ];

  // Check if products already exist
  const existingProducts = await prisma.product.count();

  if (existingProducts === 0) {
    await prisma.product.createMany({
      data: productData,
    });
    console.log("✅ Products created");
  } else {
    console.log("✅ Products already exist, skipping...");
  }

  console.log("\n🎉 Seeding completed!");
  console.log("\n📝 Login credentials:");
  console.log("┌─────────────────────────────────────────────────────┐");
  console.log("│ Super Admin: superadmin@tefamart.com / password123  │");
  console.log("│ Admin PNJ:   admin.pnj@tefamart.com / password123   │");
  console.log("│ Admin Polban: admin.polban@tefamart.com / password123│");
  console.log("│ Client:      client@example.com / password123       │");
  console.log("└─────────────────────────────────────────────────────┘");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
