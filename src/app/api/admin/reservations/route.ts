import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const room = searchParams.get("room");

  let q = supabaseAdmin()
    .from("reservations")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) q = q.eq("status", status);
  if (room) q = q.eq("room", room);

  const { data, error } = await q;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ reservations: data });
}
