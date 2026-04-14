import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD || "1234";
  if (password !== expected) {
    return NextResponse.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
