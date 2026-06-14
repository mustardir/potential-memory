import { NextRequest } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ success: true, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
