import { AnimatePresence, motion } from "framer-motion";
import { X, Search, Globe, Database, MessageSquare, Boxes, Webhook, Network, Plus } from "lucide-react";
import { useState } from "react";
import type { Service, ServiceType, Endpoint } from "@/lib/mockData";

const types: { id: ServiceType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "rest", label: "REST API", icon: Globe },
  { id: "graphql", label: "GraphQL API", icon: Network },
  { id: "grpc", label: "gRPC Service", icon: Boxes },
  { id: "database", label: "Database", icon: Database },
  { id: "queue", label: "Message Queue", icon: MessageSquare },
  { id: "external", label: "External API", icon: Webhook },
];

export function AddServiceModal({ open, onClose, onCreate, collectionId, existing }: {
  open: boolean; onClose: () => void; collectionId: string;
  existing: Service[];
  onCreate: (s: Omit<Service, "id" | "status" | "latency" | "failureRate" | "throughput" | "updatedAt">) => void;
}) {
  const [type, setType] = useState<ServiceType>("rest");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [env, setEnv] = useState("Production");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [deps, setDeps] = useState<string[]>([]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([{ id: "ep1", method: "GET", path: "/", avgLatency: 100, failureThreshold: 1 }]);
  const [search, setSearch] = useState("");

  const addTag = () => { if (tagInput.trim()) { setTags((p) => [...p, tagInput.trim()]); setTagInput(""); } };
  const addEp = () => setEndpoints((p) => [...p, { id: "ep" + Date.now(), method: "GET", path: "/", avgLatency: 100, failureThreshold: 1 }]);

  const submit = () => {
    if (!name.trim()) return;
    onCreate({ collectionId, name, type, baseUrl: url || "https://", environment: env, tags, dependencies: deps, endpoints, owner: "You" });
    setName(""); setUrl(""); setTags([]); setDeps([]); setEndpoints([{ id: "ep1", method: "GET", path: "/", avgLatency: 100, failureThreshold: 1 }]);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.96, y: 8, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ type: "spring", damping: 24, stiffness: 280 }} className="w-full max-w-2xl my-8 rounded-2xl glass-strong p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold">Add a service</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search service templates..." className="w-full bg-input/60 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/60 border border-border" />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {types.filter((t) => t.label.toLowerCase().includes(search.toLowerCase())).map((t) => (
                <button key={t.id} onClick={() => setType(t.id)} className={`flex items-center gap-3 rounded-xl p-3 text-left text-sm border transition ${type === t.id ? "border-primary bg-primary/10" : "border-border bg-secondary/30 hover:bg-secondary/60"}`}>
                  <div className="h-9 w-9 rounded-lg bg-background grid place-items-center"><t.icon className="h-4 w-4 text-primary" /></div>
                  <span className="font-medium">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Service Name"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="users-api" className="input" /></Field>
                <Field label="Environment">
                  <select value={env} onChange={(e) => setEnv(e.target.value)} className="input">
                    <option>Production</option><option>Staging</option><option>Development</option>
                  </select>
                </Field>
              </div>
              <Field label="Base URL"><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://api.example.com" className="input font-mono" /></Field>

              <Field label="Tags">
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {tags.map((t, i) => <span key={i} className="text-xs px-2 py-1 rounded-md bg-primary/15 text-primary flex items-center gap-1">{t}<button onClick={() => setTags((p) => p.filter((_, j) => j !== i))}><X className="h-3 w-3" /></button></span>)}
                </div>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="add tag..." className="input flex-1" />
                  <button onClick={addTag} className="px-3 rounded-lg bg-secondary text-sm">Add</button>
                </div>
              </Field>

              <Field label="Dependencies">
                <div className="flex flex-wrap gap-1.5">
                  {existing.map((s) => {
                    const on = deps.includes(s.id);
                    return <button key={s.id} onClick={() => setDeps((p) => on ? p.filter((x) => x !== s.id) : [...p, s.id])} className={`text-xs px-2.5 py-1 rounded-md border transition ${on ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>{s.name}</button>;
                  })}
                  {existing.length === 0 && <span className="text-xs text-muted-foreground">No services in this collection yet.</span>}
                </div>
              </Field>

              <Field label="Endpoints">
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold uppercase text-muted-foreground tracking-wider px-1">
                    <div className="col-span-2">Method</div><div className="col-span-5">Path</div><div className="col-span-3">Avg Latency</div><div className="col-span-2">Threshold</div>
                  </div>
                  {endpoints.map((ep, i) => (
                    <div key={ep.id} className="grid grid-cols-12 gap-2">
                      <select className="input col-span-2" value={ep.method} onChange={(e) => setEndpoints((p) => p.map((x, j) => j === i ? { ...x, method: e.target.value as Endpoint["method"] } : x))}>
                        <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option><option>PATCH</option>
                      </select>
                      <input className="input col-span-5 font-mono" value={ep.path} onChange={(e) => setEndpoints((p) => p.map((x, j) => j === i ? { ...x, path: e.target.value } : x))} />
                      <input className="input col-span-3 tabular-nums" type="number" value={ep.avgLatency} onChange={(e) => setEndpoints((p) => p.map((x, j) => j === i ? { ...x, avgLatency: +e.target.value } : x))} />
                      <input className="input col-span-2 tabular-nums" type="number" value={ep.failureThreshold} onChange={(e) => setEndpoints((p) => p.map((x, j) => j === i ? { ...x, failureThreshold: +e.target.value } : x))} />
                    </div>
                  ))}
                  <button onClick={addEp} className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"><Plus className="h-3 w-3" /> Add Endpoint</button>
                </div>
              </Field>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg hover:bg-secondary">Cancel</button>
              <button onClick={submit} className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground glow-indigo hover:opacity-90">Add Service</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}
