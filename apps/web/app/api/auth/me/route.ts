import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
    select: { id: true, balance: true, currency: true, isLocked: true, createdAt: true, updatedAt: true },
  });

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      address: true,
      city: true,
      country: true,
      postalCode: true,
      dateOfBirth: true,
      occupation: true,
      nationality: true,
      kycStatus: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      user,
      wallet,
      profile,
    },
  });
}
