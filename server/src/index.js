import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./prismaClient.js";
import path from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

app.get("/api/health", (req, res) => res.json({ ok: true }));

// Products
app.get("/api/products", async (req, res) => {
  const products = await prisma.product.findMany({});
  res.json(products);
});

// Auth: register
app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing" });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "User exists" });
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hashed, name } });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
});

// Auth: login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: "Invalid" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Invalid" });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
});

// Middleware: auth
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

app.get("/api/users/me", authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  res.json(user);
});

// Orders
app.post("/api/orders", authMiddleware, async (req, res) => {
  const { items, total, discount } = req.body;
  if (!items || !Array.isArray(items)) return res.status(400).json({ error: "Invalid items" });
  const order = await prisma.order.create({
    data: {
      userId: req.userId,
      total: Number(total || 0),
      discount: Number(discount || 0),
      items: { create: items.map((it) => ({ productId: it.productId, name: it.name, price: it.price, quantity: it.quantity })) },
    },
    include: { items: true },
  });
  // update user's totalSpent
  await prisma.user.update({ where: { id: req.userId }, data: { totalSpent: { increment: Number(total || 0) } } });
  res.json(order);
});

// Simple admin seed trigger (protected by env key)
app.post("/api/admin/seed-products", async (req, res) => {
  const key = req.headers["x-seed-key"] || req.query.key;
  if (key !== process.env.SEED_KEY) return res.status(401).json({ error: "Forbidden" });
  try {
    // dynamic import of frontend products
    const shopsPath = path.resolve(process.cwd(), "..", "src", "data", "shops.js");
    const { default: shops } = await import(`file://${shopsPath}`);

    const productsPath = path.resolve(process.cwd(), "..", "src", "data", "products.js");
    const fs = await import('fs');
    let productsSrc = await fs.promises.readFile(productsPath, "utf-8");
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
    for (const p of data) {
      await prisma.product.upsert({ where: { id: p.id }, update: p, create: p });
    }
    res.json({ ok: true, inserted: data.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Seed failed", details: String(err) });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
