import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { portfolioData } from "@/lib/mock-data";

export function PortfolioChart() {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "100ms" }}>
      <h3 className="text-sm font-semibold mb-4">Portfolio Value</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={portfolioData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <defs>
              <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 14%)" />
            <XAxis dataKey="date" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "hsl(215, 12%, 50%)" }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]}
            />
            <Area type="monotone" dataKey="value" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#portfolioGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
