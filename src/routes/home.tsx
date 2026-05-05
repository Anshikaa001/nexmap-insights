import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, LayoutGrid, List, ChevronDown } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { CollectionCard } from "@/components/CollectionCard";
import { AddCollectionModal } from "@/components/AddCollectionModal";
import { useCollections } from "@/hooks/useStore";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Collections — NexMap" }] }),
  component: HomePage,
});

const tabs = ["All", "Personal", "Team", "Starred"] as const;

function HomePage() {
  const { collections, addCollection, toggleStar } = useCollections();
  const [tab, setTab] = useState<typeof tabs[number]>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [open, setOpen] = useState(false);

  const counts = useMemo(() => ({
    All: collections.length,
    Personal: collections.filter((c) => c.scope === "personal").length,
    Team: collections.filter((c) => c.scope === "team").length,
    Starred: collections.filter((c) => c.starred).length,
  }), [collections]);

  const filtered = useMemo(() => {
    if (tab === "All") return collections;
    if (tab === "Starred") return collections.filter((c) => c.starred);
    return collections.filter((c) => c.scope === tab.toLowerCase());
  }, [collections, tab]);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Your Collections</h1>
            <p className="text-sm text-muted-foreground mt-1">Group services, watch dependencies, catch failures fast.</p>
          </div>
          <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold glow-indigo hover:opacity-90">
            <Plus className="h-4 w-4" /> Add Collection
          </button>
        </div>

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-1 rounded-lg p-1 bg-secondary/50 border border-border">
            {tabs.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${tab === t ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>
                {t} <span className="ml-1 text-muted-foreground">{counts[t]}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-secondary/50 border border-border hover:bg-secondary">Sort: Recent <ChevronDown className="h-3 w-3" /></button>
            <div className="flex rounded-lg border border-border bg-secondary/50 p-0.5">
              <button onClick={() => setView("grid")} className={`p-1.5 rounded ${view === "grid" ? "bg-background" : ""}`}><LayoutGrid className="h-3.5 w-3.5" /></button>
              <button onClick={() => setView("list")} className={`p-1.5 rounded ${view === "list" ? "bg-background" : ""}`}><List className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>

        <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
          {filtered.map((c) => <CollectionCard key={c.id} collection={c} onStar={toggleStar} />)}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-20 text-muted-foreground text-sm">No collections in this view yet.</div>
          )}
        </div>
      </main>

      <AddCollectionModal open={open} onClose={() => setOpen(false)} onCreate={addCollection} />
    </div>
  );
}
