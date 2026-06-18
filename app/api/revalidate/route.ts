import { type NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAdminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Authorization Header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const auth = getAdminAuth();
    
    try {
      await auth.verifyIdToken(idToken);
    } catch (authErr) {
      console.error("Token verification failed:", authErr);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse Body and Revalidate Paths
    const { paths } = await request.json();
    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: "Paths array required" }, { status: 400 });
    }

    const revalidated: string[] = [];
    const errors: string[] = [];

    for (const path of paths) {
      if (typeof path === "string" && path.startsWith("/")) {
        try {
          revalidatePath(path);
          revalidated.push(path);
        } catch (err) {
          console.error(`Failed to revalidate path: ${path}`, err);
          errors.push(`${path}: ${String(err)}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      revalidated,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (err) {
    console.error("Error in revalidate route handler:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
