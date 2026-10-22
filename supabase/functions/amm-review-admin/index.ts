import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const PROJECT_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_EMAIL = "ammdatasolutions229@gmail.com";
const ALLOWED_ORIGINS = new Set([
  "https://amm-data-solutions-new.vercel.app",
  "https://amm-data-solutions-e6sysarmd-wwwab229-cpus-projects.vercel.app"
]);

// Allow only this project's team-owned Vercel preview hostnames.
// Authorization is still enforced independently by validating the Supabase user.
function isAllowedOrigin(origin: string) {
  return ALLOWED_ORIGINS.has(origin) ||
    /^https:\/\/amm-data-solutions-new-[a-z0-9-]+-wwwab229-cpus-projects\.vercel\.app$/.test(origin);
}

function json(body: unknown, status = 200, origin = "") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(origin && isAllowedOrigin(origin) ? { "Access-Control-Allow-Origin": origin } : {}),
      "Vary": "Origin",
      "Access-Control-Allow-Headers": "authorization, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    }
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  if (req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) return new Response("Forbidden", { status: 403 });
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Vary": "Origin",
        "Access-Control-Allow-Headers": "authorization, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, origin);
  if (!isAllowedOrigin(origin)) return json({ error: "Origin not allowed" }, 403);

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return json({ error: "Sign in required" }, 401, origin);

  const authClient = createClient(PROJECT_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  const email = userData?.user?.email?.trim().toLowerCase();
  if (userError || email !== ADMIN_EMAIL) {
    return json({ error: "Admin access required" }, 403, origin);
  }

  let payload: { action?: string; id?: string; ids?: string[]; status?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400, origin);
  }

  const adminDb = createClient(PROJECT_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  if (payload.action === "list") {
    const { data, error } = await adminDb
      .from("review_feedback_submissions")
      .select("id,submission_type,display_name,business,rating,message,status,created_at")
      .in("status", ["pending", "approved", "rejected"])
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return json({ error: "Could not load submissions" }, 500, origin);
    return json({ submissions: data ?? [] }, 200, origin);
  }

  if (payload.action === "bulk_update") {
    if (payload.status !== "approved" && payload.status !== "rejected") {
      return json({ error: "Status must be approved or rejected" }, 400, origin);
    }
    if (!Array.isArray(payload.ids) || payload.ids.length < 1 || payload.ids.length > 100) {
      return json({ error: "Select between 1 and 100 submissions" }, 400, origin);
    }
    const ids = [...new Set(payload.ids)];
    const validId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (ids.some(id => typeof id !== "string" || !validId.test(id))) {
      return json({ error: "One or more submission IDs are invalid" }, 400, origin);
    }
    const { data, error } = await adminDb
      .from("review_feedback_submissions")
      .update({ status: payload.status })
      .in("id", ids)
      .eq("status", "pending")
      .select("id,status");
    if (error) return json({ error: "Could not update selected submissions" }, 500, origin);
    return json({ updated: data?.length ?? 0, submissions: data ?? [] }, 200, origin);
  }

  if (payload.action === "update") {
    if (!payload.id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.id)) {
      return json({ error: "Invalid submission ID" }, 400, origin);
    }
    if (payload.status !== "approved" && payload.status !== "rejected") {
      return json({ error: "Status must be approved or rejected" }, 400, origin);
    }
    const { data, error } = await adminDb
      .from("review_feedback_submissions")
      .update({ status: payload.status })
      .eq("id", payload.id)
      .eq("status", "pending")
      .select("id,status")
      .maybeSingle();
    if (error) return json({ error: "Could not update submission" }, 500, origin);
    if (!data) return json({ error: "Submission was already processed or does not exist" }, 409, origin);
    return json({ submission: data }, 200, origin);
  }

  return json({ error: "Unknown action" }, 400, origin);
});
