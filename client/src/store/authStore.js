import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("stayfinder-user")) || null,
  token: localStorage.getItem("stayfinder-token") || "",
  mobile: "",

  setMobile: (mobile) => set({ mobile }),

  setUser: (user, token) => {
    if (!user || !token) return;

    localStorage.setItem("stayfinder-user", JSON.stringify(user));
    localStorage.setItem("stayfinder-token", token);

    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("stayfinder-user");
    localStorage.removeItem("stayfinder-token");
    set({ user: null, token: "", mobile: "" });
  },
}));
