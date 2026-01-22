import prisma from "../../src/lib/prisma";

/**
 * Update Category untuk menandai kategori populer dan menambahkan imageUrl
 * Sesuaikan dengan data kategori yang sudah ada di database
 */
async function updatePopularCategories() {
  console.log("🔄 Updating popular categories...\n");

  // Mapping kategori populer dengan imageUrl dari Cloudinary
  // Sesuaikan category name dengan yang ada di database Anda
  const popularCategoryUpdates = [
    {
      name: "Digital & Jasa IT",
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/digital1_bikbck.png",
      isPopular: true,
    },
    {
      name: "Elektronika & IOT",
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/iot1_bikbck.png",
      isPopular: true,
    },
    {
      name: "Fashion & Tekstil",
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/fashion1_bikbck.png",
      isPopular: true,
    },
    {
      name: "Kreatif & Media",
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/kreatif1_bikbck.png",
      isPopular: true,
    },
    {
      name: "Manufaktur",
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/manufaktur1_bikbck.png",
      isPopular: true,
    },
    {
      name: "Tataboga & Agribisnis",
      imageUrl:
        "https://res.cloudinary.com/djlqeh6as/image/upload/v1769073502/tefamart/products/tataboga1_bikbck.png",
      isPopular: true,
    },
  ];

  let successCount = 0;
  let notFoundCount = 0;

  for (const categoryData of popularCategoryUpdates) {
    try {
      const category = await prisma.category.findFirst({
        where: {
          name: {
            contains: categoryData.name,
            mode: "insensitive",
          },
        },
      });

      if (category) {
        await prisma.category.update({
          where: { id: category.id },
          data: {
            imageUrl: categoryData.imageUrl,
            isPopular: categoryData.isPopular,
          },
        });
        console.log(`   ✅ Updated: ${categoryData.name}`);
        successCount++;
      } else {
        console.log(`   ⚠️  Not found: ${categoryData.name}`);
        notFoundCount++;
      }
    } catch (error) {
      console.error(`   ❌ Error updating ${categoryData.name}:`, error);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully updated: ${successCount} categories`);
  console.log(`   ⚠️  Not found: ${notFoundCount} categories`);
}

async function main() {
  try {
    await updatePopularCategories();
    console.log("\n✨ Popular categories update completed!");
  } catch (error) {
    console.error("❌ Error in main:", error);
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
