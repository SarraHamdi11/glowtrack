import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: "purple" | "pink" | "blue" | "green" | "orange";
  gradient?: string;
}

const configs = {
  purple: { grad: "from-violet-500 to-purple-600", glow: "shadow-violet-500/30", bg: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/20", ring: "ring-violet-200 dark:ring-violet-800/40" },
  pink:   { grad: "from-pink-500 to-rose-500",     glow: "shadow-pink-500/30",   bg: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/20",         ring: "ring-pink-200 dark:ring-pink-800/40" },
  blue:   { grad: "from-blue-500 to-cyan-500",     glow: "shadow-blue-500/30",   bg: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20",         ring: "ring-blue-200 dark:ring-blue-800/40" },
  green:  { grad: "from-emerald-500 to-teal-500",  glow: "shadow-emerald-500/30",bg: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",   ring: "ring-emerald-200 dark:ring-emerald-800/40" },
  orange: { grad: "from-orange-400 to-amber-500",  glow: "shadow-orange-500/30", bg: "from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20",   ring: "ring-orange-200 dark:ring-orange-800/40" },
};

export default function DashboardCard({ title, value, subtitle, icon: Icon, color, gradient }: DashboardCardProps) {
  const c = configs[color];
  const customGradient = gradient || c.grad;
  return (
    <div className={`relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br ${c.bg} ring-1 ${c.ring} hover:shadow-xl ${c.glow} transition-all duration-300 hover:-translate-y-0.5`}>
      {/* BG orb */}
      {gradient ? (
        <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 blur-xl" style={{ background: gradient }} />
      ) : (
        <div className={`pointer-events-none absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${c.grad} opacity-10 blur-xl`} />
      )}

      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-extrabold text-foreground leading-none">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>}
        </div>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0" style={{ background: customGradient }}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );
}
