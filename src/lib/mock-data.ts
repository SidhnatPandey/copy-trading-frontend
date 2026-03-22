export const traders = [
  { id: "1", name: "Marcus Chen", avatar: "MC", roi: 142.8, winRate: 78.3, followers: 2847, pnl: 28450, trades: 534, rank: 1, riskLevel: "Medium", streak: 12 },
  { id: "2", name: "Sofia Alvarez", avatar: "SA", roi: 98.4, winRate: 82.1, followers: 1923, pnl: 19200, trades: 312, rank: 2, riskLevel: "Low", streak: 8 },
  { id: "3", name: "James Okafor", avatar: "JO", roi: 87.6, winRate: 71.5, followers: 1654, pnl: 15800, trades: 428, rank: 3, riskLevel: "High", streak: 5 },
  { id: "4", name: "Yuki Tanaka", avatar: "YT", roi: 76.2, winRate: 74.9, followers: 1287, pnl: 12400, trades: 267, rank: 4, riskLevel: "Medium", streak: 15 },
  { id: "5", name: "Elena Petrova", avatar: "EP", roi: 64.1, winRate: 69.8, followers: 986, pnl: 9800, trades: 389, rank: 5, riskLevel: "Low", streak: 3 },
  { id: "6", name: "Kwame Asante", avatar: "KA", roi: 58.3, winRate: 73.2, followers: 754, pnl: 8200, trades: 198, rank: 6, riskLevel: "Medium", streak: 7 },
];

export const recentTrades = [
  { id: "t1", pair: "BTC/USDT", side: "buy" as const, price: 67234.50, amount: 0.15, pnl: 342.80, time: "2 min ago", status: "open" as const },
  { id: "t2", pair: "ETH/USDT", side: "sell" as const, price: 3542.20, amount: 2.5, pnl: -128.40, time: "8 min ago", status: "closed" as const },
  { id: "t3", pair: "SOL/USDT", side: "buy" as const, price: 178.65, amount: 25, pnl: 567.20, time: "15 min ago", status: "open" as const },
  { id: "t4", pair: "BNB/USDT", side: "buy" as const, price: 612.30, amount: 5, pnl: 89.50, time: "23 min ago", status: "closed" as const },
  { id: "t5", pair: "XRP/USDT", side: "sell" as const, price: 0.6234, amount: 5000, pnl: -45.20, time: "31 min ago", status: "closed" as const },
  { id: "t6", pair: "ADA/USDT", side: "buy" as const, price: 0.4521, amount: 3000, pnl: 156.80, time: "45 min ago", status: "open" as const },
];

export const portfolioData = [
  { date: "Jan", value: 10000, profit: 0 },
  { date: "Feb", value: 11200, profit: 1200 },
  { date: "Mar", value: 10800, profit: 800 },
  { date: "Apr", value: 13500, profit: 3500 },
  { date: "May", value: 14200, profit: 4200 },
  { date: "Jun", value: 16800, profit: 6800 },
  { date: "Jul", value: 15400, profit: 5400 },
  { date: "Aug", value: 18200, profit: 8200 },
  { date: "Sep", value: 19800, profit: 9800 },
  { date: "Oct", value: 21500, profit: 11500 },
  { date: "Nov", value: 20100, profit: 10100 },
  { date: "Dec", value: 24300, profit: 14300 },
];

export const roiData = [
  { month: "Jan", roi: 12.0 }, { month: "Feb", roi: -3.5 }, { month: "Mar", roi: 25.0 },
  { month: "Apr", roi: 5.2 }, { month: "May", roi: 18.3 }, { month: "Jun", roi: -8.2 },
  { month: "Jul", roi: 31.0 }, { month: "Aug", roi: 8.4 }, { month: "Sep", roi: 14.7 },
  { month: "Oct", roi: -2.1 }, { month: "Nov", roi: 22.5 }, { month: "Dec", roi: 19.5 },
];

export const marketData = [
  { symbol: "BTC", name: "Bitcoin", price: 67234.50, change24h: 2.34, volume: "32.4B", marketCap: "1.32T", high24h: 67890.00, low24h: 65120.00 },
  { symbol: "ETH", name: "Ethereum", price: 3542.20, change24h: -1.28, volume: "18.7B", marketCap: "425.8B", high24h: 3612.00, low24h: 3480.00 },
  { symbol: "SOL", name: "Solana", price: 178.65, change24h: 5.12, volume: "4.2B", marketCap: "78.3B", high24h: 182.40, low24h: 168.90 },
  { symbol: "BNB", name: "BNB", price: 612.30, change24h: 0.87, volume: "2.1B", marketCap: "91.2B", high24h: 618.50, low24h: 604.20 },
  { symbol: "XRP", name: "Ripple", price: 0.6234, change24h: -2.45, volume: "1.8B", marketCap: "34.1B", high24h: 0.6450, low24h: 0.6100 },
  { symbol: "ADA", name: "Cardano", price: 0.4521, change24h: 3.67, volume: "892M", marketCap: "16.0B", high24h: 0.4620, low24h: 0.4310 },
  { symbol: "AVAX", name: "Avalanche", price: 38.42, change24h: -0.92, volume: "645M", marketCap: "14.2B", high24h: 39.10, low24h: 37.80 },
  { symbol: "DOT", name: "Polkadot", price: 7.84, change24h: 1.56, volume: "412M", marketCap: "10.8B", high24h: 8.02, low24h: 7.65 },
];

export const positions = [
  { pair: "BTC/USDT", side: "long" as const, entry: 65200, current: 67234.50, size: 0.5, pnl: 1017.25, pnlPercent: 3.12 },
  { pair: "ETH/USDT", side: "long" as const, entry: 3380, current: 3542.20, size: 4, pnl: 648.80, pnlPercent: 4.80 },
  { pair: "SOL/USDT", side: "short" as const, entry: 185.40, current: 178.65, size: 30, pnl: 202.50, pnlPercent: 3.64 },
  { pair: "XRP/USDT", side: "long" as const, entry: 0.6450, current: 0.6234, size: 8000, pnl: -172.80, pnlPercent: -3.35 },
];
