import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionResponse } from "@/lib/auth";
import { registerSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
try {
const body = await req.json();
const parseResult = registerSchema.safeParse(body);
if (!parseResult.success) {
  return NextResponse.json({ success: false, message: "Invalid request payload", errors: parseResult.error.format() }, { status: 400 });
}

const { firstName, lastName, email, password } = parseResult.data;

const existingUser = await prisma.user.findUnique({
  where: {
    email: email.toLowerCase(),
  },
});

if (existingUser) {
  return NextResponse.json(
    {
      success: false,
      message: "Email already registered",
    },
    { status: 409 }
  );
}

const passwordHash = await bcrypt.hash(
  password,
  12
);

const user = await prisma.user.create({
  data: {
    firstName,
    lastName,
    email: email.toLowerCase(),
    // Prisma schema defines `password` field
    password: passwordHash,
  },
});

return createSessionResponse(
  user.id,
  {
    success: true,
    message: "Account created successfully",
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
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
