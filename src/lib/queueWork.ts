import { apiGet } from "@/lib/api";

/**
 * Triggers the background queue worker.
 *
 * TODO: This is a temporary workaround and will be removed once the backend
 * handles queue processing automatically. It is intentionally isolated here
 * so it can be deleted from a single place.
 *
 * @param locale - The current locale string (e.g. "en" | "ar")
 * @returns true if the request succeeded, false otherwise
 */
export async function triggerQueueWork(locale: string): Promise<boolean> {
  try {
    await apiGet("/queue-work", { locale });
    console.log("✅ /queue-work triggered");
    return true;
  } catch (err) {
    console.error("❌ /queue-work failed:", err);
    return false;
  }
}
