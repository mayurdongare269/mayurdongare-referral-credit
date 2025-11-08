import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  referralCode: string;
  credits: number;
  referredUsers: number;
  convertedUsers: number;
  hasPurchased: boolean;
  email?: string;
  name?: string;
}

interface UserStore {
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  setUserData: (data: UserData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateCredits: (credits: number) => void;
  incrementCredits: (amount: number) => void;
  markAsPurchased: () => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      userData: null,
      loading: false,
      error: null,
      
      setUserData: (data) => set({ userData: data, error: null }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
      updateCredits: (credits) =>
        set((state) => ({
          userData: state.userData ? { ...state.userData, credits } : null,
        })),
      
      incrementCredits: (amount) =>
        set((state) => ({
          userData: state.userData
            ? { ...state.userData, credits: state.userData.credits + amount }
            : null,
        })),
      
      markAsPurchased: () =>
        set((state) => ({
          userData: state.userData
            ? { ...state.userData, hasPurchased: true }
            : null,
        })),
      
      clearUserData: () => set({ userData: null, error: null }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ userData: state.userData }),
    }
  )
);
