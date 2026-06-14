import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);

    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
      select: { id: true, address: true, city: true, country: true, postalCode: true, dateOfBirth: true, occupation: true, nationality: true, kycStatus: true, createdAt: true },
    });

    if (!profile) {
      return NextResponse.json({ success: false, message: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch profile" }, { status: 500 });
  }
}
