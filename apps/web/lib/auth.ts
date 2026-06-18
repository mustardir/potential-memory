import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "session_token";

function createSessionToken() {
  const bytes = new Uint8Array(48);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function createSessionResponse(userId: string, body: any = { success: true }, init?: ResponseInit) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

  await prisma.session.create({
    data: { userId, token, expiresAt },
  });

  const res = NextResponse.json(body, init);
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return res;
}

export async function clearSessionResponse(req: NextRequest, body: any = { success: true }) {
  const cookie = req.cookies.get(SESSION_COOKIE);
  const token = cookie?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { token } });
  }

  const res = NextResponse.json(body);
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}

export async function getUserFromToken(token?: string | null) {
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (!session) return null;
    if (session.expiresAt <= new Date()) {
      await prisma.session.deleteMany({ where: { token } });
      return null;
    }

    if (session.user.status !== "ACTIVE") {
      return null;
    }

    return session.user;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function getUserFromRequest(req: NextRequest) {
  const cookie = req.cookies.get(SESSION_COOKIE);
  return getUserFromToken(cookie?.value);
}

export async function requireUser(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    throw NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return user;
}
