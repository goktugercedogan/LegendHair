import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hasSupabaseAdminConfig } from "@/lib/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function authorizeAdmin(request: Request | NextRequest) {
  if (!hasSupabaseAdminConfig) {
    const cookieHeader = request.headers.get("cookie") ?? "";
    return cookieHeader.includes("legend_admin_demo=1");
  }

  const token = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!token || !supabaseUrl || !serviceRoleKey) {
    return false;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });

  const { data, error } = await supabase.auth.getUser(token);
  return Boolean(data.user && !error);
}
