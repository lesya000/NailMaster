import { cookies } from "next/headers";
import { createClient as createSupabaseServerClient } from "@/utils/supabase/server";

/** Обертка для существующего кода: сама получает cookie store. */
export async function createClient() {
  const cookieStore = await cookies();
  return createSupabaseServerClient(cookieStore);
}
