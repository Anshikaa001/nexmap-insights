import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "reactflow";

export function layoutGraph(nodes: Node[], edges: Edge[], direction: "LR" | "TB" = "LR") {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 110 });
  const W = 220, H = 90;
  nodes.forEach((n) => g.setNode(n.id, { width: W, height: H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));
  dagre.layout(g);
  return {
    nodes: nodes.map((n) => {
      const p = g.node(n.id);
      return { ...n, position: { x: p.x - W / 2, y: p.y - H / 2 } };
    }),
    edges,
  };
}
