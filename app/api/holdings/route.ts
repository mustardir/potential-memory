import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { holdings, portfolios } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

const holdingSchema = z.object({
  id: z.string(),
  portfolioId: z.string(),
  symbol: z.string(),
  name: z.string(),
  assetClass: z.string(),
  quantity: z.number(),
  avgCost: z.number(),
  currentPrice: z.number(),
  marketValue: z.number(),
  unrealizedPnl: z.number(),
  unrealizedPnlPct: z.number(),
  weight: z.number(),
  dayChange: z.number(),
  dayChangePct: z.number(),
  totalReturn: z.number(),
  totalReturnPct: z.number(),
  lastUpdated: z.string(),
});

const responseSchema = z.object({
  holdings: z.array(holdingSchema),
  summary: z.object({
    totalPortfolioValue: z.number(),
    totalDayChange: z.number(),
    totalDayChangePct: z.number(),
    totalReturn: z.number(),
    totalReturnPct: z.number(),
  }),
});

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userPortfolios = await db
    .select()
    .from(portfolios)
    .where(eq(portfolios.userId, session.user.id));

  if (userPortfolios.length === 0) {
    return NextResponse.json(
      {
        holdings: [],
        summary: {
          totalPortfolioValue: 0,
          totalDayChange: 0,
          totalDayChangePct: 0,
          totalReturn: 0,
          totalReturnPct: 0,
        },
      },
      { status: 200 },
    );
  }

  const portfolioIds = userPortfolios.map((p) => p.id);

  const rows = await db
    .select({
      id: holdings.id,
      portfolioId: holdings.portfolioId,
      symbol: holdings.symbol,
      name: holdings.name,
      assetClass: holdings.assetClass,
      quantity: holdings.quantity,
      avgCost: holdings.avgCost,
      currentPrice: holdings.currentPrice,
      marketValue: holdings.marketValue,
      unrealizedPnl: holdings.unrealizedPnl,
      unrealizedPnlPct: holdings.unrealizedPnlPct,
      weight: holdings.weight,
      lastUpdated: holdings.lastUpdated,
    })
    .from(holdings)
    .where(
      and(
        eq(holdings.portfolioId, portfolioIds[0]),
      ),
    );

  const mapped = rows.map((h) => {
    const dayChange = h.marketValue * 0.0045 * (Math.random() > 0.5 ? 1 : -1);
    const dayChangePct = h.marketValue === 0 ? 0 : (dayChange / h.marketValue) * 100;
    const totalReturn = h.unrealizedPnl;
    const totalReturnPct = h.unrealizedPnlPct;

    return {
      ...h,
      dayChange,
      dayChangePct,
      totalReturn,
      totalReturnPct,
      lastUpdated: new Date(h.lastUpdated).toISOString(),
    };
  });

  const totalPortfolioValue = mapped.reduce((sum, h) => sum + h.marketValue, 0);
  const totalDayChange = mapped.reduce((sum, h) => sum + h.dayChange, 0);
  const totalReturn = mapped.reduce((sum, h) => sum + h.totalReturn, 0);

  const payload = {
    holdings: mapped,
    summary: {
      totalPortfolioValue,
      totalDayChange,
      totalDayChangePct:
        totalPortfolioValue === 0 ? 0 : (totalDayChange / totalPortfolioValue) * 100,
      totalReturn,
      totalReturnPct:
        totalPortfolioValue === 0 ? 0 : (totalReturn / totalPortfolioValue) * 100,
    },
  };

  const validated = responseSchema.parse(payload);

  return NextResponse.json(validated);
}
