export type ServiceStatus = "healthy" | "degraded" | "failed";
export type ServiceType = "rest" | "graphql" | "grpc" | "database" | "queue" | "external";

export interface Endpoint {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  avgLatency: number;
  failureThreshold: number;
}

export interface Service {
  id: string;
  collectionId: string;
  name: string;
  type: ServiceType;
  baseUrl: string;
  environment: string;
  tags: string[];
  dependencies: string[];
  endpoints: Endpoint[];
  owner?: string;
  status: ServiceStatus;
  latency: number;
  failureRate: number;
  throughput: number;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  scope: "personal" | "team";
  starred: boolean;
  collaborators: { email: string; status: "Joined" | "Invited" }[];
  updatedAt: string;
}

const STATUSES: ServiceStatus[] = ["healthy", "healthy", "healthy", "degraded", "failed"];
export const randStatus = (): ServiceStatus => STATUSES[Math.floor(Math.random() * STATUSES.length)];

export const seedCollections: Collection[] = [
  { id: "c1", name: "Payments Platform", description: "Core checkout, billing & invoicing services", icon: "💳", scope: "team", starred: true, collaborators: [{ email: "ana@nexmap.io", status: "Joined" }, { email: "ravi@nexmap.io", status: "Joined" }, { email: "kim@nexmap.io", status: "Invited" }], updatedAt: "2h ago" },
  { id: "c2", name: "Identity & Auth", description: "OAuth, sessions, and SSO providers", icon: "🔐", scope: "team", starred: false, collaborators: [{ email: "leo@nexmap.io", status: "Joined" }], updatedAt: "5h ago" },
  { id: "c3", name: "Personal Sandbox", description: "Experiments and prototypes", icon: "🧪", scope: "personal", starred: true, collaborators: [], updatedAt: "1d ago" },
];

export const seedServices: Service[] = [
  { id: "s1", collectionId: "c1", name: "checkout-api", type: "rest", baseUrl: "https://api.nexmap.io/checkout", environment: "Production", tags: ["core", "edge"], dependencies: ["s2", "s3"], endpoints: [{ id: "e1", method: "POST", path: "/v1/charge", avgLatency: 120, failureThreshold: 2 }, { id: "e2", method: "GET", path: "/v1/orders/:id", avgLatency: 60, failureThreshold: 1 }], owner: "Payments Team", status: "healthy", latency: 124, failureRate: 0.4, throughput: 1240, updatedAt: "2m ago" },
  { id: "s2", collectionId: "c1", name: "billing-service", type: "grpc", baseUrl: "grpc://billing.internal", environment: "Production", tags: ["internal"], dependencies: ["s4"], endpoints: [{ id: "e3", method: "POST", path: "/Billing/Charge", avgLatency: 80, failureThreshold: 1 }], owner: "Payments Team", status: "degraded", latency: 312, failureRate: 3.1, throughput: 820, updatedAt: "1m ago" },
  { id: "s3", collectionId: "c1", name: "fraud-engine", type: "rest", baseUrl: "https://fraud.nexmap.io", environment: "Production", tags: ["ml"], dependencies: ["s4"], endpoints: [{ id: "e4", method: "POST", path: "/score", avgLatency: 200, failureThreshold: 2 }], owner: "Risk Team", status: "healthy", latency: 188, failureRate: 0.7, throughput: 540, updatedAt: "4m ago" },
  { id: "s4", collectionId: "c1", name: "ledger-db", type: "database", baseUrl: "postgres://ledger", environment: "Production", tags: ["postgres"], dependencies: [], endpoints: [], owner: "Infra", status: "healthy", latency: 14, failureRate: 0.1, throughput: 4200, updatedAt: "30s ago" },
  { id: "s5", collectionId: "c1", name: "stripe-webhook", type: "external", baseUrl: "https://api.stripe.com", environment: "Production", tags: ["3rd-party"], dependencies: ["s1"], endpoints: [{ id: "e5", method: "POST", path: "/webhook", avgLatency: 420, failureThreshold: 5 }], owner: "Payments Team", status: "failed", latency: 980, failureRate: 12.4, throughput: 60, updatedAt: "just now" },
];

export const sparkData = (n = 16) => Array.from({ length: n }, (_, i) => ({ x: i, y: Math.round(20 + Math.random() * 80) }));

export const recentErrors = [
  { time: "12:42:08", code: 503, msg: "Upstream timeout from billing-service" },
  { time: "12:41:33", code: 500, msg: "Unhandled exception in /v1/charge" },
  { time: "12:38:11", code: 429, msg: "Rate limit exceeded on stripe-webhook" },
  { time: "12:31:02", code: 504, msg: "Gateway timeout — fraud-engine" },
];
