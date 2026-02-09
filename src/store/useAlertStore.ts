import { create } from 'zustand';

interface AlertState {
    show: boolean;
    message: string;
    type: 'success' | 'error';
    showAlert: (message: string, success: boolean) => void;
    hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    show: false,
    message: '',
    type: 'success',
    showAlert: (message: string, success: boolean) => {
        set({ show: true, message, type: success ? 'success' : 'error' });
    },
    hideAlert: () => {
        set({ show: false });
    },
}));

// Export hook for easy usage
export const useAlert = () => {
    const showAlert = useAlertStore((state) => state.showAlert);
    return { showAlert };
};
