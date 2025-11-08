import { create } from "zustand";

interface UserData {
  referralCode: string;
  credits: number;
  referredUsers: number;
  convertedUsers: number;
  hasPurchased: boolean;
}

interface UserStore {
  userData: UserData | null;
  loading: boolean;
  setUserData: (data: UserData) => void;
  setLoading: (loading: boolean) => void;
  updateCredits: (credits: number) => void;
  markAsPurchased: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  loading: false,
  setUserData: (data) => set({ userData: data }),
  setLoading: (loading) => set({ loading }),
  updateCredits: (credits) =>
    set((state) => ({
      userData: state.userData ? { ...state.userData, credits } : null,
    })),
  markAsPurchased: () =>
    set((state) => ({
      userData: state.userData ? { ...state.userData, hasPurchased: true } : null,
    })),
}));