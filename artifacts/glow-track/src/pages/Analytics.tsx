import { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";

export default function Analytics() {
  const [jobStats, setJobStats] = useState<any>(null);
  const [habits, setHabits] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/jobs/stats/summary"),
      api.get("/habits"),
      api.get("/tasks"),
    ]).then(([j, h, t]) => {
      setJobStats(j.data);
      setHabits(h.data);
      setTasks(t.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
    </DashboardLayout>
  );

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const acceptanceRate = jobStats?.total ? Math.round((jobStats.offer / jobStats.total) * 100) : 0;

  // Tasks per priority
  const tasksByPriority = [
    { name: "High",   count: tasks.filter(t => t.priority === "High").length,   fill: "#EF4444" },
    { name: "Medium", count: tasks.filter(t => t.priority === "Medium").length, fill: "#F97316" },
    { name: "Low",    count: tasks.filter(t => t.priority === "Low").length,    fill: "#6B7280" },
  ];

  // Habit completion
  const habitData = habits.map(h => ({
    name: h.name.length > 12 ? h.name.slice(0, 12) + "…" : h.name,
    streak: h.streak,
    completed: h.completed ? 1 : 0,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Insights into your productivity and job search</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Applications", value: jobStats?.total ?? 0, sub: "all time" },
            { label: "Offer Rate",          value: `${acceptanceRate}%`, sub: "of applications" },
            { label: "Tasks Completed",     value: completedTasks, sub: `of ${totalTasks} total` },
            { label: "Best Streak",         value: habits.length ? `${Math.max(...habits.map((h: any) => h.streak))}🔥` : "0", sub: "days" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden">
              <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }} />
              <p className="text-sm text-muted-foreground relative">{s.label}</p>
              <p className="text-3xl font-bold mt-1 relative" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1 relative">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Applications over time */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold mb-1">Applications per week</h2>
            <p className="text-xs text-muted-foreground mb-4">Last 8 weeks</p>
            {jobStats?.weeklyData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={jobStats.weeklyData}>
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip labelFormatter={v => `Week of ${v}`} />
                  <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} name="Applications" />
                </LineChart>
              </ResponsiveContainer>
            ) : <Empty />}
          </div>

          {/* Job status breakdown */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold mb-1">Job status breakdown</h2>
            <p className="text-xs text-muted-foreground mb-4">Current pipeline</p>
            {jobStats?.total > 0 ? (
              <div className="space-y-3">
                {[
                  { label: "Applied",   count: jobStats.applied,   color: "bg-blue-400",   pct: jobStats.applied / jobStats.total },
                  { label: "Interview", count: jobStats.interview, color: "bg-yellow-400", pct: jobStats.interview / jobStats.total },
                  { label: "Offer",     count: jobStats.offer,     color: "bg-green-400",  pct: jobStats.offer / jobStats.total },
                  { label: "Rejected",  count: jobStats.rejected,  color: "bg-red-400",    pct: jobStats.rejected / jobStats.total },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{row.label}</span>
                      <span className="text-muted-foreground">{row.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="h-2.5 rounded-full transition-all" style={{ width: `${row.pct * 100}%`, background: "linear-gradient(135deg, #6366f1, #3b82f6)" }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <Empty />}
          </div>

          {/* Tasks by priority */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold mb-1">Tasks by priority</h2>
            <p className="text-xs text-muted-foreground mb-4">Distribution</p>
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={tasksByPriority}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Tasks">
                    {tasksByPriority.map((entry, i) => <Cell key={i} fill={i === 0 ? "#6366f1" : i === 1 ? "#3b82f6" : "#818cf8"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : <Empty />}
          </div>

          {/* Habit streaks */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold mb-1">Habit streaks</h2>
            <p className="text-xs text-muted-foreground mb-4">Current streaks per habit</p>
            {habits.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={habitData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="streak" fill="#6366f1" radius={[0, 6, 6, 0]} name="Streak (days)" />
                </BarChart>
              </ResponsiveContainer>
            ) : <Empty />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Empty() {
  return <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">Not enough data yet — keep tracking!</div>;
}
