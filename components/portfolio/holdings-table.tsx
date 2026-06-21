"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Holding = {
  id: string;
  portfolioId: string;
  symbol: string;
  name: string;
  assetClass: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  weight: number;
  dayChange: number;
  dayChangePct: number;
  totalReturn: number;
  totalReturnPct: number;
  lastUpdated: string;
};

type SortKey = keyof Pick<
  Holding,
  | "symbol"
  | "name"
  | "assetClass"
  | "quantity"
  | "avgCost"
  | "currentPrice"
  | "marketValue"
  | "unrealizedPnl"
  | "weight"
>;

const PAGE_SIZE = 10;
const FILTERS = ["All", "Equity", "Fixed Income", "Alternative", "Cash", "Crypto"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 4 }).format(value);
}

export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  const [query, setQuery] = useState("");
  const [assetFilter, setAssetFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("marketValue");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return holdings
      .filter((h) => (assetFilter === "All" ? true : h.assetClass === assetFilter))
      .filter((h) => {
        if (!q) return true;
        return h.symbol.toLowerCase().includes(q) || h.name.toLowerCase().includes(q);
      });
  }, [holdings, query, assetFilter]);

  const sorted = useMemo(() => {
    const items = [...filtered];

    items.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === "string" && typeof bVal === "string") {
        const cmp = aVal.localeCompare(bVal);
        return sortDir === "asc" ? cmp : -cmp;
      }

      const cmp = Number(aVal) - Number(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return items;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, safePage]);

  const requestSort = (key: SortKey) => {
    setPage(1);
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  };

  const exportCsv = () => {
    const headers = [
      "Symbol",
      "Name",
      "Asset Class",
      "Quantity",
      "Avg Cost",
      "Current Price",
      "Market Value",
      "Unrealized P&L",
      "Weight %",
    ];

    const rows = sorted.map((h) => [
      h.symbol,
      h.name,
      h.assetClass,
      h.quantity,
      h.avgCost,
      h.currentPrice,
      h.marketValue,
      h.unrealizedPnl,
      h.weight,
    ]);

    const csv = [headers, ...rows]
      .map((r) => r.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-holdings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="glass-card">
        <CardHeader className="space-y-4">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <CardTitle>Holdings</CardTitle>
              <CardDescription>Sortable, filterable detailed positions view</CardDescription>
            </div>
            <Button onClick={exportCsv} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search symbol or name"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={assetFilter}
                onValueChange={(v) => {
                  setAssetFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter asset class" />
                </SelectTrigger>
                <SelectContent>
                  {FILTERS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-border/50">
            <table className="min-w-full text-sm">
              <thead className="bg-card/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {[
                    ["Symbol", "symbol"],
                    ["Name", "name"],
                    ["Asset Class", "assetClass"],
                    ["Quantity", "quantity"],
                    ["Avg Cost", "avgCost"],
                    ["Current Price", "currentPrice"],
                    ["Market Value", "marketValue"],
                    ["Unrealized P&L", "unrealizedPnl"],
                    ["Weight %", "weight"],
                  ].map(([label, key]) => (
                    <th key={key} className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => requestSort(key as SortKey)}
                        className="inline-flex items-center gap-1 transition hover:text-white"
                      >
                        {label}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-muted-foreground" colSpan={9}>
                      No holdings match your filters.
                    </td>
                  </tr>
                ) : (
                  paginated.map((h) => {
                    const positive = h.unrealizedPnl >= 0;

                    return (
                      <tr
                        key={h.id}
                        className="border-t border-border/40 transition-colors hover:bg-white/[0.03]"
                      >
                        <td className="px-4 py-3 font-semibold text-white">{h.symbol}</td>
                        <td className="px-4 py-3 text-muted-foreground">{h.name}</td>
                        <td className="px-4 py-3">{h.assetClass}</td>
                        <td className="px-4 py-3">{formatNumber(h.quantity)}</td>
                        <td className="px-4 py-3">{formatCurrency(h.avgCost)}</td>
                        <td className="px-4 py-3">{formatCurrency(h.currentPrice)}</td>
                        <td className="px-4 py-3 font-medium">{formatCurrency(h.marketValue)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 font-medium ${
                              positive ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {positive ? (
                              <ArrowUpRight className="h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4" />
                            )}
                            {formatCurrency(h.unrealizedPnl)} ({h.unrealizedPnlPct.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">{h.weight.toFixed(2)}%</div>
                            <Progress value={Math.min(100, Math.max(0, h.weight))} className="h-2" />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {paginated.length} of {sorted.length} filtered holdings
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {safePage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
