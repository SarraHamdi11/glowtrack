import { Router } from "express";
import { db, habitsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, req.userId!)).orderBy(sql`${habitsTable.createdAt} asc`);
  const today = new Date().toDateString();
  const reset = habits.map(h => {
    const lastDate = h.lastCompletedAt ? new Date(h.lastCompletedAt).toDateString() : null;
    if (h.completed && lastDate !== today) {
      return { ...h, completed: false };
    }
    return h;
  });
  res.json(reset);
});

router.post("/", async (req: AuthRequest, res) => {
  const { name } = req.body;
  if (!name) { res.status(400).json({ error: "Name is required" }); return; }
  const [habit] = await db.insert(habitsTable).values({ userId: req.userId!, name }).returning();
  res.status(201).json(habit);
});

router.patch("/:id", async (req: AuthRequest, res) => {
  const { name } = req.body;
  const [habit] = await db.update(habitsTable).set({ ...(name && { name }) })
    .where(and(eq(habitsTable.id, req.params.id), eq(habitsTable.userId, req.userId!))).returning();
  if (!habit) { res.status(404).json({ error: "Not found" }); return; }
  res.json(habit);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  await db.delete(habitsTable).where(and(eq(habitsTable.id, req.params.id), eq(habitsTable.userId, req.userId!)));
  res.status(204).send();
});

router.post("/:id/toggle", async (req: AuthRequest, res) => {
  const [habit] = await db.select().from(habitsTable).where(and(eq(habitsTable.id, req.params.id), eq(habitsTable.userId, req.userId!))).limit(1);
  if (!habit) { res.status(404).json({ error: "Not found" }); return; }

  const today = new Date().toDateString();
  const lastDate = habit.lastCompletedAt ? new Date(habit.lastCompletedAt).toDateString() : null;
  const wasCompleted = habit.completed && lastDate === today;

  let newStreak = habit.streak;
  let newCompleted = !wasCompleted;
  let newLastCompleted: Date | null = habit.lastCompletedAt;

  if (!wasCompleted) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = lastDate === yesterday.toDateString();
    newStreak = wasYesterday ? habit.streak + 1 : 1;
    newLastCompleted = new Date();
  } else {
    newStreak = Math.max(0, habit.streak - 1);
    newLastCompleted = null;
  }

  const [updated] = await db.update(habitsTable).set({
    completed: newCompleted,
    streak: newStreak,
    lastCompletedAt: newLastCompleted,
  }).where(eq(habitsTable.id, req.params.id)).returning();
  res.json(updated);
});

export default router;
