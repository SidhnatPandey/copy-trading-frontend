import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TraderCardProps {
  trader: {
    id: string;
    name: string;
    avatar: string;
    roi: number;
    winRate: number;
    followers: number;
    pnl: number;
    rank: number;
    riskLevel: string;
  };
  onCopy?: (id: string) => void;
  delay?: number;
}

export function TraderCard({ trader, onCopy, delay = 0 }: TraderCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="glass-card p-5 animate-slide-up cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => navigate(`/traders/${trader.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">
            {trader.avatar}
          </div>
          <div>
            <p className="font-medium text-sm">{trader.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Award className="h-3 w-3 text-warning" />
              <span className="text-xs text-muted-foreground">Rank #{trader.rank}</span>
            </div>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          trader.riskLevel === "Low" ? "bg-profit/10 text-profit" :
          trader.riskLevel === "Medium" ? "bg-warning/10 text-warning" :
          "bg-loss/10 text-loss"
        }`}>
          {trader.riskLevel}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">ROI</p>
          <p className="text-sm font-semibold text-profit tabular-nums">+{trader.roi}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Win Rate</p>
          <p className="text-sm font-semibold tabular-nums">{trader.winRate}%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Followers</p>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <p className="text-sm font-semibold tabular-nums">{trader.followers.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <Button
        className="w-full"
        size="sm"
        onClick={(e) => { e.stopPropagation(); onCopy?.(trader.id); }}
      >
        <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
        Copy Trader
      </Button>
    </div>
  );
}
