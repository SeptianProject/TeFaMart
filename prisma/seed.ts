/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Main Seeder File
 * This file orchestrates all seeding operations in a modular way
 */

import "dotenv/config";
import prisma from "@/lib/prisma";
import { seedCampus } from "./seeders/campus.seed";
import { seedUsers } from "./seeders/users.seed";
import { seedCategories } from "./seeders/category.seed";
import { seedTefas } from "./seeders/tefa.seed";
import { seedProducts } from "./seeders/product.seed";

async function main() {
  console.log("🌱 Starting seeding process...\n");
  console.log("=".repeat(60));

  try {
    // 1. Seed Campus
    console.log("\n[1/5] Campus Seeding");
    console.log("-".repeat(60));
    const { campus1, campus2, campus3 } = await seedCampus(prisma);

    // 2. Seed Users
    console.log("\n[2/5] Users Seeding");
    console.log("-".repeat(60));
    const users = await seedUsers(prisma, {
      campus1: campus1.id,
      campus2: campus2.id,
      campus3: campus3.id,
    });

    // 3. Seed Categories
    console.log("\n[3/5] Categories Seeding");
    console.log("-".repeat(60));
    const categories = await seedCategories(prisma);

    // 4. Seed TEFAs (Teaching Factory)
    console.log("\n[4/5] TEFA (Teaching Factory) Seeding");
    console.log("-".repeat(60));
    const tefas = await seedTefas(prisma, {
      campus1: campus1.id,
      campus2: campus2.id,
      campus3: campus3.id,
    });

    // 5. Seed Products with Images from Cloudinary
    console.log("\n[5/5] Products Seeding (with Cloudinary Upload)");
    console.log("-".repeat(60));
    await seedProducts(prisma, tefas, categories);

    // Success Summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 Seeding completed successfully!\n");

    console.log("📊 Summary:");
    console.log(`   - Campuses: 3`);
    console.log(`   - Users: 6`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - TEFAs: 8`);
    console.log(`   - Products: 16 (with Cloudinary images)`);

    console.log("\n📝 Login Credentials:");
    console.log(
      "┌────────────────────────────────────────────────────────────┐",
    );
    console.log(
      "│ Super Admin:    superadmin@tefamart.com / password123     │",
    );
    console.log(
      "│ Admin Poliwangi: admin@poliwangi.ac.id / password123      │",
    );
    console.log(
      "│ Admin PNJ:      admin@pnj.ac.id / password123             │",
    );
    console.log(
      "│ Admin Polban:   admin@polban.ac.id / password123          │",
    );
    console.log(
      "│ Client:         client@example.com / password123          │",
    );
    console.log(
      "│ Industri (Pending): industri@example.com / password123    │",
    );
    console.log(
      "└────────────────────────────────────────────────────────────┘",
    );

    console.log("\n💡 Tips:");
    console.log("   - Images are automatically uploaded to Cloudinary");
    console.log("   - Some products have auction enabled (Lelang)");
    console.log("   - Categories match with public/assets folder structure");
    console.log("   - All seeders are modular in prisma/seeders/ directory");
  } catch (error) {
    console.error("\n❌ Seeding failed:");
    console.error(error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
