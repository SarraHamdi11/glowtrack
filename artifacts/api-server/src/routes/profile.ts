import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
  if (!user) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, skills: user.skills, cvFilename: user.cvFilename, createdAt: user.createdAt });
});

router.patch("/", async (req: AuthRequest, res) => {
  const { name, bio, skills, avatar } = req.body;
  const [user] = await db.update(usersTable).set({
    ...(name !== undefined && { name }),
    ...(bio !== undefined && { bio }),
    ...(skills !== undefined && { skills }),
    ...(avatar !== undefined && { avatar }),
  }).where(eq(usersTable.id, req.userId!)).returning();
  res.json({ id: user.id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, skills: user.skills, cvFilename: user.cvFilename, createdAt: user.createdAt });
});

export default router;
