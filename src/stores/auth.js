import { defineStore } from "pinia";
import {
  signInWithGoogle,
  registerUserWithPassword,
  loginWithEmailPassword,
  logoutFirebase,
} from "../firebase/providers";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    status: "checking", // 'checking' | 'authenticated' | 'unauthenticated'
    user: null,
  }),
  actions: {
    async loginWithGoogle() {
      const result = await signInWithGoogle();
      if (!result.ok) {
        return { error: result.errorMessage };
      }
      this.status = "authenticated";
      this.user = result;
    },

    async registerUser(credentials) {
      const result = await registerUserWithPassword(credentials);
      if (!result.ok) {
        return { error: result.errorMessage };
      }
      this.status = "authenticated";
      this.user = result;
    },

    async loginWithEmail(credentials) {
      const result = await loginWithEmailPassword(credentials);
      if (!result.ok) {
        return { error: result.errorMessage };
      }
      this.status = "authenticated";
      this.user = result;
    },

    async logout() {
      await logoutFirebase();
      this.status = "unauthenticated";
      this.user = null;
    },
  },
});
