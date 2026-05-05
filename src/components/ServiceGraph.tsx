import { useMemo, useCallback } from "react";
import ReactFlow, { Background, Controls, MiniMap, Handle, Position, type Node, type Edge, type NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { layoutGraph } from "@/lib/graphLayout";
import type { Service, ServiceStatus } from "@/lib/mockData";

const colorMap: Record<ServiceStatus, string> = {
  healthy: "var(--healthy)",
  degraded: "var(--degraded)",
  failed: "var(--failed)",
};

function ServiceNode({ data }: NodeProps<{ name: string; latency: number; status: ServiceStatus; type: string }>) {
  const c = colorMap[data.status];
  return (
    <div className="rounded-xl px-4 py-3 min-w-[200px] backdrop-blur-md"
      style={{
        background: "color-mix(in oklch, var(--surface) 92%, transparent)",
        border: `1.5px solid ${c}`,
        boxShadow: `0 0 24px -6px color-mix(in oklch, ${c} 60%, transparent), 0 4px 16px rgba(0,0,0,0.4)`,
      }}>
      <Handle type="target" position={Position.Left} style={{ background: c, border: "none", width: 8, height: 8 }} />
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{data.type}</div>
          <div className="font-display font-semibold text-sm">{data.name}</div>
        </div>
        <div className="text-right">
          <div className="h-2 w-2 rounded-full ml-auto mb-1" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
          <div className="text-[11px] tabular-nums text-muted-foreground">{data.latency}ms</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: c, border: "none", width: 8, height: 8 }} />
    </div>
  );
}

const nodeTypes = { service: ServiceNode };

export function ServiceGraph({ services, onSelect }: { services: Service[]; onSelect: (s: Service) => void }) {
  const { nodes, edges } = useMemo(() => {
    const ns: Node[] = services.map((s) => ({
      id: s.id, type: "service", position: { x: 0, y: 0 },
      data: { name: s.name, latency: s.latency, status: s.status, type: s.type },
    }));
    const es: Edge[] = [];
    services.forEach((s) => s.dependencies.forEach((dep, i) => {
      const dashed = i > 0;
      es.push({
        id: `${s.id}-${dep}`, source: s.id, target: dep, animated: s.status !== "healthy",
        style: { stroke: colorMap[s.status], strokeWidth: 1.5, strokeDasharray: dashed ? "5 5" : undefined },
      });
    }));
    return layoutGraph(ns, es, "LR");
  }, [services]);

  const onNodeClick = useCallback((_: unknown, node: Node) => {
    const svc = services.find((s) => s.id === node.id);
    if (svc) onSelect(svc);
  }, [services, onSelect]);

  return (
    <div className="h-full w-full">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodeClick={onNodeClick} fitView proOptions={{ hideAttribution: true }} minZoom={0.3}>
        <Background gap={28} size={1} color="oklch(0.3 0.02 270)" />
        <MiniMap pannable zoomable maskColor="rgba(10,10,15,0.7)" style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }} nodeColor={(n) => colorMap[(n.data as { status: ServiceStatus }).status]} />
        <Controls className="!bg-[var(--surface)] !border-border !rounded-lg [&>button]:!bg-transparent [&>button]:!border-border [&>button]:!text-foreground" />
      </ReactFlow>
    </div>
  );
}
