import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { getLatestMarketData } from "@/apiService/marketService";
import { toast } from "sonner";

export default function Market() {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchLatestData();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect (() => {
    fetchLatestData();
  }, []);

  const fetchLatestData = async () => {
    setLoading(true);
    getLatestMarketData().then(response => {
      setData(response.data);
    }).catch(error => {
      toast.error("Failed to fetch market data. Please try again later.");
    }).finally(() => {
      setLoading(false);
    });
  }

  const refresh = () => {
    setRefreshing(true);
    fetchLatestData();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Market</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Live cryptocurrency prices</p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors active:scale-95"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="glass-card overflow-hidden animate-slide-up">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left px-5 py-3 font-medium text-xs">#</th>
                <th className="text-left px-5 py-3 font-medium text-xs">Asset</th>
                <th className="text-right px-5 py-3 font-medium text-xs">Price</th>
                <th className="text-right px-5 py-3 font-medium text-xs">24h Change</th>
                <th className="text-right px-5 py-3 font-medium text-xs hidden sm:table-cell">24h Volume</th>
                <th className="text-right px-5 py-3 font-medium text-xs hidden md:table-cell">Market Cap</th>
                <th className="text-right px-5 py-3 font-medium text-xs hidden lg:table-cell">24h High</th>
                <th className="text-right px-5 py-3 font-medium text-xs hidden lg:table-cell">24h Low</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 && data.map((coin, i) => (
                <tr key={coin.symbol} className="border-b border-border/50 hover:bg-accent/50 transition-colors animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-5 py-4 text-muted-foreground">{i + 1}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {coin.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{coin.name}</p>
                        <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums">
                    ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium tabular-nums ${coin.change24h >= 0 ? "text-profit" : "text-loss"}`}>
                      {coin.change24h >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {coin.change24h >= 0 ? "+" : ""}{coin.change24h.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-muted-foreground tabular-nums hidden sm:table-cell">{coin.volume}</td>
                  <td className="px-5 py-4 text-right text-muted-foreground tabular-nums hidden md:table-cell">{coin.marketCap}</td>
                  <td className="px-5 py-4 text-right tabular-nums hidden lg:table-cell">${coin.high24h.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right tabular-nums hidden lg:table-cell">${coin.low24h.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
