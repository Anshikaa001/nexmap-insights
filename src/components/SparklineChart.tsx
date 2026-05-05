import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function SparklineChart({ data, color = "var(--primary)" }: { data: { x: number; y: number }[]; color?: string }) {
  const id = `sg-${color.replace(/[^a-z]/gi, "")}`;
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="y" stroke={color} strokeWidth={1.8} fill={`url(#${id})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
