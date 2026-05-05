import { Link } from "@tanstack/react-router";
import { Star, MoreHorizontal } from "lucide-react";
import type { Collection } from "@/lib/mockData";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

export function CollectionCard({ collection, onStar }: { collection: Collection; onStar: (id: string) => void }) {
  // derive a deterministic-ish status from id length
  const status = collection.id.length % 3 === 0 ? "healthy" : collection.id.length % 3 === 1 ? "degraded" : "failed";
  return (
    <Link to="/collection/$id" params={{ id: collection.id }} className="group block rounded-2xl glass p-5 hover:border-[color-mix(in_oklch,var(--primary)_40%,transparent)] transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between mb-4">
        <div className="h-11 w-11 rounded-xl bg-secondary grid place-items-center text-xl">{collection.icon}</div>
        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100">
          <button onClick={(e) => { e.preventDefault(); onStar(collection.id); }} className="p-1.5 rounded-md hover:bg-secondary">
            <Star className={cn("h-4 w-4", collection.starred ? "fill-[var(--degraded)] text-[var(--degraded)]" : "text-muted-foreground")} />
          </button>
          <button onClick={(e) => e.preventDefault()} className="p-1.5 rounded-md hover:bg-secondary"><MoreHorizontal className="h-4 w-4 text-muted-foreground" /></button>
        </div>
      </div>
      <div className="font-display text-lg font-semibold mb-1">{collection.name}</div>
      <div className="mb-4"><StatusBadge status={status} /></div>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-5">{collection.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {(collection.collaborators.length ? collection.collaborators : [{ email: "you@nexmap.io", status: "Joined" as const }]).slice(0, 4).map((c, i) => (
            <div key={i} className="h-7 w-7 rounded-full ring-2 ring-card grid place-items-center text-[10px] font-semibold" style={{ background: `oklch(0.5 0.15 ${(i * 60) + 200})` }}>
              {c.email[0].toUpperCase()}
            </div>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">Updated {collection.updatedAt}</span>
      </div>
    </Link>
  );
}
