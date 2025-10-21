import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAuthstore = create((set) => ({
  user: null,
  islogin: false,
  islogout: false,
  ischeckingauth: true,
  issignup: false,
  searchHistory: [], // ✅ store user's search history

  // --- SIGNUP ---
  Oursignup: async (credentials) => {
    set({ issignup: true });
    try {
      const response = await axios.post("/api/v1/auth/signup", credentials);
      set({ user: response.data.user, issignup: false });
      toast.success("Signup successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Signup failed!");
      set({ issignup: false });
    }
  },

  // --- LOGIN ---
  login: async (credentials) => {
    set({ islogin: true });
    try {
      const res = await axios.post("/api/v1/auth/login", credentials);
      set({ user: res.data.user, islogin: false });
      toast.success(`Welcome ${res.data.user.username}!`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Login failed!");
      set({ islogin: false, user: null });
    }
  },

  // --- LOGOUT ---
  logout: async () => {
    set({ islogout: true });
    try {
      await axios.post("/api/v1/auth/logout");
      set({ user: null, islogout: false, searchHistory: [] });
      toast.success("Logged out successfully!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Logout failed!");
      set({ islogout: false });
    }
  },

  // --- AUTH CHECK ---
  authcheck: async () => {
    set({ ischeckingauth: true });
    try {
      const response = await axios.get("/api/v1/auth/authcheck", {
        withCredentials: true,
      });
      set({ user: response.data.user, ischeckingauth: false });
    } catch {
      set({ ischeckingauth: false, user: null });
    }
  },

  // --- FETCH SEARCH HISTORY ---
  // fetchSearchHistory: async () => {
  //   try {
  //     const response = await axios.get("/api/v1/search/history");
  //     set({ searchHistory: response.data.history });
  //   } catch (e) {
  //     console.error("Failed to fetch history:", e);
  //     set({ searchHistory: [] });
  //   }
  // },

  // // --- DELETE ITEM FROM HISTORY ---
  // removeHistoryItem: async (id) => {
  //   try {
  //     await axios.get(`/api/v1/search/searchhistsorydelete/${id}`);
  //     set((state) => ({
  //       searchHistory: state.searchHistory.filter((item) => item._id !== id),
  //     }));
  //     toast.success("Removed from history!");
  //   } catch (e) {
  //     console.error("Error deleting:", e);
  //     toast.error("Failed to delete item!");
  //   }
  // },
}));
