import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { traders } from "@/lib/mock-data";
import { toast } from "sonner";
import { TrendingUp, Shield } from "lucide-react";

interface CopyModalProps {
  traderId: string | null;
  open: boolean;
  onClose: () => void;
}

const riskLevels = ["Conservative", "Moderate", "Aggressive"] as const;

export function CopyModal({ traderId, open, onClose }: CopyModalProps) {
  const [amount, setAmount] = useState("1000");
  const [risk, setRisk] = useState<typeof riskLevels[number]>("Moderate");
  const [loading, setLoading] = useState(false);

  const trader = traders.find(t => t.id === traderId);
  if (!trader) return null;

  const handleCopy = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast.success(`Now copying ${trader.name}`, { description: `$${amount} allocated at ${risk} risk` });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Copy {trader.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center text-sm font-semibold text-primary">
              {trader.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{trader.name}</p>
              <p className="text-xs text-muted-foreground">ROI: +{trader.roi}% · Win Rate: {trader.winRate}%</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Investment Amount (USDT)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full h-10 px-3 rounded-md bg-muted border border-border text-sm tabular-nums focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              <Shield className="h-3 w-3 inline mr-1" />
              Risk Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {riskLevels.map(level => (
                <button
                  key={level}
                  onClick={() => setRisk(level)}
                  className={`py-2 px-3 rounded-md text-xs font-medium transition-all duration-150 active:scale-95 ${
                    risk === level
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-muted-foreground">Cancel</Button>
          <Button onClick={handleCopy} disabled={loading || !amount}>
            {loading ? "Starting..." : "Start Copying"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
