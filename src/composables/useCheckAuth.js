import { onAuthStateChanged } from "firebase/auth";
import { ref, onMounted } from "vue";
import { useAuthStore } from "../stores/auth"; // Importa el store de autenticación
import { FirebaseAuth } from "../firebase/config";

export function useCheckAuth() {
  const authStore = useAuthStore();
  const status = ref(authStore.status);

  onMounted(() => {
    onAuthStateChanged(FirebaseAuth, async (user) => {
      if (!user) {
        authStore.logout();
        status.value = "unauthenticated";
      } else {
        const { displayName, email, photoURL, uid } = user;
        authStore.login({ displayName, email, photoURL, uid });
        status.value = "authenticated";
        authStore.startLoadingNotes(); // Carga notas si es necesario
      }
    });
  });

  return status;
}
