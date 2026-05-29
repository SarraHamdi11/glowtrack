import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Briefcase, CheckSquare, Flame, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import DashboardCard from "@/components/DashboardCard";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const STATUS_COLORS: Record<string, string> = {
  Applied: "#8B5CF6", Interview: "#F59E0B", Offer: "#10B981", Rejected: "#EF4444",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/dashboard/stats"), api.get("/dashboard/activity")])
      .then(([s, a]) => { setStats(s.data); setActivity(a.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Good {getGreeting()}, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your career journey</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard title="Total Applications" value={stats?.totalJobs ?? 0}   icon={Briefcase}    color="purple" subtitle="job applications" gradient="linear-gradient(135deg, #6366f1, #3b82f6)" />
          <DashboardCard title="Interviews"          value={stats?.interviews ?? 0}  icon={TrendingUp}   color="pink"   subtitle="in progress" gradient="linear-gradient(135deg, #6366f1, #3b82f6)" />
          <DashboardCard title="Tasks Completed"     value={stats?.tasksCompleted ?? 0} icon={CheckSquare} color="blue" subtitle="all time" gradient="linear-gradient(135deg, #6366f1, #3b82f6)" />
          <DashboardCard title="Habit Streak"        value={`${stats?.habitStreak ?? 0}🔥`} icon={Flame} color="orange" subtitle="day streak" gradient="linear-gradient(135deg, #6366f1, #3b82f6)" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Line chart */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Applications over time</h2>
            {activity?.weeklyApplications?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={activity.weeklyApplications}>
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip labelFormatter={v => `Week of ${v}`} />
                  <Line type="monotone" dataKey="count" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: "#8B5CF6", r: 4 }} name="Applications" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="No applications yet — add your first job!" />
            )}
          </div>

          {/* Pie chart */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold mb-4">Application status</h2>
            {activity?.jobStatusBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={activity.jobStatusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={70} label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {activity.jobStatusBreakdown.map((entry: any) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "#8B5CF6"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Add jobs to see your status breakdown" />
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent jobs */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Recent applications</h2>
              <Link href="/jobs"><a className="text-xs text-primary flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></a></Link>
            </div>
            {activity?.recentJobs?.length > 0 ? (
              <div className="space-y-3">
                {activity.recentJobs.map((job: any) => (
                  <div key={job.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium">{job.company}</p>
                      <p className="text-xs text-muted-foreground">{job.role}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(job.status)}`}>{job.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No applications yet</p>
            )}
          </div>

          {/* Today's tasks */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Today's tasks</h2>
              <Link href="/tasks"><a className="text-xs text-primary flex items-center gap-1 hover:underline">View all <ArrowRight className="w-3 h-3" /></a></Link>
            </div>
            {stats && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{stats.todayTasksDone}/{stats.todayTasksTotal}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="h-2 rounded-full transition-all" style={{ width: `${stats.todayTasksTotal ? (stats.todayTasksDone / stats.todayTasksTotal) * 100 : 0}%`, background: "linear-gradient(135deg, #6366f1, #3b82f6)" }} />
                </div>
              </div>
            )}
            {activity?.todayTasks?.length > 0 ? (
              <div className="space-y-2">
                {activity.todayTasks.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="flex items-center gap-3 py-1.5">
                    <button
                      className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition ${task.completed ? "" : ""}`}
                      style={task.completed ? { background: "linear-gradient(135deg, #6366f1, #3b82f6)", borderColor: "transparent" } : { borderColor: "#a5b4fc" }}
                    >
                      {task.completed && <span className="text-white text-[10px]">✓</span>}
                    </button>
                    <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>{task.title}</span>
                    <span className={`ml-auto text-xs px-2.5 py-1 rounded-full font-medium ${priorityBadge(task.priority)}`}>{task.priority}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No tasks for today</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function EmptyChart({ message }: { message: string }) {
  return <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">{message}</div>;
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    Applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
    Interview: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    Offer: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    Rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  };
  return map[status] ?? "bg-muted text-muted-foreground";
}

function priorityBadge(priority: string) {
  const map: Record<string, string> = {
    High: "bg-rose-100 text-rose-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-emerald-100 text-emerald-700",
  };
  return map[priority] ?? "bg-muted text-muted-foreground";
}
