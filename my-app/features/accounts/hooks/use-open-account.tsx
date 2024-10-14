import { create } from 'zustand'; // Assuming you're using Zustand for state management

type OpenAccountState = { 
    id?: string;
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
};

export const useOpenAccount = create<OpenAccountState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
}));
