"use client";

import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "@/lib/firebase";
import { getUserProfile } from "@/lib/auth";

/**
 * Possible values for question_session_type in Firebase.
 * Extend this union when new states are added on the backend.
 */
export type QuestionSessionType =
  | "upload_file"
  | "summarizing_files"
  | "failed_summarizing_files"
  | "static_questions"
  | "generating_ai_questions"
  | "ai_generation_failed"
  | "ai_followup"
  | "completed"
  | null;

interface UseUserSessionResult {
  sessionType: QuestionSessionType;
  loading: boolean;
  error: string | null;
}

/**
 * Subscribes to `users/{uid}/question_session_type` in Firebase Realtime DB
 * and returns the current value in real time.
 *
 * Read-only: writing the initial value is the responsibility of the
 * subscription/payment flow, not this hook.
 *
 * Expected profile shape: { id: string | number, ... }
 */
export function useUserSession(): UseUserSessionResult {
  const [sessionType, setSessionType] = useState<QuestionSessionType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profile = getUserProfile();
    const uid = profile?.id;

    if (!uid) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const dbRef = ref(db, `users/${uid}/question_session_type`);

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const value = snapshot.val() as QuestionSessionType;
        setSessionType(value);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firebase listener error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      off(dbRef, "value", unsubscribe);
    };
  }, []);

  return { sessionType, loading, error };
}
