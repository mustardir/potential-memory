import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);

    const investments = await prisma.investment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, status: true, principalAmount: true, currentValue: true, returnRate: true, startDate: true, maturityDate: true },
    });

    return NextResponse.json({ success: true, data: investments });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch investments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const { name, principalAmount, returnRate, startDate, maturityDate, currency = "USD", description } = body;

    if (!name || typeof principalAmount !== "number" || principalAmount <= 0) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const investment = await prisma.investment.create({
      data: {
        userId: user.id,
        name,
        description,
        principalAmount: principalAmount.toString(),
        currentValue: principalAmount.toString(),
        returnRate: returnRate ? returnRate.toString() : "0",
        startDate: startDate ? new Date(startDate) : new Date(),
        maturityDate: maturityDate ? new Date(maturityDate) : null,
        currency,
      },
    });

    return NextResponse.json({ success: true, data: investment }, { status: 201 });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to create investment" }, { status: 500 });
  }
}
