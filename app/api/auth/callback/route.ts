import { completeGithubLogin, jsonError } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    return await completeGithubLogin(request);
  } catch (error) {
    console.error("GitHub OAuth callback failed", error);
    return jsonError("GitHub sign-in failed. Please try again.", 503);
  }
}
