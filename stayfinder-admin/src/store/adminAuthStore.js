// src/store/adminAuthStore.js
import { create } from "zustand";

export const useAdminStore = create((set) => ({
  admin: null,
  token: localStorage.getItem("admin-token") || "",

  setAdmin: (admin, token) => {
    localStorage.setItem("admin-token", token);
    set({ admin, token });
  },

  logout: () => {
    localStorage.removeItem("admin-token");
    set({ admin: null, token: "" });
  },
}));
