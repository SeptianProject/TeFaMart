import { PrismaClient } from "../../generated/prisma/client";
import { generateSlug } from "./utils/helpers";

export async function seedTefas(
  prisma: PrismaClient,
  campusIds: { campus1: string; campus2: string; campus3: string },
) {
  console.log("🏭 Seeding TEFA (Teaching Factory)...");

  // TEFA untuk Politeknik Negeri Banyuwangi
  const tefa1 = await prisma.tefa.upsert({
    where: { id: "tefa-ti-poliwangi" },
    update: {},
    create: {
      id: "tefa-ti-poliwangi",
      name: "TEFA Teknik Informatika",
      major: "Teknik Informatika",
      description:
        "Teaching Factory jurusan Teknik Informatika dengan fokus pada pengembangan aplikasi dan sistem informasi",
      campusId: campusIds.campus1,
      slug: generateSlug("TEFA Teknik Informatika Poliwangi"),
    },
  });

  const tefa2 = await prisma.tefa.upsert({
    where: { id: "tefa-te-poliwangi" },
    update: {},
    create: {
      id: "tefa-te-poliwangi",
      name: "TEFA Teknik Elektro",
      major: "Teknik Elektro",
      description:
        "Teaching Factory jurusan Teknik Elektro dengan fokus pada sistem kontrol dan otomasi",
      campusId: campusIds.campus1,
      slug: generateSlug("TEFA Teknik Elektro Poliwangi"),
    },
  });

  const tefa3 = await prisma.tefa.upsert({
    where: { id: "tefa-tm-poliwangi" },
    update: {},
    create: {
      id: "tefa-tm-poliwangi",
      name: "TEFA Teknik Mesin",
      major: "Teknik Mesin",
      description:
        "Teaching Factory jurusan Teknik Mesin dengan fokus pada manufaktur dan fabrikasi",
      campusId: campusIds.campus1,
      slug: generateSlug("TEFA Teknik Mesin Poliwangi"),
    },
  });

  const tefa4 = await prisma.tefa.upsert({
    where: { id: "tefa-dkv-poliwangi" },
    update: {},
    create: {
      id: "tefa-dkv-poliwangi",
      name: "TEFA Desain Komunikasi Visual",
      major: "Desain Komunikasi Visual",
      description:
        "Teaching Factory jurusan DKV dengan fokus pada desain grafis dan multimedia",
      campusId: campusIds.campus1,
      slug: generateSlug("TEFA DKV Poliwangi"),
    },
  });

  const tefa5 = await prisma.tefa.upsert({
    where: { id: "tefa-tataboga-poliwangi" },
    update: {},
    create: {
      id: "tefa-tataboga-poliwangi",
      name: "TEFA Tata Boga",
      major: "Tata Boga",
      description:
        "Teaching Factory jurusan Tata Boga dengan fokus pada pengolahan makanan dan kue",
      campusId: campusIds.campus1,
      slug: generateSlug("TEFA Tata Boga Poliwangi"),
    },
  });

  const tefa6 = await prisma.tefa.upsert({
    where: { id: "tefa-fashion-poliwangi" },
    update: {},
    create: {
      id: "tefa-fashion-poliwangi",
      name: "TEFA Fashion Design",
      major: "Fashion Design",
      description:
        "Teaching Factory jurusan Fashion Design dengan fokus pada produksi pakaian dan tekstil",
      campusId: campusIds.campus1,
      slug: generateSlug("TEFA Fashion Poliwangi"),
    },
  });

  // TEFA untuk Politeknik Negeri Jakarta
  const tefa7 = await prisma.tefa.upsert({
    where: { id: "tefa-ti-pnj" },
    update: {},
    create: {
      id: "tefa-ti-pnj",
      name: "TEFA Teknik Informatika PNJ",
      major: "Teknik Informatika",
      description: "Teaching Factory TI di Politeknik Negeri Jakarta",
      campusId: campusIds.campus2,
      slug: generateSlug("TEFA TI PNJ"),
    },
  });

  // TEFA untuk Politeknik Negeri Bandung
  const tefa8 = await prisma.tefa.upsert({
    where: { id: "tefa-tm-polban" },
    update: {},
    create: {
      id: "tefa-tm-polban",
      name: "TEFA Teknik Mesin Polban",
      major: "Teknik Mesin",
      description: "Teaching Factory Teknik Mesin di Politeknik Negeri Bandung",
      campusId: campusIds.campus3,
      slug: generateSlug("TEFA TM Polban"),
    },
  });

  console.log(`   ✅ ${tefa1.name}`);
  console.log(`   ✅ ${tefa2.name}`);
  console.log(`   ✅ ${tefa3.name}`);
  console.log(`   ✅ ${tefa4.name}`);
  console.log(`   ✅ ${tefa5.name}`);
  console.log(`   ✅ ${tefa6.name}`);
  console.log(`   ✅ ${tefa7.name}`);
  console.log(`   ✅ ${tefa8.name}`);

  return {
    tefa1,
    tefa2,
    tefa3,
    tefa4,
    tefa5,
    tefa6,
    tefa7,
    tefa8,
  };
}
