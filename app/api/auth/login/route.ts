import { createGithubLoginResponse, jsonError } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  try {
    return await createGithubLoginResponse(request);
  } catch (error) {
    console.error("Could not start GitHub sign-in", error);
    return jsonError("GitHub sign-in is not configured correctly.", 503);
  }
}
