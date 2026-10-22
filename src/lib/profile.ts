import { defaultCountries, parseCountry } from "react-international-phone";
import { apiGet, apiPost } from "@/lib/api";
import { setUserProfile } from "@/lib/auth";
import type { QuestionSessionType } from "@/hooks/useUserSession";

/** File stored on the backend (Spatie media). */
export interface ProfileMedia {
  id: number;
  url: string;
  file_name?: string;
  mime_type?: string;
  size?: number;
}

/** Shape returned by GET /users/profile (ProfileResource). */
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  phone_code: string;
  locale: string;
  linkedin_url: string | null;
  job_title: string | null;
  years_of_experience: number | null;
  contact_email: string | null;
  contact_phone: string | null;
  location: string | null;
  cv: ProfileMedia | null;
  certificates: ProfileMedia[];
  has_active_subscription: boolean;
  question_session_type: QuestionSessionType;
  total_views: number;
  cv_downloads: number;
  questions_answered: number;
}

export interface ProfileInfoPayload {
  job_title?: string | null;
  years_of_experience?: number | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  location?: string | null;
}

export interface DocumentsPayload {
  cv?: File;
  addCertificates?: File[];
  deleteCertificates?: number[];
  /** `undefined` = leave unchanged, `""` or `null` = clear. */
  linkedinUrl?: string | null;
  /** Required by the backend when replacing the CV resets the bot flow. */
  confirmReset?: boolean;
}

/**
 * Session states where replacing the CV restarts the AI questions and takes the bot offline.
 * Keep in sync with QuestionSessionService::RESET_REQUIRED_STATES on the backend.
 */
export const CV_RESET_STATES: QuestionSessionType[] = [
  "static_questions",
  "ai_generation_failed",
  "ai_followup",
  "completed",
];

/** States where background jobs are running and the CV cannot be replaced. */
export const CV_BUSY_STATES: QuestionSessionType[] = [
  "summarizing_files",
  "generating_ai_questions",
];

function unwrap(response: { data: any }): UserProfile {
  const profile = response.data?.data as UserProfile;
  if (profile) setUserProfile(profile);
  return profile;
}

export async function fetchProfile(locale: string): Promise<UserProfile> {
  return unwrap(await apiGet("/users/profile", { locale }));
}

export async function updateProfileInfo(
  payload: ProfileInfoPayload,
  locale: string
): Promise<UserProfile> {
  return unwrap(await apiPost("/users/profile/info", payload, { locale }));
}

export async function updateDocuments(
  payload: DocumentsPayload,
  locale: string
): Promise<UserProfile> {
  const formData = new FormData();

  if (payload.cv) formData.append("cv", payload.cv);
  payload.addCertificates?.forEach((file) => formData.append("add_certificates[]", file));
  payload.deleteCertificates?.forEach((id) => formData.append("delete_certificates[]", String(id)));
  if (payload.linkedinUrl !== undefined) formData.append("linkedin_url", payload.linkedinUrl ?? "");
  if (payload.confirmReset) formData.append("confirm_reset", "1");

  return unwrap(
    await apiPost("/users/profile/documents", formData, {
      locale,
      headers: { "Content-Type": "multipart/form-data" },
    })
  );
}

/**
 * Converts the account phone_code to a dial code.
 * The backend stores the country ISO code (e.g. "sa"), but a numeric dial code
 * ("966" / "+966") is handled too.
 */
export function dialCodeFor(phoneCode: string | null | undefined): string {
  const code = (phoneCode || "").trim();
  if (!code) return "";
  if (/^\+?\d+$/.test(code)) return code.replace("+", "");

  const country = defaultCountries
    .map((c) => parseCountry(c))
    .find((c) => c.iso2 === code.toLowerCase());
  return country?.dialCode ?? "";
}

/** Account phone in international format, e.g. "+966551234567". */
export function accountPhone(profile: Pick<UserProfile, "phone" | "phone_code"> | null): string {
  if (!profile?.phone) return "";
  const local = profile.phone.replace(/\D/g, "").replace(/^0+/, "");
  const dialCode = dialCodeFor(profile.phone_code);
  if (!dialCode) return local;
  // Avoid doubling the dial code if the stored phone already contains it
  return `+${local.startsWith(dialCode) && local.length > 10 ? local : dialCode + local}`;
}

export function formatFileSize(bytes?: number): string {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function mediaFileName(media: ProfileMedia | null | undefined): string {
  if (!media) return "";
  if (media.file_name) return media.file_name;
  return decodeURIComponent(media.url.split("/").pop()?.split("?")[0] || "file");
}

/** Extracts the API error message from an axios error. */
export function apiErrorMessage(error: any, fallback: string): string {
  return error?.response?.data?.message || fallback;
}

export const LINKEDIN_URL_REGEX = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/.+/i;
