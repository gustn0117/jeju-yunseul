import { cookies } from "next/headers";

const COOKIE_NAME = "yunseul_admin";
const COOKIE_VALUE = "ok";

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === COOKIE_VALUE;
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set({
    name: COOKIE_NAME,
    value: COOKIE_VALUE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
