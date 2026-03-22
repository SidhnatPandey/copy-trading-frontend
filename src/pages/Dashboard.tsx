import { Wallet, TrendingUp, Users, Activity } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { TradeTable } from "@/components/TradeTable";
import { PortfolioChart } from "@/components/PortfolioChart";
import { recentTrades, traders } from "@/lib/mock-data";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your trading activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Balance" value="$24,312.50" change="+$2,847 this month" changeType="profit" icon={Wallet} delay={0} />
        <StatCard title="Total P&L" value="+$14,312" change="+142.8% all time" changeType="profit" icon={TrendingUp} delay={60} />
        <StatCard title="Copied Traders" value="3" change="2 profitable" changeType="profit" icon={Users} delay={120} />
        <StatCard title="Open Positions" value="4" change="3 in profit" changeType="profit" icon={Activity} delay={180} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <PortfolioChart />
        </div>
        <div className="lg:col-span-2">
          <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "150ms" }}>
            <h3 className="text-sm font-semibold mb-3">Top Copied Traders</h3>
            <div className="space-y-3">
              {traders.slice(0, 3).map((t) => (
                <div key={t.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-semibold text-primary">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.followers} followers</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-profit tabular-nums">+{t.roi}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TradeTable trades={recentTrades} />
    </div>
  );
}
