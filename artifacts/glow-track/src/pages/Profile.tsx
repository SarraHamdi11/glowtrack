import { useEffect, useState, useRef } from "react";
import { User, Mail, FileText, Tag, Camera, Moon, Sun, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import DashboardLayout from "@/layouts/DashboardLayout";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user, setUser, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [form, setForm] = useState({ name: "", bio: "", skills: [] as string[], avatar: "" });
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get("/profile").then(({ data }) => {
      setForm({ name: data.name ?? "", bio: data.bio ?? "", skills: data.skills ?? [], avatar: data.avatar ?? "" });
    }).finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const { data } = await api.patch("/profile", form);
      setUser({ ...user!, ...data });
      toast.success("Profile updated!");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  }

  function addSkill() {
    const skill = skillInput.trim();
    if (!skill || form.skills.includes(skill)) return;
    setForm(f => ({ ...f, skills: [...f.skills, skill] }));
    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, avatar: ev.target?.result as string }));
    reader.readAsDataURL(file);
  }

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
        </div>

        {/* Avatar */}
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }} />
          <h2 className="font-semibold mb-4 flex items-center gap-2 relative"><User className="w-4 h-4" style={{ color: "#6366f1" }} /> Profile picture</h2>
          <div className="flex items-center gap-5 relative">
            <div className="relative">
              {form.avatar
                ? <img src={form.avatar} className="w-20 h-20 rounded-2xl object-cover border-2" style={{ borderColor: "#a5b4fc" }} alt="Avatar" />
                : <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>{form.name?.[0]?.toUpperCase()}</div>
              }
              <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white hover:opacity-90 transition shadow" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <button onClick={() => fileRef.current?.click()} className="text-xs mt-1 hover:underline" style={{ color: "#6366f1" }}>Change photo</button>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }} />
          <h2 className="font-semibold mb-4 flex items-center gap-2 relative"><Mail className="w-4 h-4" style={{ color: "#6366f1" }} /> Basic information</h2>
          <div className="space-y-4 relative">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>Full name</label>
              <input
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid #c7d2fe",
                  color: "#3730a3",
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>Email</label>
              <input
                value={user?.email ?? ""}
                disabled
                className="w-full px-4 py-2.5 rounded-xl text-sm text-muted-foreground cursor-not-allowed"
                style={{
                  background: "rgba(255,255,255,0.4)",
                  border: "1px solid #c7d2fe",
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#6366f1" }}>Bio</label>
              <textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none transition resize-none"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  border: "1px solid #c7d2fe",
                  color: "#3730a3",
                }}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }} />
          <h2 className="font-semibold mb-4 flex items-center gap-2 relative"><Tag className="w-4 h-4" style={{ color: "#6366f1" }} /> Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3 relative">
            {form.skills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full" style={{ background: "rgba(99, 102, 241, 0.1)", color: "#6366f1" }}>
                {skill}
                <button onClick={() => removeSkill(skill)} className="hover:text-destructive transition text-base leading-none">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 relative">
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addSkill()}
              placeholder="Type a skill and press Enter"
              className="flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none transition"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1px solid #e8d0f5",
                color: "#4a2d6a",
              }}
            />
            <button
              onClick={addSkill}
              className="px-4 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
            >
              Add
            </button>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl text-white font-semibold hover:opacity-90 transition disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}
        >
          {saving ? "Saving..." : "Save changes"}
        </button>

        {/* Settings */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }} />
          <h2 className="font-semibold flex items-center gap-2 relative"><FileText className="w-4 h-4" style={{ color: "#6366f1" }} /> Preferences</h2>
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">Switch between light and dark theme</p>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative w-12 h-6 rounded-full transition-colors duration-300 flex items-center px-1"
              style={{ backgroundColor: theme === "dark" ? "#6366f1" : undefined }}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${theme === "dark" ? "translate-x-6" : ""}`} />
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-card border rounded-2xl p-6 relative overflow-hidden" style={{ borderColor: "rgba(99, 102, 241, 0.3)" }}>
          <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }} />
          <h2 className="font-semibold mb-2 relative" style={{ color: "#6366f1" }}>Danger zone</h2>
          <p className="text-sm text-muted-foreground mb-4 relative">Once you sign out, you'll need your credentials to get back in.</p>
          <button
            onClick={() => { logout(); window.location.href = "/"; }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition relative"
            style={{ border: "1px solid rgba(99, 102, 241, 0.5)", color: "#6366f1" }}
          >
            <Trash2 className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
