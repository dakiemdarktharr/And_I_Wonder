import { isSameOrigin, jsonError, logoutResponse } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) return jsonError("This request must come from the app origin.", 403);
  return logoutResponse();
}
