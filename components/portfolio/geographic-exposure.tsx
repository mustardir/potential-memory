"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  ComposedChart,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Holding = {
  symbol: string;
  marketValue: number;
};

const regions = [
  "North America",
  "Europe",
  "Asia-Pacific",
  "Emerging Markets",
  "Other",
] as const;

const benchmark: Record<(typeof regions)[number], number> = {
  "North America": 45,
  Europe: 20,
  "Asia-Pacific": 18,
  "Emerging Markets": 12,
  Other: 5,
};

function assignRegion(symbol: string) {
  const idx = Math.abs(symbol.charCodeAt(symbol.length - 1) + symbol.length) % regions.length;
  return regions[idx];
}

export function GeographicExposure({ holdings }: { holdings: Holding[] }) {
  const data = useMemo(() => {
    const totals: Record<string, number> = Object.fromEntries(regions.map((r) => [r, 0]));

    for (const h of holdings) {
      totals[assignRegion(h.symbol)] += h.marketValue;
    }

    const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);

    return regions.map((r) => {
      const value = totals[r];
      const pct = totalValue === 0 ? 0 : (value / totalValue) * 100;
      return {
        region: r,
        value,
        percentage: pct,
        benchmark: benchmark[r],
      };
    });
  }, [holdings]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Geographic Exposure</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis type="number" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="region"
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #374151" }}
                  formatter={(value: number, name: string) => {
                    if (name === "value") return [`$${Number(value).toLocaleString()}`, "Value"];
                    if (name === "benchmark") return [`${Number(value).toFixed(1)}%`, "Benchmark"];
                    return [`${Number(value).toFixed(1)}%`, "Actual %"];
                  }}
                />
                <Bar dataKey="percentage" name="actual" fill="#C9A227" radius={[0, 8, 8, 0]} />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#60A5FA"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name="benchmark"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 space-y-1 text-xs">
            {data.map((d) => (
              <div key={d.region} className="flex items-center justify-between text-muted-foreground">
                <span>{d.region}</span>
                <span className="text-white">
                  {d.percentage.toFixed(1)}% · ${d.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
