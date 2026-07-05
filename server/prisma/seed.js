import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  const shopsPath = path.resolve(process.cwd(), "..", "src", "data", "shops.js");
  const { default: shops } = await import(`file://${shopsPath}`);

  const productsPath = path.resolve(process.cwd(), "..", "src", "data", "products.js");
  let productsSrc = await (await import('fs')).promises.readFile(productsPath, "utf-8");
  // inject shops as JSON to avoid ESM relative import resolution
  productsSrc = productsSrc.replace(/import\s+shops\s+from\s+\"\.\/shops\";?/, `const shops = ${JSON.stringify(shops)};`);
  const dataUrl = 'data:text/javascript;charset=utf-8,' + encodeURIComponent(productsSrc);
  const { default: products } = await import(dataUrl);

  const data = products.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
    oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
    image: p.image || null,
    rating: p.rating || null,
    sold: p.sold || null,
    stock: p.stock || null,
    category: p.category || null,
    brand: p.brand || null,
    featured: Boolean(p.featured),
    description: p.description || null,
  }));

  console.log(`Seeding ${data.length} products`);
  for (const p of data) {
    await prisma.product.upsert({ where: { id: p.id }, update: p, create: p });
  }
  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
