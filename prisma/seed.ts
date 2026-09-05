import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories...");
  const categories = await Promise.all(
    [
      { name: "Premium Attars", description: "Premium attars and curated fragrance collections for special occasions." },
      { name: "Gift Sets", description: "Curated attar and perfume sets for gifting." },
      { name: "Car Diffusers", description: "Natural car diffusers with long-lasting botanical fragrances." },
    ].map((c) =>
      prisma.category.upsert({
        where: { slug: slugify(c.name) },
        update: {},
        create: { name: c.name, slug: slugify(c.name), description: c.description },
      })
    )
  );

  const byName = (n: string) => categories.find((c) => c.name === n)!.id;

  console.log("Seeding products...");
  const products = [
    {
      name: "5-Piece Gift Box - 12ml Bottles",
      shortSummary: "A five-piece fragrance gift box with 12ml bottles.",
      description:
        "A beautifully curated five-piece gift box with 12ml fragrance bottles. All India shipping is free. Jay Shree Shyam.",
      price: 550,
      stock: 30,
      volumeMl: 12,
      isFeatured: true,
      images: ["/images/5-piece-gift-box-12ml.jpg"],
      scentNotes: ["Floral", "Woody", "Musk"],
      category: "Gift Sets",
    },
    {
      name: "Natural Car Air Diffuser - 3ml Fragrance",
      shortSummary: "A natural car diffuser with a 3ml fragrance bottle.",
      description:
        "Natural car air diffuser with a 3ml natural fragrance bottle for a fresh, long-lasting fragrance on every drive.",
      price: 350,
      stock: 40,
      volumeMl: 3,
      images: ["/images/natural-car-air-diffuser-3ml.jpg"],
      scentNotes: ["Natural Fragrance", "Fresh"],
      category: "Car Diffusers",
    },
    {
      name: "Natural Car Air Diffuser - 20ml Dropper Bottle",
      shortSummary: "A natural car diffuser with a 20ml fragrance bottle and dropper.",
      description:
        "Natural car air diffuser with a 20ml natural fragrance bottle and dropper. Long-lasting fragrance, filled with the scent of nature.",
      price: 450,
      stock: 40,
      volumeMl: 20,
      images: ["/images/natural-car-air-diffuser-20ml.jpg"],
      scentNotes: ["Natural Fragrance", "Fresh"],
      category: "Car Diffusers",
    },
    {
      name: "Premium Ittar",
      shortSummary: "A premium traditional ittar with a rich, long-lasting fragrance.",
      description:
        "Premium traditional ittar made for a rich and memorable fragrance experience. A refined choice for everyday wear and special occasions.",
      price: 1700,
      stock: 25,
      volumeMl: 12,
      isFeatured: true,
      images: ["/images/premium-ittar.jpg"],
      scentNotes: ["Oudh", "Amber", "Musk"],
      category: "Premium Attars",
    },
    {
      name: "30-Piece Gift Box - 6ml Bottles",
      shortSummary: "A 30-piece fragrance gift box with 6ml bottles.",
      description:
        "A 30-piece gift box with 6ml fragrance bottles, ideal for gifting and festive occasions. All India shipping is free. Jay Shree Shyam.",
      price: 1500,
      stock: 20,
      volumeMl: 6,
      isFeatured: true,
      images: ["/images/30-piece-gift-box-6ml.jpg"],
      scentNotes: ["Floral", "Woody", "Musk"],
      category: "Gift Sets",
    },
    {
      name: "25-Piece Gift Box - 12ml Bottles",
      shortSummary: "A 25-piece fragrance gift box with 12ml bottles.",
      description:
        "A 25-piece gift box with 12ml fragrance bottles, made for generous gifting and celebrations. All India shipping is free. Jay Shree Shyam.",
      price: 2500,
      stock: 15,
      volumeMl: 12,
      isFeatured: true,
      images: ["/images/25-piece-gift-box-12ml.jpg"],
      scentNotes: ["Floral", "Woody", "Musk"],
      category: "Gift Sets",
    },
    {
      name: "5-Piece Gift Box - 6ml Bottles",
      shortSummary: "A five-piece fragrance gift box with 6ml bottles.",
      description:
        "A five-piece gift box with 6ml fragrance bottles, perfect for thoughtful gifting. All India shipping is free. Jay Shree Shyam.",
      price: 600,
      stock: 30,
      volumeMl: 6,
      images: ["/images/5-piece-gift-box-6ml.jpg"],
      scentNotes: ["Floral", "Woody", "Musk"],
      category: "Gift Sets",
    },
    {
      name: "10-Piece Gift Box - 12ml Bottles",
      shortSummary: "A 10-piece fragrance gift box with 12ml bottles.",
      description:
        "A 10-piece gift box with 12ml fragrance bottles, perfect for festive gifting. All India shipping is free. Jay Shree Shyam.",
      price: 1000,
      stock: 25,
      volumeMl: 12,
      images: ["/images/10-piece-gift-box-12ml.jpg"],
      scentNotes: ["Floral", "Woody", "Musk"],
      category: "Gift Sets",
    },
  ];

  const requestedProductSlugs = products.map((p) => slugify(p.name));
  await prisma.product.updateMany({
    where: {
      slug: { notIn: requestedProductSlugs },
      orderItems: { some: {} },
    },
    data: { isVisible: false, categoryId: null },
  });
  await prisma.product.deleteMany({
    where: {
      slug: { notIn: requestedProductSlugs },
      orderItems: { none: {} },
    },
  });

  for (const p of products) {
    const { category, ...rest } = p;
    await prisma.product.upsert({
      where: { slug: slugify(p.name) },
      update: {},
      create: {
        ...rest,
        slug: slugify(p.name),
        categoryId: byName(category),
      },
    });
  }

  await prisma.category.deleteMany({
    where: {
      slug: { notIn: categories.map((category) => category.slug) },
      products: { none: {} },
    },
  });

  console.log("Seeding customer reviews...");
  const reviews = [
    { name: "Amit Sharma", rating: 5, comment: "Mysore Chandan Attar ki khushboo bahut shaant aur long-lasting hai. Packaging bhi bahut achhi thi." },
    { name: "Neha Verma", rating: 5, comment: "Gulab-e-Kannauj ki natural fragrance dil jeet leti hai. ItraWala se dobara zaroor order karungi." },
    { name: "Rohit Yadav", rating: 4, comment: "Oudh Al Sharq ki khushboo rich aur premium hai. Delivery bhi time par mil gayi." },
    { name: "Pooja Saini", rating: 5, comment: "Gift set sundar tha aur fragrances ka selection bahut accha laga. Family ko bhi pasand aaya." },
    { name: "Vikas Gupta", rating: 5, comment: "Mitti Attar mein pehli baarish wali asli khushboo milti hai. Quality ke liye shukriya." },
    { name: "Kavita Rao", rating: 4, comment: "Bakhoor ki fragrance ghar mein bahut der tak rahi. Product bilkul description jaisa mila." },
  ];

  for (const review of reviews) {
    const existing = await prisma.review.findFirst({ where: { name: review.name } });
    if (!existing) await prisma.review.create({ data: { ...review, isApproved: true } });
  }

  console.log(`Seeded ${categories.length} categories, ${products.length} products and ${reviews.length} reviews.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
