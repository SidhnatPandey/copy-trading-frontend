interface Trade {
  id: string;
  pair: string;
  side: "buy" | "sell";
  price: number;
  amount: number;
  pnl: number;
  time: string;
  status: "open" | "closed";
}

export function TradeTable({ trades }: { trades: Trade[] }) {
  return (
    <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">Recent Trades</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-5 py-2.5 font-medium text-xs">Pair</th>
              <th className="text-left px-5 py-2.5 font-medium text-xs">Side</th>
              <th className="text-right px-5 py-2.5 font-medium text-xs">Price</th>
              <th className="text-right px-5 py-2.5 font-medium text-xs">Amount</th>
              <th className="text-right px-5 py-2.5 font-medium text-xs">P&L</th>
              <th className="text-right px-5 py-2.5 font-medium text-xs">Time</th>
              <th className="text-right px-5 py-2.5 font-medium text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                <td className="px-5 py-3 font-medium">{trade.pair}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium uppercase px-1.5 py-0.5 rounded ${trade.side === "buy" ? "bg-profit/10 text-profit" : "bg-loss/10 text-loss"}`}>
                    {trade.side}
                  </span>
                </td>
                <td className="px-5 py-3 text-right tabular-nums">${trade.price.toLocaleString()}</td>
                <td className="px-5 py-3 text-right tabular-nums">{trade.amount}</td>
                <td className={`px-5 py-3 text-right tabular-nums font-medium ${trade.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                  {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                </td>
                <td className="px-5 py-3 text-right text-muted-foreground">{trade.time}</td>
                <td className="px-5 py-3 text-right">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${trade.status === "open" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
