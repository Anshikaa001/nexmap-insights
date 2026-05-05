import type { ServiceStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const map: Record<ServiceStatus, { label: string; dot: string; text: string; bg: string }> = {
  healthy: { label: "Healthy", dot: "dot-healthy", text: "text-[var(--healthy)]", bg: "bg-[color-mix(in_oklch,var(--healthy)_15%,transparent)]" },
  degraded: { label: "Degraded", dot: "dot-degraded", text: "text-[var(--degraded)]", bg: "bg-[color-mix(in_oklch,var(--degraded)_15%,transparent)]" },
  failed: { label: "Issues Detected", dot: "dot-failed", text: "text-[var(--failed)]", bg: "bg-[color-mix(in_oklch,var(--failed)_15%,transparent)]" },
};

export function StatusBadge({ status, className, compact }: { status: ServiceStatus; className?: string; compact?: boolean }) {
  const m = map[status];
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium", m.bg, m.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {compact ? (status === "failed" ? "Failed" : m.label) : m.label}
    </span>
  );
}

export function StatusDot({ status, className }: { status: ServiceStatus; className?: string }) {
  return <span className={cn("h-2 w-2 rounded-full inline-block", `dot-${status}`, className)} />;
}
