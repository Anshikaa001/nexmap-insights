import { AnimatePresence, motion } from "framer-motion";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { Collection } from "@/lib/mockData";

export function AddCollectionModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (c: Omit<Collection, "id" | "updatedAt">) => void }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [collabs, setCollabs] = useState<Collection["collaborators"]>([]);
  const [copied, setCopied] = useState(false);

  const addEmail = () => {
    if (!emailInput.trim()) return;
    setCollabs((p) => [...p, { email: emailInput.trim(), status: "Invited" }]);
    setEmailInput("");
  };

  const submit = () => {
    if (!name.trim()) return;
    onCreate({ name, description: desc, icon: "📦", scope: "personal", starred: false, collaborators: collabs });
    setName(""); setDesc(""); setCollabs([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.96, y: 8, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ type: "spring", damping: 24, stiffness: 280 }} className="w-full max-w-lg rounded-2xl glass-strong p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-xl font-bold">Create new collection</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Group services that share a domain or team.</p>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-4">
              <Field label="Collection Name">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Payments Platform" className="w-full bg-input/60 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/60 border border-border" />
              </Field>
              <Field label="Description">
                <textarea value={desc} onChange={(e) => setDesc(e.target.value.slice(0, 200))} rows={3} placeholder="What does this collection cover?" className="w-full bg-input/60 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/60 border border-border resize-none" />
                <div className="text-[10px] text-muted-foreground text-right mt-1">{desc.length}/200</div>
              </Field>
              <Field label="Add Collaborators">
                <div className="flex gap-2">
                  <input value={emailInput} onChange={(e) => setEmailInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addEmail()} placeholder="teammate@company.com" className="flex-1 bg-input/60 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/60 border border-border" />
                  <button onClick={addEmail} className="px-4 rounded-lg bg-secondary hover:bg-secondary/70 text-sm font-medium">Add</button>
                </div>
              </Field>

              {collabs.length > 0 && (
                <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-thin">
                  {collabs.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                      <div className="h-6 w-6 rounded-full bg-primary/30 grid place-items-center text-[10px] font-semibold">{c.email[0].toUpperCase()}</div>
                      <span className="text-sm flex-1 truncate">{c.email}</span>
                      <select value={c.status} onChange={(e) => setCollabs((p) => p.map((x, j) => j === i ? { ...x, status: e.target.value as "Joined" | "Invited" } : x))} className="text-xs bg-background rounded-md px-2 py-1 border border-border">
                        <option>Joined</option><option>Invited</option>
                      </select>
                      <button onClick={() => setCollabs((p) => p.filter((_, j) => j !== i))} className="p-1 hover:bg-background rounded"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-lg border border-dashed border-border p-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium">Invite Link</div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">nexmap.io/i/x9k2p4</div>
                </div>
                <button onClick={() => { navigator.clipboard?.writeText("https://nexmap.io/i/x9k2p4"); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/70">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy Link"}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={onClose} className="px-4 py-2 text-sm rounded-lg hover:bg-secondary">Cancel</button>
              <button onClick={submit} className="px-4 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground glow-indigo hover:opacity-90">Create Collection</button>
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
