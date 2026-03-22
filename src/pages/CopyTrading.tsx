import { useState } from "react";
import { Play, Square, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { traders } from "@/lib/mock-data";
import { toast } from "sonner";

interface ActiveCopy {
  traderId: string;
  amount: number;
  risk: string;
  pnl: number;
  startDate: string;
}

const initialCopies: ActiveCopy[] = [
  { traderId: "1", amount: 5000, risk: "Moderate", pnl: 1247.50, startDate: "2024-01-15" },
  { traderId: "2", amount: 3000, risk: "Conservative", pnl: 842.30, startDate: "2024-02-08" },
];

export default function CopyTrading() {
  const [copies, setCopies] = useState(initialCopies);

  const stopCopy = (traderId: string) => {
    setCopies(prev => prev.filter(c => c.traderId !== traderId));
    const t = traders.find(tr => tr.id === traderId);
    toast.success(`Stopped copying ${t?.name}`);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Copy Trading</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your active copy trades</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Allocated", value: `$${copies.reduce((s, c) => s + c.amount, 0).toLocaleString()}` },
          { label: "Total P&L", value: `+$${copies.reduce((s, c) => s + c.pnl, 0).toFixed(2)}` },
          { label: "Active Copies", value: copies.length.toString() },
        ].map((s, i) => (
          <div key={s.label} className="stat-card animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-semibold mt-1 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {copies.map((copy, i) => {
          const trader = traders.find(t => t.id === copy.traderId);
          if (!trader) return null;
          return (
            <div key={copy.traderId} className="glass-card p-5 animate-slide-up flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ animationDelay: `${(i + 3) * 80}ms` }}>
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">{trader.avatar}</div>
                <div>
                  <p className="font-medium">{trader.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Since {copy.startDate} · {copy.risk} risk</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Allocated</p>
                  <p className="text-sm font-semibold tabular-nums">${copy.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">P&L</p>
                  <p className={`text-sm font-semibold tabular-nums ${copy.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                    +${copy.pnl.toFixed(2)}
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => stopCopy(copy.traderId)} className="active:scale-95">
                  <Square className="h-3 w-3 mr-1.5" /> Stop
                </Button>
              </div>
            </div>
          );
        })}

        {copies.length === 0 && (
          <div className="glass-card p-12 text-center animate-fade-in">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No active copy trades</p>
            <Button className="mt-4" size="sm" onClick={() => window.location.href = "/traders"}>
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> Browse Traders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
