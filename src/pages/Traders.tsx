import { useState } from "react";
import { Search } from "lucide-react";
import { traders } from "@/lib/mock-data";
import { TraderCard } from "@/components/TraderCard";
import { CopyModal } from "@/components/CopyModal";

type SortKey = "roi" | "winRate" | "followers";

export default function Traders() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("roi");
  const [copyId, setCopyId] = useState<string | null>(null);

  const filtered = traders
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b[sort] - a[sort]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Top Traders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Find and copy the best traders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search traders..."
            className="w-full h-9 rounded-md bg-muted border border-border pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2">
          {(["roi", "winRate", "followers"] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 ${
                sort === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {key === "roi" ? "ROI" : key === "winRate" ? "Win Rate" : "Followers"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((trader, i) => (
          <TraderCard key={trader.id} trader={trader} onCopy={setCopyId} delay={i * 80} />
        ))}
      </div>

      <CopyModal traderId={copyId} open={!!copyId} onClose={() => setCopyId(null)} />
    </div>
  );
}
