import { NextRequest, NextResponse } from "next/server";
import { hashPassword, verifyPassword } from "@/lib/password";

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

  // Temporary demo hash until a database is added
  const storedHash = await hashPassword("password123");

  const valid = await verifyPassword(password, storedHash);

  return NextResponse.json({
    success: valid,
    message: valid ? "Login successful" : "Invalid credentials",
  });
}

