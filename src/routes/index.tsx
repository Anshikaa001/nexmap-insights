import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const authed = typeof window !== "undefined" && localStorage.getItem("nexmap.auth") === "1";
  return <Navigate to={authed ? "/home" : "/login"} />;
}
