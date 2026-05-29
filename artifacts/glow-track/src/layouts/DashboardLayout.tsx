import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import {
  LayoutDashboard, Briefcase, CheckSquare, Activity,
  BarChart2, User, LogOut, Menu, X, Sun, Moon, Sparkles
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", grad: "from-violet-500 to-purple-600" },
  { icon: Briefcase,       label: "Jobs",      href: "/jobs",      grad: "from-blue-500 to-indigo-600" },
  { icon: CheckSquare,     label: "Tasks",     href: "/tasks",     grad: "from-emerald-500 to-teal-600" },
  { icon: Activity,        label: "Habits",    href: "/habits",    grad: "from-orange-500 to-amber-500" },
  { icon: BarChart2,       label: "Analytics", href: "/analytics", grad: "from-pink-500 to-rose-500" },
  { icon: User,            label: "Profile",   href: "/profile",   grad: "from-purple-500 to-violet-600" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [, navigate] = useLocation();

  function handleLogout() { logout(); navigate("/"); }

  return (
    <div className="min-h-screen flex bg-background">
      {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden" onClick={() => setOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        bg-sidebar/95 backdrop-blur-xl border-r border-white/10 dark:border-white/5
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-bl from-violet-400/20 to-transparent blur-2xl" />
        <div className="pointer-events-none absolute bottom-20 left-0 w-32 h-32 rounded-full bg-gradient-to-tr from-pink-400/15 to-transparent blur-2xl" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/10 dark:border-white/5">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.3)" }}>
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-extrabold text-lg" style={{ background: "linear-gradient(135deg, #6366f1, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GlowTrack</span>
          <button className="ml-auto lg:hidden" onClick={() => setOpen(false)}>
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto relative">
          {navItems.map(({ icon: Icon, label, href, grad }) => {
            const active = location === href;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer group
                  ${active ? "text-white shadow-lg" : "text-sidebar-foreground hover:bg-white/10 dark:hover:bg-white/5 hover:text-foreground"}`}
                style={active ? { background: `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))` } : undefined}>
                {active ? (
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/10 dark:bg-white/5 group-hover:bg-white/15 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                )}
                {label}
                {active && <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-white/70`} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10 dark:border-white/5 space-y-1 relative">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-sidebar-foreground hover:bg-white/10 dark:hover:bg-white/5 transition-all">
            <div className="w-8 h-8 rounded-xl bg-white/10 dark:bg-white/5 flex items-center justify-center">
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </div>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all">
            <div className="w-8 h-8 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            Sign out
          </button>
          {/* User pill */}
          <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-2xl bg-white/10 dark:bg-white/5">
            {user?.avatar
              ? <img src={user.avatar} className="w-8 h-8 rounded-xl object-cover" alt="" />
              : <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-extrabold shadow-md">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
            }
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors" onClick={() => setOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hey, <span className="font-bold text-foreground">{user?.name?.split(" ")[0]}</span> 👋
            </span>
            {user?.avatar
              ? <img src={user.avatar} className="w-8 h-8 rounded-xl object-cover" alt="" />
              : <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-extrabold shadow-md">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
            }
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 bg-gradient-to-br from-background via-background to-violet-50/30 dark:to-violet-950/10">
          {children}
        </main>
      </div>
    </div>
  );
}
