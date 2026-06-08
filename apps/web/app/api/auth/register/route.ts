import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
try {
const body = await req.json();

const { firstName, lastName, email, password } = body;

if (!firstName || !lastName || !email || !password) {
  return NextResponse.json(
    {
      success: false,
      message: "All fields are required",
    },
    { status: 400 }
  );
}

if (password.length < 8) {
  return NextResponse.json(
    {
      success: false,
      message: "Password must be at least 8 characters",
    },
    { status: 400 }
  );
}

const hashedPassword = await bcrypt.hash(password, 12);

// TODO:
// Save user to database using Prisma/TiDB
// Check if email already exists
// Send verification email

return NextResponse.json(
  {
    success: true,
    message: "Account created successfully",
    user: {
      firstName,
      lastName,
      email,
    },
  },
  { status: 201 }
);

} catch (error) {
console.error(error);

return NextResponse.json(
  {
    success: false,
    message: "Registration failed",
  },
  { status: 500 }
);

}
}
