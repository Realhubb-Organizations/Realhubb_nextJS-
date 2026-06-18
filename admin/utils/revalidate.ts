import { auth } from "@/lib/firebase";

/**
 * Triggers server-side on-demand cache revalidation for the provided paths.
 * Gets the current authenticated Firebase user's ID token and sends it in the Authorization header.
 * 
 * @param paths Array of absolute website paths (e.g. ['/', '/blog'])
 */
export async function triggerRevalidate(paths: string[]): Promise<boolean> {
  if (!paths || paths.length === 0) return true;

  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.warn("[revalidate] No authenticated user found to trigger revalidation.");
      return false;
    }

    // Get the current user's ID token (forces refresh if expired)
    const idToken = await currentUser.getIdToken(true);

    const response = await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ paths }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[revalidate] Revalidation failed:", response.status, errorData);
      return false;
    }

    const data = await response.json();
    console.log("[revalidate] Revalidation successful:", data);
    return true;
  } catch (err) {
    console.error("[revalidate] Error triggering revalidation:", err);
    return false;
  }
}
