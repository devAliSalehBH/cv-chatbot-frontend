import { create } from 'zustand';

export type Step =
  | "upload-resume"
  | "upload-certificates"
  | "linkedin-profile"
  | "answer-questions";

export type QuestionType = "checkbox" | "radio" | "text";

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  subtitle?: string;
  options?: string[]; // Used for checkbox and radio
}

export interface CreateBotState {
  // Phase 1: Upload Info
  currentStep: Step;
  resume: File | null;
  certificates: File[];
  linkedinUrl: string;

  // Phase 2: Answer Questions
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, any>; // questionId -> answer

  // Actions
  setStep: (step: Step) => void;
  setResume: (file: File | null) => void;
  addCertificates: (files: File[]) => void;
  removeCertificate: (index: number) => void;
  setLinkedinUrl: (url: string) => void;

  // Phase 2 Actions
  setAnswer: (questionId: string, answer: any) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
}

// Generate 15 Mock Questions
const MOCK_QUESTIONS: Question[] = [
  {
    id: "q1",
    type: "checkbox",
    question: "What are your top 3 technical skills?",
    subtitle: "Select the option that best describes your situation",
    options: [
      "Frontend Development (React, Vue, Angular)",
      "Backend Development (Node.js, Python, Java)",
      "Mobile Development (iOS, Android)",
      "Cloud Infrastructure (AWS, Azure, GCP)",
      "Data Science & Machine Learning"
    ],
  },
  {
    id: "q2",
    type: "radio",
    question: "What is your primary technical skill?",
    subtitle: "Select the option that best describes your situation",
    options: [
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "DevOps / SRE",
      "UI/UX Design"
    ]
  },
  {
    id: "q3",
    type: "text",
    question: "Describe yourself in your own words",
    subtitle: "Tell us about yourself and your technical strengths",
  },
  // The rest are fillers to reach 15 questions
  ...Array.from({ length: 11 }).map((_, i) => ({
    id: `q${i + 4}`,
    type: (i % 2 === 0 ? "radio" : "checkbox") as QuestionType,
    question: `Mock Question ${i + 4} - Select your preference`,
    subtitle: "Select the option that best describes your situation",
    options: [
      "Option A for this question",
      "Option B for this question",
      "Option C for this question",
      "Option D for this question",
    ]
  })),
  {
    id: "q15",
    type: "text",
    question: "Final Question: What are your career goals?",
    subtitle: "Briefly explain what you aim to achieve",
  }
];

export const useCreateBotStore = create<CreateBotState>((set) => ({
  currentStep: "upload-resume",
  resume: null,
  certificates: [],
  linkedinUrl: "",

  questions: MOCK_QUESTIONS,
  currentQuestionIndex: 0,
  answers: {},

  setStep: (step) => set({ currentStep: step }),
  setResume: (file) => set({ resume: file }),
  addCertificates: (files) =>
    set((state) => ({ certificates: [...state.certificates, ...files] })),
  removeCertificate: (index) =>
    set((state) => ({
      certificates: state.certificates.filter((_, i) => i !== index),
    })),
  setLinkedinUrl: (url) => set({ linkedinUrl: url }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),
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
}));
