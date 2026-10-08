import { jsonError, sessionResponse } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    return await sessionResponse(request);
  } catch (error) {
    console.error("Could not read the owner session", error);
    return jsonError("Authentication is temporarily unavailable.", 503);
  }
}
