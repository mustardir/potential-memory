import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SESSION_COOKIE = "session_token";

export async function createSessionResponse(userId: string, body: any = { success: true }, init?: ResponseInit) {
  const token = crypto.randomBytes(48).toString("hex");
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

export async function getUserFromRequest(req: NextRequest) {
  try {
    const cookie = req.cookies.get(SESSION_COOKIE);
    const token = cookie?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) return null;
    if (session.expiresAt <= new Date()) return null;

    return session.user;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function requireUser(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    throw NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
  return user;
}
