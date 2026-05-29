import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";

const perks = ["Free forever plan", "No credit card needed", "Cancel anytime", "Full feature access"];

export default function Register() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const [, navigate] = useLocation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Please fill in all fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      login(data.token, data.user);
      toast.success(`Welcome to GlowTrack, ${data.user.name}! ✨`);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-violet-100 to-transparent dark:from-violet-950/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tl from-pink-100 to-transparent dark:from-pink-950/20 blur-3xl" />

        <div className="w-full max-w-md relative">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.3)" }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-lg" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GlowTrack</span>
            </Link>
            <h1 className="text-3xl font-extrabold mt-6">Create your account ✨</h1>
            <p className="text-muted-foreground mt-2">Start tracking your career journey today</p>
          </div>

          <div className="bg-card/80 backdrop-blur border border-white/60 dark:border-white/10 rounded-3xl shadow-2xl shadow-violet-500/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Full name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-background/80 text-sm focus:outline-none focus:border-violet-400 transition-colors placeholder:text-muted-foreground/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-background/80 text-sm focus:outline-none focus:border-violet-400 transition-colors placeholder:text-muted-foreground/50" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Password</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-border bg-background/80 text-sm focus:outline-none focus:border-violet-400 transition-colors pr-12 placeholder:text-muted-foreground/50" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-sm shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.01] active:scale-[.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                {loading ? "Creating account…" : <><span>Get started free</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-5">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right — decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-violet-600 items-center justify-center">
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full bg-violet-300/20 blur-3xl" />

        <div className="relative text-white text-center px-12">
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="text-4xl font-extrabold mb-4 leading-tight">Land your<br />dream job faster</h2>
          <p className="text-white/75 text-lg leading-relaxed mb-10">Everything you need to stay organised, motivated, and on track during your job search.</p>

          <div className="flex flex-col gap-3 text-left">
            {perks.map(p => (
              <div key={p} className="flex items-center gap-3 bg-white/15 backdrop-blur rounded-2xl px-4 py-3 text-sm font-semibold">
                <CheckCircle className="w-5 h-5 text-green-300 shrink-0" /> {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
