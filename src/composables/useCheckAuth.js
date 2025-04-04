import { onAuthStateChanged } from "firebase/auth";
import { FirebaseAuth } from "../firebase/config";
import { useAuthStore } from "../stores/auth";

export const useCheckAuth = () => {
  const authStore = useAuthStore();

  return new Promise((resolve) => {
    onAuthStateChanged(FirebaseAuth, (user) => {
      if (!user) {
        authStore.status = "unauthenticated";
        authStore.user = null;
        resolve("unauthenticated");
      } else {
        const { uid, displayName, email, photoURL } = user;
        authStore.status = "authenticated";
        authStore.user = { uid, displayName, email, photoURL };
        resolve("authenticated");
      }
    });
  });
};
