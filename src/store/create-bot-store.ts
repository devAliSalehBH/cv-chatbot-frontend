import { create } from 'zustand';
import type { ProfileMedia } from '@/lib/profile';

export type Step =
  | "upload-resume"
  | "upload-certificates"
  | "linkedin-profile"
  | "processing"
  | "answer-questions";

export type QuestionType = "checkbox" | "radio" | "text";

// ── API question shape ─────────────────────────────────────────────────────────

export interface QuestionOption {
  id: number;
  ar: string;
  en: string;
  value: string;
  order: number;
}

export interface Question {
  id: number;
  type: QuestionType;
  question_ar: string;
  question_en: string;
  order: number;
  is_ai?: boolean;
  is_ai_question?: boolean;
  options: QuestionOption[];
}

// ── Store ──────────────────────────────────────────────────────────────────────

export interface CreateBotState {
  // Phase 1: Upload Info
  currentStep: Step;
  resume: File | null;
  certificates: File[];
  linkedinUrl: string;

  // Files already stored on the backend (e.g. uploaded from the settings page)
  existingCv: ProfileMedia | null;
  existingCertificates: ProfileMedia[];
  deletedCertificateIds: number[];

  // Phase 2: Answer Questions
  questions: Question[];
  currentQuestionIndex: number;

  // Actions
  setStep: (step: Step) => void;
  setResume: (file: File | null) => void;
  addCertificates: (files: File[]) => void;
  removeCertificate: (index: number) => void;
  setLinkedinUrl: (url: string) => void;
  hydrateFromProfile: (profile: {
    cv?: ProfileMedia | null;
    certificates?: ProfileMedia[];
    linkedin_url?: string | null;
  }) => void;
  removeExistingCertificate: (id: number) => void;

  // Phase 2 Actions
  setQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  isCreatingDone: boolean;
  setIsCreatingDone: (val: boolean) => void;

  isSharePhase: boolean;
  setIsSharePhase: (val: boolean) => void;

  reset: () => void;
}

export const useCreateBotStore = create<CreateBotState>((set) => ({
  currentStep: "upload-resume",
  resume: null,
  certificates: [],
  linkedinUrl: "",

  existingCv: null,
  existingCertificates: [],
  deletedCertificateIds: [],

  questions: [],
  currentQuestionIndex: 0,
  isCreatingDone: false,
  setIsCreatingDone: (val) => set({ isCreatingDone: val }),

  isSharePhase: false,
  setIsSharePhase: (val) => set({ isSharePhase: val }),

  setStep: (step) => set({ currentStep: step }),
  setResume: (file) => set({ resume: file }),
  addCertificates: (files) =>
    set((state) => ({ certificates: [...state.certificates, ...files] })),
  removeCertificate: (index) =>
    set((state) => ({
      certificates: state.certificates.filter((_, i) => i !== index),
    })),
  setLinkedinUrl: (url) => set({ linkedinUrl: url }),
  hydrateFromProfile: (profile) =>
    set((state) => ({
      existingCv: profile.cv ?? null,
      existingCertificates: (profile.certificates ?? []).filter(
        (cert) => !state.deletedCertificateIds.includes(cert.id)
      ),
      // Forget removals of certificates that no longer exist on the server
      deletedCertificateIds: state.deletedCertificateIds.filter((id) =>
        (profile.certificates ?? []).some((cert) => cert.id === id)
      ),
      // Don't override what the user already typed in this session
      linkedinUrl: state.linkedinUrl || profile.linkedin_url || "",
    })),
  removeExistingCertificate: (id) =>
    set((state) => ({
      existingCertificates: state.existingCertificates.filter((cert) => cert.id !== id),
      deletedCertificateIds: [...state.deletedCertificateIds, id],
    })),

  setQuestions: (questions) => set({ questions, currentQuestionIndex: 0 }),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length - 1
      ),
    })),
  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),

  reset: () =>
    set({
      currentStep: "upload-resume",
      resume: null,
      certificates: [],
      linkedinUrl: "",
      existingCv: null,
      existingCertificates: [],
      deletedCertificateIds: [],
      questions: [],
      currentQuestionIndex: 0,
      isCreatingDone: false,
      isSharePhase: false,
    }),
}));
