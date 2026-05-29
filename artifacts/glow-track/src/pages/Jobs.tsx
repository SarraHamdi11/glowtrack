import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";

type Job = { id: string; company: string; role: string; status: string; notes?: string | null; salary?: string | null; jobUrl?: string | null; appliedAt: string };
type Status = "Applied" | "Interview" | "Offer" | "Rejected";

const STATUSES: Status[] = ["Applied", "Interview", "Offer", "Rejected"];
const statusBadge: Record<string, string> = {
  Applied:   "bg-blue-100 text-blue-700",
  Interview: "bg-amber-100 text-amber-700",
  Offer:     "bg-green-100 text-green-700",
  Rejected:  "bg-pink-100 text-pink-700",
};
const kanbanColors: Record<string, string> = {
  Applied: "border-t-blue-400", Interview: "border-t-yellow-400", Offer: "border-t-green-400", Rejected: "border-t-red-400",
};

const EMPTY_FORM = { company: "", role: "", status: "Applied" as Status, notes: "", salary: "", jobUrl: "", appliedAt: new Date().toISOString().slice(0, 10) };

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"table" | "kanban">("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Job | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    try {
      const { data } = await api.get("/jobs");
      setJobs(data);
    } finally { setLoading(false); }
  }

  function openAdd() { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); }
  function openEdit(job: Job) {
    setEditing(job);
    setForm({ company: job.company, role: job.role, status: job.status as Status, notes: job.notes ?? "", salary: job.salary ?? "", jobUrl: job.jobUrl ?? "", appliedAt: job.appliedAt.slice(0, 10) });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.company || !form.role) { toast.error("Company and role are required"); return; }
    setSaving(true);
    try {
      if (editing) {
        const { data } = await api.patch(`/jobs/${editing.id}`, form);
        setJobs(j => j.map(x => x.id === editing.id ? data : x));
        toast.success("Job updated");
      } else {
        const { data } = await api.post("/jobs", form);
        setJobs(j => [data, ...j]);
        toast.success("Job added!");
      }
      setShowModal(false);
    } catch { toast.error("Something went wrong"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    await api.delete(`/jobs/${id}`);
    setJobs(j => j.filter(x => x.id !== id));
    setDeleteId(null);
    toast.success("Job deleted");
  }

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    const matchQ = !q || j.company.toLowerCase().includes(q) || j.role.toLowerCase().includes(q);
    const matchS = !statusFilter || j.status === statusFilter;
    return matchQ && matchS;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Job Tracker</h1>
            <p className="text-muted-foreground text-sm mt-1">{jobs.length} application{jobs.length !== 1 ? "s" : ""} tracked</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-muted rounded-xl p-1 text-sm">
              <button onClick={() => setView("table")} className={`px-3 py-1.5 rounded-lg transition ${view === "table" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}>Table</button>
              <button onClick={() => setView("kanban")} className={`px-3 py-1.5 rounded-lg transition ${view === "kanban" ? "bg-card shadow text-foreground" : "text-muted-foreground"}`}>Kanban</button>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold shadow hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
            >
              <Plus className="w-4 h-4" /> Add job
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company or role..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 rounded-xl border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? <div className="flex justify-center py-12"><div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
          : view === "table" ? <TableView jobs={filtered} onEdit={openEdit} onDelete={setDeleteId} />
          : <KanbanView jobs={filtered} onEdit={openEdit} onDelete={setDeleteId} />
        }
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <Modal title={editing ? "Edit job" : "Add job application"} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {[["Company *", "company", "e.g. Google"], ["Role *", "role", "e.g. Junior Developer"], ["Salary", "salary", "e.g. £35,000"], ["Job URL", "jobUrl", "https://..."]].map(([label, key, placeholder]) => (
              <div key={key}>
                <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    border: "1px solid #c7d2fe",
                    color: "#3730a3",
                  }}
                />
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>Status</label>
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid #c7d2fe",
                  color: "#3730a3",
                }}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>Date applied</label>
              <input
                type="date"
                value={form.appliedAt}
                onChange={e => setForm(f => ({ ...f, appliedAt: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid #c7d2fe",
                  color: "#3730a3",
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                placeholder="Any notes..."
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition resize-none"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid #c7d2fe",
                  color: "#3730a3",
                }}
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
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-semibold transition disabled:opacity-60 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
              >
                <Plus className="w-4 h-4" />
                {saving ? "Saving..." : editing ? "Update" : "Add job"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <Modal title="Delete job?" onClose={() => setDeleteId(null)}>
          <p className="text-sm mb-6" style={{ color: "#6366f1" }}>This action cannot be undone.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
              style={{ background: "rgba(255,255,255,0.6)", border: "1px solid #e2d0f0", color: "#9b7bb5" }}
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
        </Modal>
      )}
    </DashboardLayout>
  );
}

function TableView({ jobs, onEdit, onDelete }: { jobs: Job[]; onEdit: (j: Job) => void; onDelete: (id: string) => void }) {
  if (!jobs.length) return <Empty message="No jobs found. Add your first application!" />;
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>{["Company", "Role", "Status", "Salary", "Applied", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map(job => (
              <tr key={job.id} className="hover:bg-muted/30 transition">
                <td className="px-4 py-3 font-medium">{job.company}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.role}</td>
                <td className="px-4 py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadge[job.status]}`}>{job.status}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{job.salary || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(job.appliedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {job.jobUrl && <a href={job.jobUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition"><ExternalLink className="w-4 h-4" /></a>}
                    <button onClick={() => onEdit(job)} className="text-muted-foreground hover:text-primary transition"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(job.id)} className="text-muted-foreground hover:text-destructive transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KanbanView({ jobs, onEdit, onDelete }: { jobs: Job[]; onEdit: (j: Job) => void; onDelete: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {STATUSES.map(status => {
        const col = jobs.filter(j => j.status === status);
        return (
          <div key={status} className={`bg-card border-t-4 ${kanbanColors[status]} border border-border rounded-2xl p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">{status}</h3>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">{col.length}</span>
            </div>
            <div className="space-y-3">
              {col.map(job => (
                <div key={job.id} className="bg-background border border-border rounded-xl p-3 hover:shadow-sm transition">
                  <p className="font-medium text-sm">{job.company}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.role}</p>
                  {job.salary && <p className="text-xs text-primary mt-1">{job.salary}</p>}
                  <div className="flex gap-1.5 mt-2">
                    <button onClick={() => onEdit(job)} className="text-muted-foreground hover:text-primary transition"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => onDelete(job.id)} className="text-muted-foreground hover:text-destructive transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {!col.length && <p className="text-xs text-muted-foreground text-center py-4">No jobs here</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-md rounded-3xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: "linear-gradient(145deg, #f5f3ff 0%, #eff6ff 100%)", border: "0.5px solid #c7d2fe" }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, #e0e7ff 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute -bottom-8 -left-8 w-28 h-28 rounded-full" style={{ background: "radial-gradient(circle, #dbeafe 0%, transparent 70%)" }} />

        <div className="relative">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-lg" style={{ color: "#4338ca" }}>{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition"
              style={{ background: "#e0e7ff", color: "#6366f1" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return <div className="text-center py-16 text-muted-foreground text-sm">{message}</div>;
}
