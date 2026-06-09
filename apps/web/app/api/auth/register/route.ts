import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      {
        success: false,
        message: "Email and password are required",
      },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(password);

  return NextResponse.json({
    success: true,
    email,
    hashedPassword,
  });
}
