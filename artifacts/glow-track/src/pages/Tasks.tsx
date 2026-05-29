import { useEffect, useState } from "react";
import { Plus, Trash2, X, Calendar, Sparkles } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";

type Task = { id: string; title: string; completed: boolean; priority: string; dueDate?: string | null; createdAt: string };
type Filter = "all" | "active" | "completed";
type Priority = "Low" | "Medium" | "High";
type Category = "Work" | "Personal" | "Health" | "Learn";

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];
const CATEGORIES: { label: Category; emoji: string; color: string; activeColor: string }[] = [
  { label: "Work",     emoji: "💼", color: "border-indigo-200 text-indigo-700 bg-white/70",     activeColor: "border-indigo-400 text-indigo-700 bg-indigo-100" },
  { label: "Personal", emoji: "🌸", color: "border-purple-200 text-purple-700 bg-white/70",     activeColor: "border-purple-400 text-purple-700 bg-purple-100" },
  { label: "Health",   emoji: "🌿", color: "border-emerald-200 text-emerald-700 bg-white/70",   activeColor: "border-emerald-400 text-emerald-700 bg-emerald-100" },
  { label: "Learn",    emoji: "📚", color: "border-amber-200 text-amber-700 bg-white/70",   activeColor: "border-amber-400 text-amber-700 bg-amber-100" },
];

const priorityConfig: Record<string, { badge: string; btn: string; activebtn: string; dot: string }> = {
  Low:    { badge: "bg-emerald-100 text-emerald-700",   btn: "border-emerald-200 bg-emerald-50 text-emerald-700",   activebtn: "border-emerald-400 bg-emerald-100 ring-2 ring-emerald-200 text-emerald-800",   dot: "bg-emerald-500" },
  Medium: { badge: "bg-amber-100 text-amber-700",   btn: "border-amber-200 bg-amber-50 text-amber-700",   activebtn: "border-amber-400 bg-amber-100 ring-2 ring-amber-200 text-amber-800",   dot: "bg-amber-500" },
  High:   { badge: "bg-rose-100 text-rose-700",     btn: "border-rose-200 bg-rose-50 text-rose-700",      activebtn: "border-rose-400 bg-rose-100 ring-2 ring-rose-200 text-rose-800",      dot: "bg-rose-500" },
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", priority: "Low" as Priority, dueDate: "", categories: ["Work"] as Category[] });
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => { fetchTasks(); }, []);

  async function fetchTasks() {
    try { const { data } = await api.get("/tasks"); setTasks(data); }
    finally { setLoading(false); }
  }

  async function handleAdd() {
    if (!form.title.trim()) { toast.error("Task title is required"); return; }
    setSaving(true);
    try {
      const { data } = await api.post("/tasks", form);
      setTasks(t => [data, ...t]);
      setForm({ title: "", priority: "Low", dueDate: "", categories: ["Work"] });
      setShowModal(false);
      toast.success("Task added!");
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  }

  async function toggleComplete(task: Task) {
    const { data } = await api.patch(`/tasks/${task.id}`, { completed: !task.completed });
    setTasks(t => t.map(x => x.id === task.id ? data : x));
  }

  async function handleDelete(id: string) {
    await api.delete(`/tasks/${id}`);
    setTasks(t => t.filter(x => x.id !== id));
    toast.success("Task deleted");
  }

  async function handleClearCompleted() {
    const completed = tasks.filter(t => t.completed);
    await Promise.all(completed.map(t => api.delete(`/tasks/${t.id}`)));
    setTasks(t => t.filter(x => !x.completed));
    toast.success(`Cleared ${completed.length} completed task${completed.length !== 1 ? "s" : ""}`);
  }

  async function saveInlineEdit(id: string) {
    if (!editTitle.trim()) { setEditingId(null); return; }
    const { data } = await api.patch(`/tasks/${id}`, { title: editTitle });
    setTasks(t => t.map(x => x.id === id ? data : x));
    setEditingId(null);
  }

  function toggleCategory(cat: Category) {
    setForm(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }));
  }

  const filtered = tasks.filter(t => filter === "all" ? true : filter === "active" ? !t.completed : t.completed);
  const completedCount = tasks.filter(t => t.completed).length;
  const isOverdue = (task: Task) => task.dueDate && !task.completed && new Date(task.dueDate) < new Date();
  const charsLeft = 120 - form.title.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Task Manager</h1>
            <p className="text-muted-foreground text-sm mt-1">{completedCount}/{tasks.length} completed</p>
          </div>
          <div className="flex items-center gap-2">
            {completedCount > 0 && (
              <button onClick={handleClearCompleted} className="text-sm text-muted-foreground hover:text-destructive transition px-3 py-2 rounded-xl hover:bg-muted">
                Clear completed
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
            >
              <Plus className="w-4 h-4" /> Add task
            </button>
          </div>
        </div>

        {/* Progress bar */}
        {tasks.length > 0 && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Overall progress</span><span>{Math.round((completedCount / tasks.length) * 100)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / tasks.length) * 100}%`, background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
              />
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
          {(["all", "active", "completed"] as Filter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition ${filter === f ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}>{f}</button>
          ))}
        </div>

        {/* Task list */}
        {loading
          ? <div className="flex justify-center py-12"><div className="w-7 h-7 border-4 border-pink-300 border-t-transparent rounded-full animate-spin" /></div>
          : filtered.length === 0
            ? <div className="text-center py-16 text-muted-foreground text-sm">No {filter === "all" ? "" : filter} tasks. {filter === "all" ? "Add your first task!" : ""}</div>
            : (
              <div className="space-y-2">
                {filtered.map(task => (
                  <div key={task.id} className={`flex items-center gap-3 bg-card border rounded-xl px-4 py-3 hover:shadow-sm transition group ${isOverdue(task) ? "border-pink-300" : "border-border"}`}>
                    <button
                      onClick={() => toggleComplete(task)}
                      className="w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition"
                      style={task.completed ? { background: "linear-gradient(135deg, #6366f1, #3b82f6)", borderColor: "transparent" } : { borderColor: "#a5b4fc" }}
                    >
                      {task.completed && <span className="text-white text-[10px]">✓</span>}
                    </button>

                    <div className="flex-1 min-w-0">
                      {editingId === task.id ? (
                        <input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)}
                          onBlur={() => saveInlineEdit(task.id)}
                          onKeyDown={e => { if (e.key === "Enter") saveInlineEdit(task.id); if (e.key === "Escape") setEditingId(null); }}
                          className="w-full text-sm bg-transparent focus:outline-none border-b border-pink-400" />
                      ) : (
                        <span onClick={() => { setEditingId(task.id); setEditTitle(task.title); }}
                          className={`text-sm cursor-pointer transition hover:text-indigo-500 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </span>
                      )}
                      {task.dueDate && (
                        <div className={`flex items-center gap-1 mt-0.5 text-xs ${isOverdue(task) ? "text-rose-500" : "text-muted-foreground"}`}>
                          <Calendar className="w-3 h-3" />
                          {isOverdue(task) ? "Overdue · " : ""}{new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                        </div>
                      )}
                    </div>

                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityConfig[task.priority].badge}`}>{task.priority}</span>
                    <button onClick={() => handleDelete(task.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )
        }
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div
            className="relative w-full max-w-md rounded-3xl shadow-2xl p-6 overflow-hidden"
            style={{ background: "linear-gradient(145deg, #f5f3ff 0%, #eff6ff 100%)", border: "0.5px solid #c7d2fe" }}
          >
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, #e0e7ff 0%, transparent 70%)" }} />
            <div className="pointer-events-none absolute -bottom-8 -left-8 w-28 h-28 rounded-full" style={{ background: "radial-gradient(circle, #dbeafe 0%, transparent 70%)" }} />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #818cf8, #60a5fa)" }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#4338ca] text-base leading-tight">New task</p>
                  <p className="text-xs text-[#6366f1] leading-tight">You've got this ✨</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl transition"
                style={{ background: "#e0e7ff", color: "#6366f1" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>
                  What are you working on?
                </label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value.slice(0, 120) }))}
                  onKeyDown={e => e.key === "Enter" && handleAdd()}
                  placeholder="e.g. Update portfolio website"
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: "1px solid #c7d2fe",
                    color: "#3730a3",
                  }}
                />
                <p className="text-right text-xs mt-1" style={{ color: "#818cf8" }}>{charsLeft} left</p>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(({ label, emoji, color, activeColor }) => (
                    <button
                      key={label}
                      onClick={() => toggleCategory(label)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-[1.5px] transition ${form.categories.includes(label) ? activeColor : color}`}
                    >
                      {emoji} {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ borderTop: "1px dashed #c7d2fe" }} />

              {/* Priority */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      onClick={() => setForm(f => ({ ...f, priority: p }))}
                      className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border-[1.5px] text-xs font-semibold transition ${form.priority === p ? priorityConfig[p].activebtn : priorityConfig[p].btn}`}
                    >
                      <span className={`w-2 h-2 rounded-full ${priorityConfig[p].dot}`} />
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Due date */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>
                  Due date <span className="normal-case font-normal tracking-normal" style={{ color: "#818cf8" }}>— optional</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#60a5fa" }} />
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
                    style={{
                      background: "rgba(255,255,255,0.75)",
                      border: "1px solid #c8dff8",
                      color: "#2d5580",
                    }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-[1fr_1.6fr] gap-2.5 pt-1">
                <button
                  onClick={() => setShowModal(false)}
                  className="py-2.5 rounded-xl text-sm font-semibold transition"
                  style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #c7d2fe", color: "#6366f1" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={saving}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition disabled:opacity-60 hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
                >
                  <Plus className="w-4 h-4" />
                  {saving ? "Adding..." : "Add task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}