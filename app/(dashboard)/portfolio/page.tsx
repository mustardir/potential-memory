import { Suspense } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { HoldingsTable } from "@/components/portfolio/holdings-table";
import { SectorAllocation } from "@/components/portfolio/sector-allocation";
import { GeographicExposure } from "@/components/portfolio/geographic-exposure";
import { PnlBreakdown } from "@/components/portfolio/pnl-breakdown";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

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

type HoldingsApiResponse = {
  holdings: Holding[];
  summary: {
    totalPortfolioValue: number;
    totalDayChange: number;
    totalDayChangePct: number;
    totalReturn: number;
    totalReturnPct: number;
  };
};

async function getHoldings(): Promise<HoldingsApiResponse> {
  // Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/holdings`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to fetch holdings: ${res.status} - ${error}`);
  }

  return res.json();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function HeaderStats({
  totalPortfolioValue,
  totalDayChange,
  totalDayChangePct,
}: {
  totalPortfolioValue: number;
  totalDayChange: number;
  totalDayChangePct: number;
}) {
  const positive = totalDayChange >= 0;

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Total Portfolio Value
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          {formatCurrency(totalPortfolioValue)}
        </div>
        <div
          className={`mt-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm ${
            positive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {positive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span>
            {formatCurrency(totalDayChange)} ({formatPercent(totalDayChangePct)}) Today
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function PortfolioPage() {
  const data = await getHoldings();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="space-y-3">
        <h1 className="text-gradient text-3xl font-bold md:text-4xl">Portfolio Holdings</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Detailed view of your positions and performance
        </p>
      </div>

      <HeaderStats
        totalPortfolioValue={data.summary.totalPortfolioValue}
        totalDayChange={data.summary.totalDayChange}
        totalDayChangePct={data.summary.totalDayChangePct}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <HoldingsTable holdings={data.holdings} />
        </div>
        <div className="space-y-6">
          <SectorAllocation holdings={data.holdings} />
          <GeographicExposure holdings={data.holdings} />
        </div>
      </div>

      <Suspense
        fallback={
          <Card className="glass-card">
            <CardContent className="p-6">
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        }
      >
        <PnlBreakdown holdings={data.holdings} />
      </Suspense>
    </div>
  );
}
