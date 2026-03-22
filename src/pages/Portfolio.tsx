import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PortfolioChart } from "@/components/PortfolioChart";
import { positions } from "@/lib/mock-data";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const allocation = [
  { name: "BTC", value: 45, color: "hsl(38, 92%, 50%)" },
  { name: "ETH", value: 25, color: "hsl(220, 70%, 55%)" },
  { name: "SOL", value: 18, color: "hsl(280, 70%, 55%)" },
  { name: "Others", value: 12, color: "hsl(215, 12%, 40%)" },
];

export default function Portfolio() {
  const totalPnl = positions.reduce((s, p) => s + p.pnl, 0);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Portfolio</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your holdings and performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Balance" value="$24,312.50" change="+12.4% this month" changeType="profit" icon={Wallet} delay={0} />
        <StatCard title="Unrealized P&L" value={`${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`} change={`${positions.filter(p => p.pnl > 0).length} profitable`} changeType={totalPnl >= 0 ? "profit" : "loss"} icon={TrendingUp} delay={60} />
        <StatCard title="Total Equity" value="$25,608.25" change="+$1,295.75 today" changeType="profit" icon={TrendingUp} delay={120} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PortfolioChart />
        </div>
        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <h3 className="text-sm font-semibold mb-4">Allocation</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {allocation.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {allocation.map(a => (
              <div key={a.name} className="flex items-center gap-1.5 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                <span className="text-muted-foreground">{a.name} {a.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
        <div className="px-5 py-3 border-b border-border">
          <h3 className="text-sm font-semibold">Open Positions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-2.5 font-medium text-xs">Pair</th>
                <th className="text-left px-5 py-2.5 font-medium text-xs">Side</th>
                <th className="text-right px-5 py-2.5 font-medium text-xs">Entry</th>
                <th className="text-right px-5 py-2.5 font-medium text-xs">Current</th>
                <th className="text-right px-5 py-2.5 font-medium text-xs">Size</th>
                <th className="text-right px-5 py-2.5 font-medium text-xs">P&L</th>
                <th className="text-right px-5 py-2.5 font-medium text-xs">P&L %</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(p => (
                <tr key={p.pair} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                  <td className="px-5 py-3 font-medium">{p.pair}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium uppercase px-1.5 py-0.5 rounded ${p.side === "long" ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}`}>{p.side}</span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums">${p.entry.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right tabular-nums">${p.current.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{p.size}</td>
                  <td className={`px-5 py-3 text-right tabular-nums font-medium ${p.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                    {p.pnl >= 0 ? "+" : ""}${p.pnl.toFixed(2)}
                  </td>
                  <td className={`px-5 py-3 text-right tabular-nums font-medium ${p.pnlPercent >= 0 ? "text-profit" : "text-loss"}`}>
                    {p.pnlPercent >= 0 ? "+" : ""}{p.pnlPercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
