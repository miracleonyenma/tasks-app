import { create } from "zustand";
import { User } from "firebase/auth";

type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
