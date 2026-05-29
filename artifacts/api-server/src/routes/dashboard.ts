import { Router } from "express";
import { db, jobsTable, tasksTable, habitsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);

router.get("/stats", async (req: AuthRequest, res) => {
  const uid = req.userId!;
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.userId, uid));
  const tasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, uid));
  const habits = await db.select().from(habitsTable).where(eq(habitsTable.userId, uid));

  const totalJobs = jobs.length;
  const interviews = jobs.filter(j => j.status === "Interview").length;
  const tasksCompleted = tasks.filter(t => t.completed).length;

  const today = new Date().toDateString();
  const todayTasks = tasks.filter(t => {
    const created = new Date(t.createdAt).toDateString();
    return created === today || (t.dueDate && new Date(t.dueDate).toDateString() === today);
  });

  const streaks = habits.map(h => h.streak);
  const habitStreak = streaks.length > 0 ? Math.max(...streaks) : 0;

  res.json({
    totalJobs,
    interviews,
    tasksCompleted,
    habitStreak,
    todayTasksTotal: todayTasks.length,
    todayTasksDone: todayTasks.filter(t => t.completed).length,
  });
});

router.get("/activity", async (req: AuthRequest, res) => {
  const uid = req.userId!;
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.userId, uid)).orderBy(sql`${jobsTable.createdAt} desc`);
  const tasks = await db.select().from(tasksTable).where(eq(tasksTable.userId, uid));

  const recentJobs = jobs.slice(0, 5);
  const today = new Date().toDateString();
  const todayTasks = tasks.filter(t => {
    const created = new Date(t.createdAt).toDateString();
    return created === today || (t.dueDate && new Date(t.dueDate).toDateString() === today);
  });

  const weeklyMap: Record<string, number> = {};
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i * 7);
    d.setDate(d.getDate() - d.getDay());
    const key = d.toISOString().slice(0, 10);
    weeklyMap[key] = 0;
  }
  jobs.forEach(j => {
    const d = new Date(j.appliedAt);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    if (key in weeklyMap) weeklyMap[key] = (weeklyMap[key] || 0) + 1;
  });
  const weeklyApplications = Object.entries(weeklyMap).sort(([a], [b]) => a.localeCompare(b)).map(([week, count]) => ({ week, count }));

  const statusMap: Record<string, number> = {};
  jobs.forEach(j => { statusMap[j.status] = (statusMap[j.status] || 0) + 1; });
  const jobStatusBreakdown = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

  res.json({ recentJobs, todayTasks, weeklyApplications, jobStatusBreakdown });
});

export default router;
