import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/utils";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding categories...");
  const categories = await Promise.all(
    [
      { name: "Pure Attars", description: "Alcohol-free, concentrated perfume oils rolled the traditional way." },
      { name: "Eau De Parfum", description: "Long-lasting alcohol-based sprays for everyday wear." },
      { name: "Bakhoor & Incense", description: "Bakhoor chips, dhoop and incense for the home." },
      { name: "Gift Sets", description: "Curated attar and perfume sets for gifting." },
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
      name: "Mysore Chandan Attar",
      shortSummary: "Sandalwood-rich attar with a smooth, woody warmth.",
      description:
        "Crafted from aged Mysore sandalwood oil, this attar carries a creamy, woody warmth that deepens beautifully on skin. A timeless classic, worn for centuries across India for its calm, grounding character.",
      price: 899,
      compareAtPrice: 1099,
      stock: 42,
      volumeMl: 12,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1615368144592-05b3d6d4d5c3?w=800"],
      scentNotes: ["Sandalwood", "Amber", "Musk"],
      category: "Pure Attars",
    },
    {
      name: "Gulab-e-Kannauj Attar",
      shortSummary: "Steam-distilled rose attar from the perfume city of Kannauj.",
      description:
        "Distilled the old way over sandalwood oil in copper deghs, this rose attar is soft, floral and slightly sweet — a fragrance that has perfumed royal courts for generations.",
      price: 749,
      stock: 58,
      volumeMl: 12,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=800"],
      scentNotes: ["Rose", "Green Leaves", "Honey"],
      category: "Pure Attars",
    },
    {
      name: "Oudh Al Sharq",
      shortSummary: "Deep, resinous oudh with smoky depth.",
      description:
        "A bold, resinous oudh attar with a smoky, almost leathery depth. Long-lasting and intense — a favourite for evening wear and special occasions.",
      price: 1499,
      compareAtPrice: 1799,
      stock: 20,
      volumeMl: 6,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800"],
      scentNotes: ["Oudh", "Saffron", "Amber"],
      category: "Pure Attars",
    },
    {
      name: "Kesar Kasturi Attar",
      shortSummary: "Saffron and musk blend with a warm, spiced finish.",
      description:
        "A rich blend of saffron and kasturi (musk), warm and slightly spiced. Popular as a festive fragrance and a traditional gifting favourite.",
      price: 649,
      stock: 35,
      volumeMl: 12,
      images: ["https://images.unsplash.com/photo-1616949755610-fbfd6d235f0f?w=800"],
      scentNotes: ["Saffron", "Musk", "Vanilla"],
      category: "Pure Attars",
    },
    {
      name: "Shamama Attar",
      shortSummary: "A traditional multi-herb attar, earthy and complex.",
      description:
        "An age-old Ayurvedic blend of over a dozen herbs and spices, distilled together for a complex, earthy fragrance unlike anything else. An heirloom scent.",
      price: 999,
      stock: 18,
      volumeMl: 12,
      images: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800"],
      scentNotes: ["Herbs", "Spice", "Earth"],
      category: "Pure Attars",
    },
    {
      name: "Amber Musk EDP",
      shortSummary: "Warm amber and musk in a modern spray format.",
      description:
        "A contemporary eau de parfum built around warm amber and clean musk, with a soft powdery drydown. Easy to wear, all day long.",
      price: 1299,
      stock: 40,
      volumeMl: 50,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800"],
      scentNotes: ["Amber", "White Musk", "Vanilla"],
      category: "Eau De Parfum",
    },
    {
      name: "Oudh Noir EDP",
      shortSummary: "Dark, smoky oudh for confident evenings.",
      description:
        "Bold and smoky, Oudh Noir pairs dark oudh with a touch of spice for a modern, confident evening fragrance in an easy spray format.",
      price: 1599,
      stock: 25,
      volumeMl: 50,
      images: ["https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800"],
      scentNotes: ["Oudh", "Black Pepper", "Leather"],
      category: "Eau De Parfum",
    },
    {
      name: "Bakhoor Al Waha",
      shortSummary: "Fragrant bakhoor chips for bukhoor burners.",
      description:
        "Hand-blended bakhoor chips made from soaked wood infused with oudh oil and spices. Burn a few chips on charcoal to fill your home with warm, smoky fragrance.",
      price: 549,
      stock: 60,
      volumeMl: null,
      images: ["https://images.unsplash.com/photo-1604335398980-ef1a17c1a6c4?w=800"],
      scentNotes: ["Oudh", "Rose", "Spice"],
      category: "Bakhoor & Incense",
    },
    {
      name: "Chandan Dhoop Sticks",
      shortSummary: "Hand-rolled sandalwood dhoop sticks, box of 20.",
      description:
        "Traditional hand-rolled dhoop sticks made from pure sandalwood powder — no charcoal core, no synthetic fragrance. Ideal for daily puja and quiet evenings.",
      price: 299,
      stock: 80,
      volumeMl: null,
      images: ["https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800"],
      scentNotes: ["Sandalwood"],
      category: "Bakhoor & Incense",
    },
    {
      name: "Royal Attar Gift Trio",
      shortSummary: "Chandan, Gulab and Oudh attars in a keepsake box.",
      description:
        "Our three most-loved attars — Mysore Chandan, Gulab-e-Kannauj and Oudh Al Sharq — presented in a keepsake wooden box. A gift that lasts long after the occasion.",
      price: 2499,
      compareAtPrice: 2999,
      stock: 15,
      volumeMl: null,
      isFeatured: true,
      images: ["https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800"],
      scentNotes: ["Sandalwood", "Rose", "Oudh"],
      category: "Gift Sets",
    },
    {
      name: "Bridal Fragrance Set",
      shortSummary: "A curated set for the wedding season.",
      description:
        "Four festive attars chosen for wedding season wear — Kesar Kasturi, Gulab, Shamama and Amber Musk — packaged in a decorative box, ready to gift.",
      price: 2199,
      stock: 12,
      volumeMl: null,
      images: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800"],
      scentNotes: ["Saffron", "Rose", "Amber"],
      category: "Gift Sets",
    },
    {
      name: "Mitti Attar (Petrichor)",
      shortSummary: "The scent of the first rain, captured in a bottle.",
      description:
        "India's famous 'earthy rain' attar, distilled from baked clay. Nostalgic, unusual and deeply loved — the smell of the first monsoon rain on dry earth.",
      price: 799,
      stock: 30,
      volumeMl: 12,
      images: ["https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800"],
      scentNotes: ["Petrichor", "Clay", "Vetiver"],
      category: "Pure Attars",
    },
  ];

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

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
