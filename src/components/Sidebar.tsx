import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Star, Users, Activity, Plug, Bell, User, CreditCard, Sparkles, Boxes } from "lucide-react";
import { cn } from "@/lib/utils";

const main = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/home", label: "Starred", icon: Star },
  { to: "/home", label: "Teams", icon: Users },
  { to: "/home", label: "Activity", icon: Activity },
];
const settings = [
  { label: "Integrations", icon: Plug },
  { label: "Alerts", icon: Bell },
  { label: "Account", icon: User },
  { label: "Billing", icon: CreditCard },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar/60 backdrop-blur-xl px-4 py-6">
      <Link to="/home" className="flex items-center gap-2 px-2 mb-8">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-[var(--indigo-glow)] grid place-items-center glow-indigo">
          <Boxes className="h-4 w-4 text-white" />
        </div>
        <span className="font-display text-lg font-bold tracking-tight">NexMap</span>
      </Link>

      <nav className="space-y-1">
        {main.map((it, i) => {
          const active = i === 0 && path === "/home";
          return (
            <Link key={it.label} to={it.to} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition", active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50")}>
              <it.icon className="h-4 w-4" /> {it.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <div className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-2">Settings</div>
        <nav className="space-y-1">
          {settings.map((it) => (
            <button key={it.label} className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition">
              <it.icon className="h-4 w-4" /> {it.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto rounded-2xl p-4 glass">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-[var(--indigo-glow)]" />
          <span className="font-display font-semibold text-sm">Upgrade to Pro</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Unlimited services, real-time anomaly alerts and SSO.</p>
        <button className="w-full rounded-lg bg-primary text-primary-foreground text-xs font-semibold py-2 hover:opacity-90 transition glow-indigo">Upgrade</button>
      </div>
    </aside>
  );
}
