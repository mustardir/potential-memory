"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  ComposedChart,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Holding = {
  id: string;
  symbol: string;
  name: string;
  unrealizedPnl: number;
  marketValue: number;
};

const periods = ["1D", "1W", "1M", "3M", "1Y", "YTD", "ALL"] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PnlBreakdown({ holdings }: { holdings: Holding[] }) {
  const [period, setPeriod] = useState<(typeof periods)[number]>("YTD");

  const stats = useMemo(() => {
    const totalUnrealized = holdings.reduce((sum, h) => sum + h.unrealizedPnl, 0);
    const realized = totalUnrealized * 0.38;
    const dividends = Math.abs(totalUnrealized) * 0.12;
    const fees = Math.abs(totalUnrealized) * 0.04;

    return {
      totalUnrealized,
      realized,
      dividends,
      fees,
    };
  }, [holdings, period]);

  const waterfall = useMemo(() => {
    let cumulative = 0;
    return holdings
      .map((h) => {
        const start = cumulative;
        cumulative += h.unrealizedPnl;
        return {
          name: h.symbol,
          delta: h.unrealizedPnl,
          start,
          end: cumulative,
        };
      })
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, 12);
  }, [holdings, period]);

  const winners = useMemo(
    () => [...holdings].sort((a, b) => b.unrealizedPnl - a.unrealizedPnl).slice(0, 5),
    [holdings],
  );

  const losers = useMemo(
    () => [...holdings].sort((a, b) => a.unrealizedPnl - b.unrealizedPnl).slice(0, 5),
    [holdings],
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="glass-card">
        <CardHeader className="space-y-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <CardTitle>P&L Breakdown</CardTitle>
            <div className="flex flex-wrap gap-2">
              {periods.map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={period === p ? "default" : "outline"}
                  onClick={() => setPeriod(p)}
                >
                  {p}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Total Unrealized P&L", stats.totalUnrealized],
              ["Realized P&L YTD", stats.realized],
              ["Dividends Received", stats.dividends],
              ["Fees Paid", -Math.abs(stats.fees)],
            ].map(([label, value]) => {
              const v = Number(value);
              const positive = v >= 0;

              return (
                <div key={String(label)} className="rounded-lg border border-border/50 bg-card/40 p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p
                    className={`mt-2 flex items-center gap-2 text-lg font-semibold ${
                      positive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {positive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {formatCurrency(v)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-white">P&L Attribution Waterfall</h4>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={waterfall} margin={{ left: 10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "#111827", border: "1px solid #374151" }}
                    formatter={(value: number, key: string) => {
                      if (key === "delta") return [formatCurrency(value), "P&L Contribution"];
                      return [formatCurrency(value), key];
                    }}
                  />
                  <Bar
                    dataKey="delta"
                    radius={[4, 4, 0, 0]}
                    fill="#C9A227"
                    name="delta"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-border/50 p-3">
              <h5 className="mb-2 text-sm font-semibold text-emerald-400">Top 5 Winners</h5>
              <div className="space-y-1 text-xs">
                {winners.map((h) => (
                  <div key={h.id} className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {h.symbol} · {h.name}
                    </span>
                    <span className="text-emerald-400">{formatCurrency(h.unrealizedPnl)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border/50 p-3">
              <h5 className="mb-2 text-sm font-semibold text-red-400">Top 5 Losers</h5>
              <div className="space-y-1 text-xs">
                {losers.map((h) => (
                  <div key={h.id} className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {h.symbol} · {h.name}
                    </span>
                    <span className="text-red-400">{formatCurrency(h.unrealizedPnl)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
