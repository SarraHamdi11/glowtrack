import { useEffect, useState } from "react";
import { Plus, Trash2, X, Flame } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";

type Habit = { id: string; name: string; completed: boolean; streak: number; createdAt: string };

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchHabits(); }, []);

  async function fetchHabits() {
    try { const { data } = await api.get("/habits"); setHabits(data); }
    finally { setLoading(false); }
  }

  async function handleAdd() {
    if (!name.trim()) { toast.error("Habit name is required"); return; }
    setSaving(true);
    try {
      const { data } = await api.post("/habits", { name });
      setHabits(h => [...h, data]);
      setName(""); setShowModal(false);
      toast.success("Habit added!");
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  }

  async function toggleHabit(id: string) {
    const { data } = await api.post(`/habits/${id}/toggle`);
    setHabits(h => h.map(x => x.id === id ? data : x));
  }

  async function handleDelete(id: string) {
    await api.delete(`/habits/${id}`);
    setHabits(h => h.filter(x => x.id !== id));
    setDeleteId(null);
    toast.success("Habit deleted");
  }

  const completedCount = habits.filter(h => h.completed).length;
  const completionPct = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Habit Tracker</h1>
            <p className="text-muted-foreground text-sm mt-1">Build consistent habits, one day at a time</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow hover:opacity-90 transition"
            style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
          >
            <Plus className="w-4 h-4" /> Add habit
          </button>
        </div>

        {/* Today's progress */}
        {habits.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold">Today's progress</h2>
                <p className="text-sm text-muted-foreground">{completedCount} of {habits.length} habits completed</p>
              </div>
              <span className="text-3xl font-extrabold" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{completionPct}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%`, background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
              />
            </div>
          </div>
        )}

        {/* Habits grid */}
        {loading ? <div className="flex justify-center py-12"><div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          : habits.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌱</div>
              <p className="font-semibold text-lg">No habits yet</p>
              <p className="text-muted-foreground text-sm mt-1">Add your first habit to start building consistency</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
              >
                Add first habit
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map(habit => (
                <div key={habit.id} className={`bg-card border rounded-2xl p-5 transition hover:shadow-md group ${habit.completed ? "border-primary/40 bg-primary/5 dark:bg-primary/10" : "border-border"}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold">{habit.name}</p>
                      <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                        <Flame className={`w-4 h-4 ${habit.streak > 0 ? "text-orange-500" : ""}`} />
                        <span>{habit.streak} day streak</span>
                      </div>
                    </div>
                    <button onClick={() => setDeleteId(habit.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Streak dots */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full ${i < Math.min(habit.streak, 7) ? "" : "bg-muted"}`}
                        style={i < Math.min(habit.streak, 7) ? { background: "linear-gradient(135deg, #6366f1, #3b82f6)" } : undefined}
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className="w-full py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90"
                    style={habit.completed ? { background: "rgba(99, 102, 241, 0.1)", color: "#6366f1" } : { background: "linear-gradient(135deg, #6366f1, #3b82f6)", color: "white" }}
                  >
                    {habit.completed ? "✓ Done for today!" : "Mark complete"}
                  </button>
                </div>
              ))}
            </div>
          )
        }
      </div>

      {/* Add modal */}
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
                  <Flame className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#4338ca] text-base leading-tight">New habit</p>
                  <p className="text-xs text-[#6366f1] leading-tight">Build consistency ✨</p>
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
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>Habit name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdd()}
                  placeholder="e.g. Morning workout, Read 30 mins..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: "1px solid #c7d2fe",
                    color: "#3730a3",
                  }}
                  autoFocus
                />
              </div>

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
                  {saving ? "Adding..." : "Add habit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div
            className="relative w-full max-w-md rounded-3xl shadow-2xl p-6 overflow-hidden"
            style={{ background: "linear-gradient(145deg, #f5f3ff 0%, #eff6ff 100%)", border: "0.5px solid #c7d2fe" }}
          >
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, #e0e7ff 0%, transparent 70%)" }} />
            <div className="pointer-events-none absolute -bottom-8 -left-8 w-28 h-28 rounded-full" style={{ background: "radial-gradient(circle, #dbeafe 0%, transparent 70%)" }} />

            <div className="relative">
              <h2 className="font-bold text-lg mb-2" style={{ color: "#4338ca" }}>Delete habit?</h2>
              <p className="text-sm mb-6" style={{ color: "#6366f1" }}>Your streak will be lost. This cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                  style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #c7d2fe", color: "#6366f1" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
