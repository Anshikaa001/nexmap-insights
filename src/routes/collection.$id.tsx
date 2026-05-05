import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, Filter, Plus, Search, Boxes, Home, Star, Activity, Settings, ArrowLeft } from "lucide-react";
import { useCollections, useServices } from "@/hooks/useStore";
import { ServiceGraph } from "@/components/ServiceGraph";
import { RightPanel } from "@/components/RightPanel";
import { AddServiceModal } from "@/components/AddServiceModal";
import { StatusDot } from "@/components/StatusBadge";
import type { Service } from "@/lib/mockData";

export const Route = createFileRoute("/collection/$id")({
  head: ({ params }) => ({ meta: [{ title: `Collection — NexMap` }, { name: "description", content: `Service dependency graph for ${params.id}` }] }),
  component: CollectionPage,
});

function CollectionPage() {
  const { id } = Route.useParams();
  const { collections } = useCollections();
  const { services, addService } = useServices(id);
  const collection = collections.find((c) => c.id === id);
  const [selected, setSelected] = useState<Service | null>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const stats = useMemo(() => ({
    total: services.length,
    healthy: services.filter((s) => s.status === "healthy").length,
    degraded: services.filter((s) => s.status === "degraded").length,
    failed: services.filter((s) => s.status === "failed").length,
    avgLat: services.length ? Math.round(services.reduce((a, s) => a + s.latency, 0) / services.length) : 0,
  }), [services]);

  const filteredList = services.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Left mini sidebar */}
      <aside className="w-16 shrink-0 border-r border-border bg-sidebar/60 flex flex-col items-center py-5 gap-2">
        <Link to="/home" className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-[var(--indigo-glow)] grid place-items-center glow-indigo mb-3">
          <Boxes className="h-4 w-4 text-white" />
        </Link>
        {[Home, Star, Activity, Settings].map((Ic, i) => (
          <button key={i} className="h-9 w-9 rounded-lg grid place-items-center text-muted-foreground hover:bg-secondary hover:text-foreground transition"><Ic className="h-4 w-4" /></button>
        ))}
      </aside>

      {/* Service list sidebar */}
      <aside className="w-72 shrink-0 border-r border-border flex flex-col bg-sidebar/40">
        <div className="p-4 border-b border-border">
          <Link to="/home" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3"><ArrowLeft className="h-3 w-3" /> All collections</Link>
          <div className="flex items-center gap-2">
            <span className="text-xl">{collection?.icon ?? "📦"}</span>
            <div>
              <div className="font-display font-semibold">{collection?.name ?? "Collection"}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Production</div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 px-2 mb-2">Services</div>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services..." className="input pl-8 py-1.5 text-xs" />
          </div>
          <div className="space-y-0.5 overflow-y-auto scrollbar-thin max-h-[calc(100vh-220px)]">
            {filteredList.map((s) => (
              <button key={s.id} onClick={() => setSelected(s)} className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left text-sm transition ${selected?.id === s.id ? "bg-secondary" : "hover:bg-secondary/50"}`}>
                <StatusDot status={s.status} />
                <span className="truncate flex-1">{s.name}</span>
                <span className="text-[10px] text-muted-foreground tabular-nums">{s.latency}ms</span>
              </button>
            ))}
            {filteredList.length === 0 && <div className="text-xs text-muted-foreground px-2 py-4">No services. Click + Add Service.</div>}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center px-6 gap-4 bg-background/50 backdrop-blur-md">
          <button className="flex items-center gap-1.5 text-sm font-medium hover:bg-secondary px-2 py-1 rounded">
            {collection?.name ?? "Collection"} <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <div className="h-5 w-px bg-border" />
          <button className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-secondary/60 border border-border">
            <span className="h-1.5 w-1.5 rounded-full dot-healthy" /> Production <ChevronDown className="h-3 w-3" />
          </button>

          <div className="hidden md:flex items-center gap-5 ml-6 text-xs">
            <Stat label="Services" value={stats.total} />
            <Stat label="Healthy" value={stats.healthy} color="var(--healthy)" />
            <Stat label="Degraded" value={stats.degraded} color="var(--degraded)" />
            <Stat label="Failed" value={stats.failed} color="var(--failed)" />
            <Stat label="Avg Latency" value={`${stats.avgLat}ms`} />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-secondary"><Filter className="h-3 w-3" /> Filters</button>
            <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold glow-indigo hover:opacity-90"><Plus className="h-3.5 w-3.5" /> Add Service</button>
          </div>
        </header>

        <div className="flex-1 relative">
          {services.length > 0 ? (
            <ServiceGraph services={services} onSelect={setSelected} />
          ) : (
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-5xl mb-3">🕸️</div>
                <div className="font-display text-lg font-semibold mb-1">No services yet</div>
                <p className="text-sm text-muted-foreground mb-4">Add your first service to start mapping dependencies.</p>
                <button onClick={() => setOpen(true)} className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold glow-indigo">+ Add Service</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <RightPanel service={selected} onClose={() => setSelected(null)} />
      <AddServiceModal open={open} onClose={() => setOpen(false)} collectionId={id} existing={services} onCreate={addService} />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      {color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />}
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}
