import * as dotenv from "dotenv";
import { db, products } from "../src/lib/db";
import { generateId } from "../src/lib/db/utils";

dotenv.config({ path: ".env.local" });

const productData = [
  // Men's Collection
  {
    name: "Classic Oxford Shirt",
    slug: "classic-oxford-shirt",
    description:
      "A timeless oxford shirt crafted from premium cotton. Perfect for both casual and formal occasions. Features a button-down collar and a comfortable regular fit.",
    price: 79.00,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
      "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80",
    ],
    category: "Men",
    stock: 25,
  },
  {
    name: "Slim Fit Chino Pants",
    slug: "slim-fit-chino-pants",
    description:
      "Modern slim-fit chinos made from stretch cotton twill. Features a comfortable waistband and a clean, tailored silhouette. Perfect for everyday wear.",
    price: 89.00,
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80",
    ],
    category: "Men",
    stock: 30,
  },
  {
    name: "Premium Leather Jacket",
    slug: "premium-leather-jacket",
    description:
      "Handcrafted genuine leather jacket with a classic biker design. Features premium YKK zippers and quilted lining for extra warmth.",
    price: 299.00,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
      "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80",
    ],
    category: "Men",
    stock: 10,
  },
  {
    name: "Casual Denim Jacket",
    slug: "casual-denim-jacket",
    description:
      "Classic denim jacket with a modern twist. Made from premium selvedge denim that ages beautifully over time. Features copper button details.",
    price: 129.00,
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800&q=80",
    ],
    category: "Men",
    stock: 20,
  },
  {
    name: "Wool Blend Overcoat",
    slug: "wool-blend-overcoat",
    description:
      "Elegant overcoat crafted from a luxurious wool blend. Features a notched lapel, single-breasted closure, and a tailored fit perfect for formal occasions.",
    price: 349.00,
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80",
    ],
    category: "Men",
    stock: 8,
  },

  // Women's Collection
  {
    name: "Floral Summer Dress",
    slug: "floral-summer-dress",
    description:
      "Beautiful floral print dress perfect for summer. Features a flattering A-line silhouette, adjustable straps, and a flowy skirt that moves with you.",
    price: 99.00,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80",
    ],
    category: "Women",
    stock: 35,
  },
  {
    name: "High-Waisted Skinny Jeans",
    slug: "high-waisted-skinny-jeans",
    description:
      "Flattering high-waisted jeans with stretch for all-day comfort. Features a classic five-pocket design and ankle-length cut.",
    price: 79.00,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80",
      "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80",
    ],
    category: "Women",
    stock: 40,
  },
  {
    name: "Cashmere Blend Sweater",
    slug: "cashmere-blend-sweater",
    description:
      "Luxuriously soft cashmere blend sweater with a relaxed fit. Features ribbed cuffs and hem, perfect for layering or wearing alone.",
    price: 149.00,
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80",
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
    ],
    category: "Women",
    stock: 25,
  },
  {
    name: "Silk Blouse",
    slug: "silk-blouse",
    description:
      "Elegant silk blouse with a relaxed fit. Features a classic collar, button-front closure, and slightly oversized silhouette for effortless style.",
    price: 129.00,
    images: [
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80",
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80",
    ],
    category: "Women",
    stock: 20,
  },
  {
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    description:
      "Elegant pleated midi skirt with a flattering high waist. Made from flowing fabric that creates beautiful movement. Perfect for work or special occasions.",
    price: 89.00,
    images: [
      "https://plus.unsplash.com/premium_photo-1671718111976-48b74d57c181?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    ],
    category: "Women",
    stock: 18,
  },

  // Accessories
  {
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    description:
      "Compact yet spacious crossbody bag crafted from genuine leather. Features an adjustable strap, multiple compartments, and gold-tone hardware.",
    price: 199.00,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80",
    ],
    category: "Accessories",
    stock: 15,
  },
  {
    name: "Classic Aviator Sunglasses",
    slug: "classic-aviator-sunglasses",
    description:
      "Timeless aviator sunglasses with UV400 protection. Features a lightweight metal frame and gradient lenses for a stylish look.",
    price: 159.00,
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    ],
    category: "Accessories",
    stock: 50,
  },
  {
    name: "Minimalist Watch",
    slug: "minimalist-watch",
    description:
      "Elegant minimalist watch with a clean dial and genuine leather strap. Features Japanese quartz movement and water resistance up to 30m.",
    price: 249.00,
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80",
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80",
    ],
    category: "Accessories",
    stock: 12,
  },
  {
    name: "Wool Fedora Hat",
    slug: "wool-fedora-hat",
    description:
      "Classic wool fedora hat with a leather band. Handcrafted for a perfect fit and timeless style that complements any outfit.",
    price: 69.00,
    images: [
      "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=800&q=80",
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80",
    ],
    category: "Accessories",
    stock: 22,
  },
  {
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    description:
      "Durable canvas tote bag with leather handles. Spacious interior with inside pocket, perfect for everyday use or shopping trips.",
    price: 49.00,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=800&q=80",
    ],
    category: "Accessories",
    stock: 45,
  },

  // Footwear
  {
    name: "White Leather Sneakers",
    slug: "white-leather-sneakers",
    description:
      "Clean white leather sneakers with a minimalist design. Features a cushioned insole and durable rubber outsole for all-day comfort.",
    price: 139.00,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
    ],
    category: "Footwear",
    stock: 30,
  },
  {
    name: "Chelsea Boots",
    slug: "chelsea-boots",
    description:
      "Classic Chelsea boots crafted from premium leather. Features elastic side panels and a low heel for easy wear and timeless style.",
    price: 189.00,
    images: [
      "https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=800&q=80",
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80",
    ],
    category: "Footwear",
    stock: 20,
  },
  {
    name: "Running Shoes",
    slug: "running-shoes",
    description:
      "High-performance running shoes with responsive cushioning. Features breathable mesh upper and supportive midsole for maximum comfort.",
    price: 159.00,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
    ],
    category: "Footwear",
    stock: 35,
  },
  {
    name: "Suede Loafers",
    slug: "suede-loafers",
    description:
      "Elegant suede loafers with a classic penny strap. Features a flexible sole and cushioned insole for comfort and style.",
    price: 169.00,
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&q=80",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80",
    ],
    category: "Footwear",
    stock: 18,
  },
  {
    name: "Heeled Ankle Boots",
    slug: "heeled-ankle-boots",
    description:
      "Chic ankle boots with a block heel for comfortable height. Crafted from smooth leather with a side zipper for easy wear.",
    price: 179.00,
    images: [
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
      "https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=800&q=80",
    ],
    category: "Footwear",
    stock: 14,
  },
];

async function seed() {
  try {
    console.log("Clearing existing products...");
    await db.delete(products);

    console.log("Inserting sample products...");
    const now = new Date();

    for (const product of productData) {
      await db.insert(products).values({
        id: generateId(),
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        currency: "usd",
        images: JSON.stringify(product.images),
        category: product.category,
        stock: product.stock,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log(`Successfully seeded ${productData.length} products!`);
    console.log("\nCategories added:");
    console.log("- Men (5 products)");
    console.log("- Women (5 products)");
    console.log("- Accessories (5 products)");
    console.log("- Footwear (5 products)");
    console.log("\nDone!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
