import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { signToken, requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already in use" });
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({ name, email, password: hashed }).returning();
  const token = signToken(user.id);
  res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, skills: user.skills, createdAt: user.createdAt } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, skills: user.skills, createdAt: user.createdAt } });
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, skills: user.skills, createdAt: user.createdAt });
});

export default router;
