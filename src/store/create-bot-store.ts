import { create } from 'zustand';

type Step = 'upload-resume' | 'upload-certificates' | 'linkedin-profile';

interface CreateBotState {
    currentStep: Step;
    resume: File | null;
    certificates: File[];
    linkedinUrl: string;

    setStep: (step: Step) => void;
    setResume: (file: File | null) => void;
    addCertificates: (files: File[]) => void;
    removeCertificate: (index: number) => void;
    setLinkedinUrl: (url: string) => void;
}

export const useCreateBotStore = create<CreateBotState>((set) => ({
    currentStep: 'upload-resume',
    resume: null,
    certificates: [],
    linkedinUrl: '',

    setStep: (step) => set({ currentStep: step }),
    setResume: (file) => set({ resume: file }),
    addCertificates: (files) =>
        set((state) => ({ certificates: [...state.certificates, ...files] })),
    removeCertificate: (index) =>
        set((state) => ({
            certificates: state.certificates.filter((_, i) => i !== index),
        })),
    setLinkedinUrl: (url) => set({ linkedinUrl: url }),
}));
