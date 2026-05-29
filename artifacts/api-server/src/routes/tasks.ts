import { Router } from "express";
import { db, tasksTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  const { status } = req.query;
  const tasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, req.userId!)).orderBy(sql`${tasksTable.createdAt} desc`);
  if (status === "active") return res.json(tasks.filter(t => !t.completed));
  if (status === "completed") return res.json(tasks.filter(t => t.completed));
  res.json(tasks);
});

router.post("/", async (req: AuthRequest, res) => {
  const { title, priority, dueDate } = req.body;
  if (!title) { res.status(400).json({ error: "Title is required" }); return; }
  const [task] = await db.insert(tasksTable).values({
    userId: req.userId!,
    title,
    priority: priority || "Medium",
    dueDate: dueDate ? new Date(dueDate) : undefined,
  }).returning();
  res.status(201).json(task);
});

router.patch("/:id", async (req: AuthRequest, res) => {
  const { title, completed, priority, dueDate } = req.body;
  const [task] = await db.update(tasksTable).set({
    ...(title !== undefined && { title }),
    ...(completed !== undefined && { completed }),
    ...(priority !== undefined && { priority }),
    ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
  }).where(and(eq(tasksTable.id, req.params.id), eq(tasksTable.userId, req.userId!))).returning();
  if (!task) { res.status(404).json({ error: "Not found" }); return; }
  res.json(task);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  await db.delete(tasksTable).where(and(eq(tasksTable.id, req.params.id), eq(tasksTable.userId, req.userId!)));
  res.status(204).send();
});

export default router;
