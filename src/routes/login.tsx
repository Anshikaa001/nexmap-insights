import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Boxes, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — NexMap" }, { name: "description", content: "Map your APIs. Catch failures before your users do." }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("nexmap.auth", "1");
    navigate({ to: "/home" });
  };
  return (
    <div className="min-h-screen relative overflow-hidden grid place-items-center px-4 noise-bg">
      <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-[var(--indigo-glow)] grid place-items-center glow-indigo">
          <Boxes className="h-4 w-4 text-white" />
        </div>
        <span className="font-display text-lg font-bold">NexMap</span>
      </div>

      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl glass-strong p-8 relative z-10 shadow-2xl">
        <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to map your service mesh.</p>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="you@company.com" className="input mt-1" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Password</label>
            <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" required placeholder="••••••••" className="input mt-1" />
          </div>
        </div>

        <button type="submit" className="w-full mt-6 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-semibold flex items-center justify-center gap-2 glow-indigo hover:opacity-90 transition">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-xs text-muted-foreground text-center mt-5">No account? <span className="text-primary hover:underline cursor-pointer">Start free trial</span></p>
      </form>
    </div>
  );
}
