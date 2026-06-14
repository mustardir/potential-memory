import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);

    const wallet = await prisma.wallet.findUnique({
      where: { userId: user.id },
      select: { id: true, balance: true, currency: true, isLocked: true, createdAt: true, updatedAt: true },
    });

    if (!wallet) {
      return NextResponse.json({ success: false, message: "Wallet not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: wallet });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch wallet" }, { status: 500 });
  }
}
