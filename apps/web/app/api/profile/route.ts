import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);

    const profile = await prisma.userProfile.findUnique({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true, data: profile ?? {} });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const parseResult = profileSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({ success: false, message: "Invalid request payload", errors: parseResult.error.format() }, { status: 400 });
    }

    const profile = await prisma.userProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...parseResult.data,
      },
      update: {
        ...parseResult.data,
      },
    });

    return NextResponse.json({ success: true, data: profile });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update profile" }, { status: 500 });
  }
}
