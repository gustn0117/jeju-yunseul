import { createClient } from "@supabase/supabase-js";

// 모듈-레벨에서 createClient 를 호출하면 env 미설정 시 import 자체가 throw 한다.
// 그러면 페이지의 try/catch fallback 로직이 동작할 수 없으므로 항상 lazy 로 생성한다.

const opts = {
  db: { schema: "jeju_yunseul" as const },
  auth: { persistSession: false },
};

const buildAnon = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    opts,
  );

const buildAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    opts,
  );

type AnonClient = ReturnType<typeof buildAnon>;
type AdminClient = ReturnType<typeof buildAdmin>;

let _anon: AnonClient | null = null;
let _admin: AdminClient | null = null;

export const supabase: AnonClient = new Proxy({} as AnonClient, {
  get(_t, prop) {
    if (!_anon) _anon = buildAnon();
    return Reflect.get(_anon as object, prop);
  },
});

export function supabaseAdmin(): AdminClient {
  if (!_admin) _admin = buildAdmin();
  return _admin;
}
