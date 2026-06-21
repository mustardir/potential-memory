"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Holding = {
  id: string;
  symbol: string;
  name: string;
  marketValue: number;
  unrealizedPnl: number;
};

const sectors = [
  "Technology",
  "Healthcare",
  "Finance",
  "Energy",
  "Industrials",
  "Consumer",
  "Utilities",
  "Real Estate",
];

function assignSector(symbol: string) {
  const idx = Math.abs(symbol.charCodeAt(0) + symbol.length) % sectors.length;
  return sectors[idx];
}

export function SectorAllocation({ holdings }: { holdings: Holding[] }) {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<
      string,
      { name: string; value: number; pnl: number; percent: number; holdings: Holding[] }
    >();

    const total = holdings.reduce((sum, h) => sum + h.marketValue, 0);

    for (const h of holdings) {
      const sector = assignSector(h.symbol);
      const curr = map.get(sector) ?? {
        name: sector,
        value: 0,
        pnl: 0,
        percent: 0,
        holdings: [],
      };

      curr.value += h.marketValue;
      curr.pnl += h.unrealizedPnl;
      curr.holdings.push(h);
      map.set(sector, curr);
    }

    return Array.from(map.values())
      .map((s) => ({
        ...s,
        percent: total === 0 ? 0 : (s.value / total) * 100,
        fill: s.pnl >= 0 ? "#10B981" : "#EF4444",
      }))
      .sort((a, b) => b.value - a.value);
  }, [holdings]);

  const selected = grouped.find((s) => s.name === selectedSector) ?? null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sector Allocation</CardTitle>
          {selectedSector && (
            <Button size="sm" variant="outline" onClick={() => setSelectedSector(null)}>
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={grouped}
                dataKey="value"
                stroke="#0A0A0A"
                fill="#C9A227"
                onClick={(d) => {
                  if (d?.name) setSelectedSector(String(d.name));
                }}
              >
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid #374151" }}
                  formatter={(value: number, _name, props: any) => [
                    `$${Number(value).toLocaleString()}`,
                    `${props.payload.name} (${props.payload.percent.toFixed(1)}%)`,
                  ]}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {grouped.map((s) => (
              <button
                key={s.name}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs transition hover:bg-white/5 ${
                  selectedSector === s.name ? "bg-white/10" : ""
                }`}
                onClick={() => setSelectedSector(s.name)}
              >
                <span className="text-muted-foreground">{s.name}</span>
                <span className="font-medium text-white">
                  ${s.value.toLocaleString()} ({s.percent.toFixed(1)}%)
                </span>
              </button>
            ))}
          </div>

          {selected && (
            <div className="rounded-md border border-border/50 p-3">
              <h4 className="mb-2 text-sm font-semibold text-white">{selected.name} holdings</h4>
              <div className="space-y-1 text-xs">
                {selected.holdings.map((h) => (
                  <div key={h.id} className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {h.symbol} · {h.name}
                    </span>
                    <span className="text-white">${h.marketValue.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
