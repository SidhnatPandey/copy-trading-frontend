import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Award, Users, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { traders, roiData, recentTrades } from "@/lib/mock-data";
import { TradeTable } from "@/components/TradeTable";
import { CopyModal } from "@/components/CopyModal";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TraderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copyOpen, setCopyOpen] = useState(false);
  const trader = traders.find(t => t.id === id);

  if (!trader) return <div className="p-8 text-muted-foreground">Trader not found</div>;

  return (
    <div className="space-y-6 max-w-7xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="glass-card p-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center text-lg font-semibold text-primary">{trader.avatar}</div>
            <div>
              <h1 className="text-xl font-semibold">{trader.name}</h1>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5 text-warning" /> Rank #{trader.rank}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {trader.followers.toLocaleString()}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${trader.riskLevel === "Low" ? "bg-profit/10 text-profit" : trader.riskLevel === "Medium" ? "bg-warning/10 text-warning" : "bg-loss/10 text-loss"}`}>{trader.riskLevel} Risk</span>
              </div>
            </div>
          </div>
          <Button onClick={() => setCopyOpen(true)}>
            <TrendingUp className="h-4 w-4 mr-1.5" /> Copy Trader
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          {[
            { label: "Total ROI", value: `+${trader.roi}%`, color: "text-profit" },
            { label: "Win Rate", value: `${trader.winRate}%`, color: "text-foreground" },
            { label: "Total P&L", value: `$${trader.pnl.toLocaleString()}`, color: "text-profit" },
            { label: "Total Trades", value: trader.trades.toString(), color: "text-foreground" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={`text-lg font-semibold tabular-nums ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "100ms" }}>
          <h3 className="text-sm font-semibold mb-4">Performance</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roiData}>
                <defs>
                  <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 14%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="roi" stroke="hsl(160, 84%, 39%)" strokeWidth={2} fill="url(#roiGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "150ms" }}>
          <h3 className="text-sm font-semibold mb-4">Monthly ROI</h3>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 14%)" />
                <XAxis dataKey="month" tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(220, 18%, 12%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="roi" radius={[4, 4, 0, 0]} fill="hsl(160, 84%, 39%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <TradeTable trades={recentTrades} />
      <CopyModal traderId={trader.id} open={copyOpen} onClose={() => setCopyOpen(false)} />
    </div>
  );
}
