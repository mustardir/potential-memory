import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { holdings, portfolios } from "@/lib/db/schema";
import { and, eq, inArray } from "drizzle-orm";

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

/**
 * Deterministic day change calculation based on symbol hash
 * Ensures consistent results across requests for the same holding
 */
function calculateDayChange(
  symbol: string,
  marketValue: number,
): { dayChange: number; dayChangePct: number } {
  // Use symbol hash to seed consistent but symbol-specific variation
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash << 5) - hash + symbol.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate deterministic value between -0.6% and +0.6%
  const normalized = ((hash % 100) / 100 - 0.5) * 2 * 0.006;
  const dayChange = marketValue * normalized;
  const dayChangePct = marketValue === 0 ? 0 : (dayChange / marketValue) * 100;

  return { dayChange, dayChangePct };
}

export async function GET() {
  try {
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

    // Query all holdings across all user portfolios
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
      .where(inArray(holdings.portfolioId, portfolioIds));

    const mapped = rows.map((h) => {
      const { dayChange, dayChangePct } = calculateDayChange(h.symbol, h.marketValue);

      return {
        ...h,
        dayChange,
        dayChangePct,
        totalReturn: h.unrealizedPnl,
        totalReturnPct: h.unrealizedPnlPct,
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
  } catch (error) {
    console.error("Error in GET /api/holdings:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid response data", details: error.errors },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
