import { Router } from "express";
import { db, jobsTable } from "@workspace/db";
import { eq, and, ilike, sql } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middlewares/auth";

const router = Router();
router.use(requireAuth);

router.get("/stats/summary", async (req: AuthRequest, res) => {
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.userId, req.userId!));
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === "Applied").length;
  const interview = jobs.filter(j => j.status === "Interview").length;
  const offer = jobs.filter(j => j.status === "Offer").length;
  const rejected = jobs.filter(j => j.status === "Rejected").length;

  const weeklyMap: Record<string, number> = {};
  jobs.forEach(j => {
    const d = new Date(j.appliedAt);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    weeklyMap[key] = (weeklyMap[key] || 0) + 1;
  });
  const weeklyData = Object.entries(weeklyMap).sort(([a], [b]) => a.localeCompare(b)).slice(-8).map(([week, count]) => ({ week, count }));

  res.json({ total, applied, interview, offer, rejected, weeklyData });
});

router.get("/", async (req: AuthRequest, res) => {
  const { status, search } = req.query;
  let query = db.select().from(jobsTable).where(eq(jobsTable.userId, req.userId!));
  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.userId, req.userId!)).orderBy(sql`${jobsTable.createdAt} desc`);
  let filtered = jobs;
  if (status && typeof status === "string") filtered = filtered.filter(j => j.status === status);
  if (search && typeof search === "string") {
    const s = search.toLowerCase();
    filtered = filtered.filter(j => j.company.toLowerCase().includes(s) || j.role.toLowerCase().includes(s));
  }
  res.json(filtered);
});

router.post("/", async (req: AuthRequest, res) => {
  const { company, role, status, notes, salary, jobUrl, appliedAt } = req.body;
  if (!company || !role) {
    res.status(400).json({ error: "Company and role are required" });
    return;
  }
  const [job] = await db.insert(jobsTable).values({
    userId: req.userId!,
    company,
    role,
    status: status || "Applied",
    notes,
    salary,
    jobUrl,
    appliedAt: appliedAt ? new Date(appliedAt) : new Date(),
  }).returning();
  res.status(201).json(job);
});

router.get("/:id", async (req: AuthRequest, res) => {
  const [job] = await db.select().from(jobsTable).where(and(eq(jobsTable.id, req.params.id), eq(jobsTable.userId, req.userId!))).limit(1);
  if (!job) { res.status(404).json({ error: "Not found" }); return; }
  res.json(job);
});

router.patch("/:id", async (req: AuthRequest, res) => {
  const { company, role, status, notes, salary, jobUrl, appliedAt } = req.body;
  const [job] = await db.update(jobsTable).set({
    ...(company && { company }),
    ...(role && { role }),
    ...(status && { status }),
    ...(notes !== undefined && { notes }),
    ...(salary !== undefined && { salary }),
    ...(jobUrl !== undefined && { jobUrl }),
    ...(appliedAt && { appliedAt: new Date(appliedAt) }),
  }).where(and(eq(jobsTable.id, req.params.id), eq(jobsTable.userId, req.userId!))).returning();
  if (!job) { res.status(404).json({ error: "Not found" }); return; }
  res.json(job);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  await db.delete(jobsTable).where(and(eq(jobsTable.id, req.params.id), eq(jobsTable.userId, req.userId!)));
  res.status(204).send();
});

export default router;
