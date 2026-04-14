import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ROOM_CAPACITY } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, room, check_in, check_out, guests, message } = body;

    if (!name || !phone || !room || !check_in || !check_out || !guests) {
      return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
    }

    if (!ROOM_CAPACITY[room]) {
      return NextResponse.json({ error: "객실 선택이 올바르지 않습니다." }, { status: 400 });
    }

    if (new Date(check_out) <= new Date(check_in)) {
      return NextResponse.json({ error: "체크아웃 날짜는 체크인 이후여야 합니다." }, { status: 400 });
    }

    if (guests < 1 || guests > ROOM_CAPACITY[room]) {
      return NextResponse.json(
        { error: `해당 객실의 최대 인원은 ${ROOM_CAPACITY[room]}명입니다.` },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin()
      .from("reservations")
      .insert({
        name,
        phone,
        email: email || null,
        room,
        check_in,
        check_out,
        guests,
        message: message || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reservation: data });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
