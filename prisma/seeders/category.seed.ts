import { PrismaClient } from "../../generated/prisma/client";
import { generateSlug } from "./utils/helpers";

export async function seedCategories(prisma: PrismaClient) {
  console.log("📂 Seeding Categories...");

  const categories = [
    {
      id: "cat-elektronik-iot",
      name: "Elektronik & IOT",
      slug: generateSlug("Elektronik & IOT"),
    },
    {
      id: "cat-digital-jasa-it",
      name: "Digital & Jasa IT",
      slug: generateSlug("Digital & Jasa IT"),
    },
    {
      id: "cat-manufaktur",
      name: "Manufaktur",
      slug: generateSlug("Manufaktur"),
    },
    {
      id: "cat-fashion-tekstil",
      name: "Fashion & Tekstil",
      slug: generateSlug("Fashion & Tekstil"),
    },
    {
      id: "cat-kreatif-media",
      name: "Kreatif & Media",
      slug: generateSlug("Kreatif & Media"),
    },
    {
      id: "cat-tataboga-agribisnis",
      name: "Tata Boga & Agribisnis",
      slug: generateSlug("Tata Boga & Agribisnis"),
    },
  ];

  const createdCategories = [];

  for (const categoryData of categories) {
    // Check if category exists by name first
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ id: categoryData.id }, { name: categoryData.name }],
      },
    });

    let category;
    if (existingCategory) {
      // Update existing category
      category = await prisma.category.update({
        where: { id: existingCategory.id },
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
        },
      });
    } else {
      // Create new category
      category = await prisma.category.create({
        data: categoryData,
      });
    }

    createdCategories.push(category);
    console.log(`   ✅ ${category.name} - ${category.slug}`);
  }

  return createdCategories;
}
