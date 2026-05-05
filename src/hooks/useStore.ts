import { useEffect, useState, useCallback } from "react";
import { seedCollections, seedServices, randStatus, type Collection, type Service } from "@/lib/mockData";

const CKEY = "nexmap.collections.v1";
const SKEY = "nexmap.services.v1";

function load<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>(seedCollections);
  useEffect(() => { setCollections(load(CKEY, seedCollections)); }, []);
  useEffect(() => { localStorage.setItem(CKEY, JSON.stringify(collections)); }, [collections]);

  const addCollection = useCallback((c: Omit<Collection, "id" | "updatedAt">) => {
    const newC: Collection = { ...c, id: "c" + Date.now(), updatedAt: "just now" };
    setCollections((p) => [newC, ...p]);
    return newC;
  }, []);
  const toggleStar = useCallback((id: string) => setCollections((p) => p.map((c) => c.id === id ? { ...c, starred: !c.starred } : c)), []);
  return { collections, addCollection, toggleStar };
}

export function useServices(collectionId?: string) {
  const [services, setServices] = useState<Service[]>(seedServices);
  useEffect(() => {
    const loaded = load(SKEY, seedServices).map((s: Service) => ({ ...s, status: randStatus() }));
    setServices(loaded);
  }, []);
  useEffect(() => { localStorage.setItem(SKEY, JSON.stringify(services)); }, [services]);

  const addService = useCallback((s: Omit<Service, "id" | "status" | "latency" | "failureRate" | "throughput" | "updatedAt">) => {
    const newS: Service = { ...s, id: "s" + Date.now(), status: randStatus(), latency: 60 + Math.round(Math.random() * 300), failureRate: +(Math.random() * 5).toFixed(1), throughput: 100 + Math.round(Math.random() * 2000), updatedAt: "just now" };
    setServices((p) => [...p, newS]);
    return newS;
  }, []);

  const filtered = collectionId ? services.filter((s) => s.collectionId === collectionId) : services;
  return { services: filtered, allServices: services, addService };
}
