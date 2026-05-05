import { AnimatePresence, motion } from "framer-motion";
import { X, ExternalLink } from "lucide-react";
import { useState } from "react";
import type { Service } from "@/lib/mockData";
import { recentErrors, sparkData } from "@/lib/mockData";
import { StatusBadge } from "./StatusBadge";
import { SparklineChart } from "./SparklineChart";

const tabs = ["Overview", "Endpoints", "Dependencies", "Metrics"] as const;

export function RightPanel({ service, onClose }: { service: Service | null; onClose: () => void }) {
  const [tab, setTab] = useState<typeof tabs[number]>("Overview");
  return (
    <AnimatePresence>
      {service && (
        <motion.aside initial={{ x: 480, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 480, opacity: 0 }} transition={{ type: "spring", damping: 28, stiffness: 260 }}
          className="fixed right-0 top-0 h-screen w-full max-w-[460px] z-40 glass-strong border-l border-border flex flex-col">
          <div className="p-5 border-b border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{service.type}</div>
                <h2 className="font-display text-xl font-bold">{service.name}</h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>
            <StatusBadge status={service.status} />
            <div className="flex gap-1 mt-4 border-b border-border -mb-5">
              {tabs.map((t) => (
                <button key={t} onClick={() => setTab(t)} className={`px-3 py-2 text-xs font-medium relative ${tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {t}
                  {tab === t && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
            {tab === "Overview" && (
              <>
                <Meta label="Base URL" value={service.baseUrl} mono />
                <div className="grid grid-cols-2 gap-3">
                  <Meta label="Owner" value={service.owner ?? "—"} />
                  <Meta label="Environment" value={service.environment} />
                </div>
                <Meta label="Last Updated" value={service.updatedAt} />

                <div className="pt-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Health</div>
                  <div className="grid grid-cols-3 gap-3">
                    <Metric label="Failure Rate" value={`${service.failureRate}%`} color="var(--failed)" />
                    <Metric label="Avg Latency" value={`${service.latency}ms`} color="var(--primary)" />
                    <Metric label="Throughput" value={`${service.throughput}/m`} color="var(--healthy)" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent Errors</div>
                    <button className="text-xs text-primary hover:underline flex items-center gap-1">View all logs <ExternalLink className="h-3 w-3" /></button>
                  </div>
                  <div className="space-y-2">
                    {recentErrors.map((e, i) => (
                      <div key={i} className="rounded-lg bg-secondary/40 p-3 text-xs flex items-start gap-3">
                        <span className="font-mono text-muted-foreground shrink-0">{e.time}</span>
                        <span className="px-1.5 py-0.5 rounded bg-[color-mix(in_oklch,var(--failed)_20%,transparent)] text-[var(--failed)] font-mono shrink-0">{e.code}</span>
                        <span className="text-foreground/80">{e.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {tab === "Endpoints" && (
              <div className="space-y-2">
                {service.endpoints.length === 0 && <div className="text-sm text-muted-foreground">No endpoints defined.</div>}
                {service.endpoints.map((e) => (
                  <div key={e.id} className="rounded-lg bg-secondary/40 p-3 flex items-center gap-3">
                    <span className="text-[10px] font-bold font-mono px-2 py-1 rounded bg-primary/20 text-primary">{e.method}</span>
                    <span className="font-mono text-xs flex-1 truncate">{e.path}</span>
                    <span className="text-xs text-muted-foreground tabular-nums">{e.avgLatency}ms</span>
                  </div>
                ))}
              </div>
            )}
            {tab === "Dependencies" && (
              <div className="space-y-2">
                {service.dependencies.length === 0 && <div className="text-sm text-muted-foreground">No dependencies.</div>}
                {service.dependencies.map((d) => (
                  <div key={d} className="rounded-lg bg-secondary/40 p-3 text-sm font-mono">{d}</div>
                ))}
              </div>
            )}
            {tab === "Metrics" && (
              <div className="space-y-4">
                <Metric label="Failure Rate (last hour)" value={`${service.failureRate}%`} color="var(--failed)" tall />
                <Metric label="Latency (ms)" value={`${service.latency}`} color="var(--primary)" tall />
                <Metric label="Throughput (req/min)" value={`${service.throughput}`} color="var(--healthy)" tall />
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className={`text-sm ${mono ? "font-mono text-foreground/90" : ""}`}>{value}</div>
    </div>
  );
}
function Metric({ label, value, color, tall }: { label: string; value: string; color: string; tall?: boolean }) {
  return (
    <div className="rounded-xl bg-secondary/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-lg font-bold tabular-nums my-1">{value}</div>
      <div className={tall ? "h-20" : "h-10"}><SparklineChart data={sparkData()} color={color} /></div>
    </div>
  );
}
