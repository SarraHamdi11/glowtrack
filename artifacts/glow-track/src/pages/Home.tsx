import { Link } from "wouter";
import { motion } from "framer-motion";
import { Sparkles, Briefcase, CheckSquare, BarChart2, Activity, Star, ArrowRight, Moon, Sun, Zap } from "lucide-react";
import { useTheme } from "next-themes";

const features = [
  { icon: Briefcase,   title: "Job Tracker",   desc: "Track every application with status, salary, and notes. Never lose an opportunity.", grad: "from-violet-500 to-purple-600", glow: "shadow-violet-500/25", bg: "bg-violet-50 dark:bg-violet-950/30" },
  { icon: CheckSquare, title: "Task Manager",  desc: "Prioritise your work with Low, Medium, and High priority tasks and due dates.", grad: "from-pink-500 to-rose-500",    glow: "shadow-pink-500/25",   bg: "bg-pink-50 dark:bg-pink-950/30" },
  { icon: Activity,    title: "Habit Tracker", desc: "Build powerful habits with streak tracking and daily completion monitoring.", grad: "from-blue-500 to-cyan-500",    glow: "shadow-blue-500/25",   bg: "bg-blue-50 dark:bg-blue-950/30" },
  { icon: BarChart2,   title: "Analytics",     desc: "Visualise your productivity with beautiful charts and meaningful insights.", grad: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/25",bg: "bg-emerald-50 dark:bg-emerald-950/30" },
];

const steps = [
  { n: "01", title: "Create your account", desc: "Sign up in seconds — no credit card required.", grad: "from-violet-500 to-purple-600" },
  { n: "02", title: "Add your first job",  desc: "Log your applications and track their progress.", grad: "from-pink-500 to-rose-500" },
  { n: "03", title: "Watch yourself grow", desc: "Use analytics to improve your job-hunt strategy.", grad: "from-blue-500 to-cyan-500" },
];

const testimonials = [
  { name: "Sarah K.",  role: "Junior Developer",   quote: "GlowTrack helped me land my first dev job! The job tracker kept me organised during 3 months of applications.", avatar: "SK", grad: "from-violet-400 to-purple-600" },
  { name: "Marcus L.", role: "CS Graduate",         quote: "I went from chaos to clarity. Tracking my habits alongside job apps changed everything for me.", avatar: "ML", grad: "from-pink-400 to-rose-600" },
  { name: "Priya M.",  role: "Bootcamp Graduate",   quote: "The analytics dashboard showed me exactly when I was most productive. Game changer.", avatar: "PM", grad: "from-blue-400 to-cyan-600" },
];

const plans = [
  { name: "Free",  price: "£0",  period: "forever", features: ["50 job applications", "10 habits", "Basic analytics", "Task manager"],                                              cta: "Get started",    primary: false },
  { name: "Pro",   price: "£9",  period: "/ month",  features: ["Unlimited applications", "Unlimited habits", "Advanced analytics", "CV upload", "Priority support"],               cta: "Start free trial", primary: true },
  { name: "Team",  price: "£29", period: "/ month",  features: ["Everything in Pro", "5 team members", "Shared dashboards", "Admin controls", "Dedicated support"],                 cta: "Contact sales",  primary: false },
];

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.3)" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GlowTrack</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how"      className="hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing"  className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-xl hover:bg-muted transition-colors">Log in</Link>
            <Link href="/register" className="text-sm font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] transition-all">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center overflow-hidden">
        {/* Floating blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-400/30 to-purple-600/20 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -top-20 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-400/25 to-rose-500/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="pointer-events-none absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-gradient-to-r from-violet-500/10 to-pink-500/10 blur-3xl" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500/15 to-pink-500/15 border border-violet-500/20 text-violet-600 dark:text-violet-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur">
            <Zap className="w-3.5 h-3.5" /> Built for junior developers
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Track jobs.<br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Build habits.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            GlowTrack is the all-in-one productivity platform for developers on the job hunt — track applications, crush tasks, build habits, and visualise your growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-sm shadow-2xl shadow-violet-500/40 hover:shadow-violet-500/60 hover:scale-[1.03] transition-all duration-200">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-violet-200 dark:border-violet-800 bg-white/50 dark:bg-white/5 backdrop-blur text-sm font-semibold hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-all duration-200">
              Sign in
            </Link>
          </div>
        </motion.div>

        {/* Dashboard mockup */}
        <motion.div initial={{ opacity: 0, y: 50, rotateX: 10 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.35, duration: 0.8 }} className="mt-20 perspective-1000">
          <div className="relative rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(139,92,246,0.25)] border border-violet-200/50 dark:border-violet-800/50 bg-card">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-950/50 dark:to-pink-950/50 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted-foreground font-medium">GlowTrack — Dashboard</span>
            </div>
            {/* Mock content */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[["24", "Applications", "from-violet-500 to-purple-600"], ["6", "Interviews", "from-pink-500 to-rose-500"], ["18", "Tasks Done", "from-blue-500 to-cyan-500"], ["12🔥", "Day Streak", "from-orange-400 to-amber-500"]].map(([v, l, g]) => (
                  <div key={l} className={`rounded-2xl p-4 bg-gradient-to-br ${g} text-white`}>
                    <p className="text-2xl font-extrabold">{v}</p>
                    <p className="text-xs text-white/70 mt-1">{l}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-muted/40 p-4 h-28 flex items-end gap-1.5 overflow-hidden">
                {[20, 45, 30, 65, 55, 80, 50, 90, 70, 95, 60, 85].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-violet-600 to-pink-400 opacity-80 transition-all" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
          {/* Glow under card */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-gradient-to-r from-violet-500/30 to-pink-500/30 blur-2xl" />
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-violet-50/50 to-transparent dark:via-violet-950/20" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-3">Everything you need</h2>
            <p className="text-muted-foreground text-lg">One dashboard to rule your entire job hunt</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`group relative ${f.bg} border border-white/60 dark:border-white/10 rounded-3xl p-6 hover:shadow-2xl ${f.glow} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center mb-5 shadow-lg ${f.glow}`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-3">How it works</h2>
            <p className="text-muted-foreground text-lg">Up and running in under 2 minutes</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            <div className="hidden sm:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-violet-300 to-pink-300 dark:from-violet-700 dark:to-pink-700" />
            {steps.map((s, i) => (
              <motion.div key={s.n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="text-center relative">
                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${s.grad} flex items-center justify-center mx-auto mb-5 shadow-xl text-white text-2xl font-extrabold shadow-violet-500/20`}>
                  {s.n}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/40 to-transparent dark:via-pink-950/15" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-3">Loved by developers</h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card/80 backdrop-blur border border-white/60 dark:border-white/10 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex text-amber-400 mb-4 gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${t.grad} flex items-center justify-center text-white text-xs font-extrabold shadow-lg`}>{t.avatar}</div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-extrabold mb-3">Simple, honest pricing</h2>
            <p className="text-muted-foreground text-lg">Start free, upgrade when you're ready</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6 items-center">
            {plans.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-3xl p-7 border transition-all duration-300 ${p.primary
                  ? "bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 text-white border-transparent shadow-[0_20px_60px_rgba(139,92,246,0.4)] scale-105"
                  : "bg-card border-border hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
                }`}>
                {p.primary && <div className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4"><Zap className="w-3 h-3" /> Most popular</div>}
                <h3 className={`font-extrabold text-xl mb-1 ${p.primary ? "text-white" : ""}`}>{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-4xl font-extrabold">{p.price}</span>
                  <span className={`text-sm ${p.primary ? "text-white/70" : "text-muted-foreground"}`}>{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-7">
                  {p.features.map(f => (
                    <li key={f} className={`flex items-center gap-2.5 text-sm ${p.primary ? "text-white/90" : "text-muted-foreground"}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${p.primary ? "bg-white/20 text-white" : "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-3 rounded-2xl font-bold text-sm transition-all ${p.primary
                  ? "bg-white text-violet-600 hover:bg-white/90 shadow-lg"
                  : "bg-gradient-to-r from-violet-600 to-pink-500 text-white hover:shadow-lg hover:shadow-violet-500/30"}`}>
                  {p.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl p-12 text-center text-white shadow-[0_30px_80px_rgba(99,102,241,0.4)]" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl" style={{ background: "rgba(99, 102, 241, 0.2)" }} />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative">
            <h2 className="text-4xl font-extrabold mb-4">Ready to glow up your career?</h2>
            <p className="text-white/80 text-lg mb-8">Join developers who are landing jobs faster with GlowTrack.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white font-bold hover:bg-white/90 shadow-xl transition-all hover:scale-[1.03]" style={{ color: "#6366f1" }}>
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center shadow-md" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)" }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GlowTrack</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 GlowTrack. Built for junior developers. ✨</p>
        </div>
      </footer>
    </div>
  );
}
