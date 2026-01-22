/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "../../generated/prisma/client";
import { generateSlug, randomPrice } from "./utils/helpers";
import { uploadImageToCloudinary } from "./utils/cloudinary-upload";

interface ProductData {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  tefaId: string;
  saleType: "Pre Order" | "Lelang";
  imagePath: string;
}

export async function seedProducts(
  prisma: PrismaClient,
  tefaIds: any,
  categories: any[],
) {
  console.log("🛍️  Seeding Products...");

  // Create category mapping by slug for easier reference
  const categoryMap: Record<string, string> = {};
  categories.forEach((cat) => {
    categoryMap[cat.slug] = cat.id;
  });

  // Define products for each category
  const productsData: ProductData[] = [
    // === ELEKTRONIK & IOT ===
    {
      name: "Smart Home Controller IOT",
      description:
        "Sistem kontrol rumah pintar berbasis IoT dengan sensor suhu, kelembaban, dan kontrol lampu otomatis. Dapat dikendalikan melalui aplikasi mobile.",
      price: 2500000,
      categoryId: categoryMap["elektronik-iot"],
      tefaId: tefaIds.tefa2.id, // TEFA Teknik Elektro
      saleType: "Pre Order",
      imagePath: "public/assets/elektronik-dan-iot/iot1.png",
    },
    {
      name: "Sistem Monitoring Energi IoT",
      description:
        "Perangkat monitoring konsumsi energi listrik real-time dengan notifikasi dan laporan penggunaan. Cocok untuk rumah dan gedung.",
      price: 3200000,
      categoryId: categoryMap["elektronik-iot"],
      tefaId: tefaIds.tefa2.id,
      saleType: "Lelang",
      imagePath: "public/assets/elektronik-dan-iot/iot2.png",
    },

    // === DIGITAL & JASA IT ===
    {
      name: "Website Company Profile Premium",
      description:
        "Pembuatan website company profile profesional dengan desain modern, responsive, SEO optimized, dan dilengkapi CMS untuk update konten.",
      price: 5000000,
      categoryId: categoryMap["digital-jasa-it"],
      tefaId: tefaIds.tefa1.id, // TEFA TI Poliwangi
      saleType: "Pre Order",
      imagePath: "public/assets/digital-dan-jasa-it/digital1.png",
    },
    {
      name: "Aplikasi Mobile E-Commerce",
      description:
        "Pengembangan aplikasi mobile e-commerce untuk Android dan iOS dengan fitur lengkap: katalog produk, keranjang belanja, payment gateway, dan tracking order.",
      price: 18000000,
      categoryId: categoryMap["digital-jasa-it"],
      tefaId: tefaIds.tefa1.id,
      saleType: "Pre Order",
      imagePath: "public/assets/digital-dan-jasa-it/digital2.png",
    },
    {
      name: "Sistem Informasi Manajemen Sekolah",
      description:
        "Sistem informasi manajemen sekolah terintegrasi dengan fitur akademik, keuangan, kepegawaian, dan perpustakaan. Multi-user dengan role based access.",
      price: 25000000,
      categoryId: categoryMap["digital-jasa-it"],
      tefaId: tefaIds.tefa1.id,
      saleType: "Lelang",
      imagePath: "public/assets/digital-dan-jasa-it/digital3.png",
    },

    // === MANUFAKTUR ===
    {
      name: "Mesin CNC Router 3 Axis",
      description:
        "Mesin CNC Router 3 axis untuk cutting dan engraving material kayu, akrilik, dan aluminium. Area kerja 1200x800mm dengan presisi tinggi.",
      price: 45000000,
      categoryId: categoryMap["manufaktur"],
      tefaId: tefaIds.tefa3.id, // TEFA Teknik Mesin
      saleType: "Pre Order",
      imagePath: "public/assets/manufaktur/manufaktur1.png",
    },
    {
      name: "Komponen Mesin Presisi Custom",
      description:
        "Pembuatan komponen mesin dengan presisi tinggi menggunakan mesin CNC dan lathe. Material stainless steel, aluminium, dan brass. Sesuai gambar kerja.",
      price: 2500000,
      categoryId: categoryMap["manufaktur"],
      tefaId: tefaIds.tefa3.id,
      saleType: "Pre Order",
      imagePath: "public/assets/manufaktur/manufaktur2.png",
    },
    {
      name: "Panel Listrik Industri 3 Phase",
      description:
        "Pembuatan panel listrik industri 3 phase dengan kapasitas hingga 100A. Dilengkapi dengan MCB, kontaktor, timer, dan safety features.",
      price: 8500000,
      categoryId: categoryMap["manufaktur"],
      tefaId: tefaIds.tefa3.id,
      saleType: "Lelang",
      imagePath: "public/assets/manufaktur/manufaktur3.png",
    },
    {
      name: "Mesin Laser Cutting Custom",
      description:
        "Mesin laser cutting untuk material akrilik, kayu, dan kain. Power laser 60W dengan area kerja 600x400mm. Cocok untuk industri kreatif dan UMKM.",
      price: 35000000,
      categoryId: categoryMap["manufaktur"],
      tefaId: tefaIds.tefa3.id,
      saleType: "Pre Order",
      imagePath: "public/assets/manufaktur/manufaktur4.png",
    },

    // === FASHION & TEKSTIL ===
    {
      name: "Seragam Kerja Custom Perusahaan",
      description:
        "Produksi seragam kerja custom untuk perusahaan dengan berbagai pilihan model dan material. Minimal order 50 pcs. Termasuk sablon logo perusahaan.",
      price: 250000,
      categoryId: categoryMap["fashion-tekstil"],
      tefaId: tefaIds.tefa6.id, // TEFA Fashion
      saleType: "Pre Order",
      imagePath: "public/assets/fashion-dan-tekstil/tekstil1.png",
    },
    {
      name: "Tas Kanvas Premium Handmade",
      description:
        "Tas kanvas premium buatan tangan dengan desain custom. Material kanvas grade A dengan jahitan kuat. Tersedia berbagai ukuran dan warna.",
      price: 180000,
      categoryId: categoryMap["fashion-tekstil"],
      tefaId: tefaIds.tefa6.id,
      saleType: "Lelang",
      imagePath: "public/assets/fashion-dan-tekstil/tekstil2.png",
    },

    // === KREATIF & MEDIA ===
    {
      name: "Jasa Desain Logo & Brand Identity",
      description:
        "Pembuatan logo profesional dan brand identity lengkap termasuk color palette, typography, dan brand guidelines. Revisi unlimited hingga approved.",
      price: 3500000,
      categoryId: categoryMap["kreatif-media"],
      tefaId: tefaIds.tefa4.id, // TEFA DKV
      saleType: "Pre Order",
      imagePath: "public/assets/kreatif-dan-media/kreatif1.png",
    },
    {
      name: "Video Company Profile Profesional",
      description:
        "Produksi video company profile profesional durasi 3-5 menit. Termasuk konsep, shooting, editing, music scoring, dan color grading.",
      price: 8000000,
      categoryId: categoryMap["kreatif-media"],
      tefaId: tefaIds.tefa4.id,
      saleType: "Pre Order",
      imagePath: "public/assets/kreatif-dan-media/kreatif2.png",
    },

    // === TATA BOGA & AGRIBISNIS ===
    {
      name: "Paket Catering Nasi Box 100 Porsi",
      description:
        "Paket catering nasi box untuk acara dengan menu pilihan: ayam goreng/bakar, sayur, sambal, kerupuk, dan buah. Fresh dan higienis. Minimal order 100 porsi.",
      price: 2500000,
      categoryId: categoryMap["tata-boga-agribisnis"],
      tefaId: tefaIds.tefa5.id, // TEFA Tata Boga
      saleType: "Pre Order",
      imagePath: "public/assets/tataboga-dan-agribisnis/agb1.png",
    },
    {
      name: "Kue Kering Premium Lebaran (5 Toples)",
      description:
        "Paket kue kering premium untuk lebaran berisi 5 toples dengan berbagai varian: nastar, kastengel, putri salju, chocolate chips, dan kacang mede.",
      price: 450000,
      categoryId: categoryMap["tata-boga-agribisnis"],
      tefaId: tefaIds.tefa5.id,
      saleType: "Lelang",
      imagePath: "public/assets/tataboga-dan-agribisnis/agb2.png",
    },
  ];

  const createdProducts = [];

  for (const productData of productsData) {
    console.log(`\n   📦 Creating: ${productData.name}`);

    // Upload image to Cloudinary
    let imageUrl: string;
    try {
      const uploadResult = await uploadImageToCloudinary(
        productData.imagePath,
        "tefamart/products",
      );
      imageUrl = uploadResult.secure_url;
    } catch (error) {
      console.warn(
        `   ⚠️  Image upload failed for ${productData.name}, using placeholder`,
      );
      imageUrl = "/assets/placeholder-product.png";
    }

    // Create product
    const slug = generateSlug(productData.name);
    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        imageUrl: imageUrl,
        categoryId: productData.categoryId,
        tefaId: productData.tefaId,
        saleType: productData.saleType,
        isAvailable: "Tersedia",
      },
      create: {
        name: productData.name,
        slug: slug,
        description: productData.description,
        price: productData.price,
        imageUrl: imageUrl,
        categoryId: productData.categoryId,
        tefaId: productData.tefaId,
        saleType: productData.saleType,
        isAvailable: "Tersedia",
      },
    });

    createdProducts.push(product);
    console.log(`   ✅ Created: ${product.name} - Rp ${product.price}`);

    // If saleType is "Lelang", create auction
    if (productData.saleType === "Lelang") {
      const startTime = new Date();
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + 7); // 7 days from now

      await prisma.auction.upsert({
        where: { id: `auction-${product.id}` },
        update: {
          startPrice: product.price * 0.7, // Start at 70% of price
          currentBid: product.price * 0.7,
          startTime: startTime,
          endTime: endTime,
          status: "active",
        },
        create: {
          id: `auction-${product.id}`,
          productId: product.id,
          startPrice: product.price * 0.7,
          currentBid: product.price * 0.7,
          startTime: startTime,
          endTime: endTime,
          status: "active",
        },
      });
      console.log(`   🔨 Auction created for ${product.name}`);
    }
  }

  console.log(`\n   ✅ Total products created: ${createdProducts.length}`);

  return createdProducts;
}
