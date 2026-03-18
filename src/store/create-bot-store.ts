import { create } from 'zustand';

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
  options: QuestionOption[];
}

// ── Store ──────────────────────────────────────────────────────────────────────

export interface CreateBotState {
  // Phase 1: Upload Info
  currentStep: Step;
  resume: File | null;
  certificates: File[];
  linkedinUrl: string;

  // Phase 2: Answer Questions
  questions: Question[];
  currentQuestionIndex: number;

  // Actions
  setStep: (step: Step) => void;
  setResume: (file: File | null) => void;
  addCertificates: (files: File[]) => void;
  removeCertificate: (index: number) => void;
  setLinkedinUrl: (url: string) => void;

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
      questions: [],
      currentQuestionIndex: 0,
      isCreatingDone: false,
      isSharePhase: false,
    }),
}));
