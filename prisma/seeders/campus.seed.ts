/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "../../generated/prisma/client";
import { uploadImageToCloudinary } from "./utils/cloudinary-upload";

export async function seedCampus(prisma: PrismaClient) {
  console.log("🏫 Seeding Campus...");

  // Campus 1: Politeknik Negeri Banyuwangi
  let campusImage1: string | undefined;
  let campusLogo1: string | undefined;

  try {
    // Upload logo untuk Politeknik Negeri Banyuwangi
    const logoResult = await uploadImageToCloudinary(
      "public/assets/logo/logo-poliwangi.png",
      "tefamart/campus/logo",
    );
    campusLogo1 = logoResult.secure_url;
  } catch (error) {
    console.warn("   ⚠️  Logo upload failed, using placeholder");
    campusLogo1 = "/assets/logo/logo-poliwangi.png";
  }

  const campus1 = await prisma.campus.upsert({
    where: { id: "campus-poliwangi" },
    update: {
      logo: campusLogo1,
      image: campusImage1,
    },
    create: {
      id: "campus-poliwangi",
      name: "Politeknik Negeri Banyuwangi",
      logo: campusLogo1,
      image: campusImage1,
      description:
        "Politeknik Negeri Banyuwangi adalah perguruan tinggi vokasi negeri yang berlokasi di Kabupaten Banyuwangi, Jawa Timur. Fokus pada pendidikan vokasi berbasis industri.",
      address: "Jl. Raya Jember KM 13, Labanasem",
      city: "Banyuwangi",
      province: "Jawa Timur",
      phoneNumber: "0333-636780",
      website: "https://poliwangi.ac.id",
    },
  });

  // Campus 2: Politeknik Negeri Jakarta
  const campus2 = await prisma.campus.upsert({
    where: { id: "campus-pnj" },
    update: {},
    create: {
      id: "campus-pnj",
      name: "Politeknik Negeri Jakarta",
      description:
        "Politeknik Negeri Jakarta adalah perguruan tinggi vokasi negeri di Jakarta yang unggul dalam bidang teknologi dan bisnis.",
      address: "Jl. Prof. DR. G.A. Siwabessy, Kampus Baru UI Depok",
      city: "Depok",
      province: "Jawa Barat",
      phoneNumber: "021-7270036",
      website: "https://pnj.ac.id",
    },
  });

  // Campus 3: Politeknik Negeri Bandung
  const campus3 = await prisma.campus.upsert({
    where: { id: "campus-polban" },
    update: {},
    create: {
      id: "campus-polban",
      name: "Politeknik Negeri Bandung",
      description:
        "Politeknik Negeri Bandung adalah perguruan tinggi vokasi negeri di Bandung dengan fokus pada teknologi manufaktur dan rekayasa.",
      address: "Jl. Gegerkalong Hilir, Ds. Ciwaruga",
      city: "Bandung",
      province: "Jawa Barat",
      phoneNumber: "022-2013789",
      website: "https://polban.ac.id",
    },
  });

  console.log(`   ✅ ${campus1.name} - ${campus1.id}`);
  console.log(`   ✅ ${campus2.name} - ${campus2.id}`);
  console.log(`   ✅ ${campus3.name} - ${campus3.id}`);

  return {
    campus1,
    campus2,
    campus3,
  };
}
