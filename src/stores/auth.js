// stores/auth.js
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseAuth } from "../firebase/config";
import { fileUpload } from "../helpers/fileUpload";
import { signInWithGoogle } from "src/firebase/providers";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const status = ref("checking"); // 'authenticated', 'not-authenticated', 'checking'
  const errorMessage = ref("");

  const isAuthenticated = computed(() => status.value === "authenticated");

  const loginUser = async ({ email, password }) => {
    status.value = "checking";
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(
        FirebaseAuth,
        email,
        password
      );
      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      };
      status.value = "authenticated";
      errorMessage.value = "";
    } catch (error) {
      status.value = "not-authenticated";
      errorMessage.value = "Email o contraseña incorrectos";
    }
  };

  const registerUser = async ({ name, email, password }) => {
    status.value = "checking";
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(
        FirebaseAuth,
        email,
        password
      );

      await updateProfile(firebaseUser, {
        displayName: name,
        photoURL: null,
      });

      user.value = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: name,
        photoURL: null,
      };
      status.value = "authenticated";
      errorMessage.value = "";
    } catch (error) {
      status.value = "not-authenticated";
      errorMessage.value = error.message;
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      const imageUrl = await fileUpload(file);
      await updateProfile(FirebaseAuth.currentUser, {
        photoURL: imageUrl,
      });

      user.value.photoURL = imageUrl;
    } catch (error) {
      console.error("Error uploading profile image", error);
      errorMessage.value = "No se pudo subir la imagen de perfil";
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result.ok) {
        throw new Error(result.errorMessage);
      }
      status.value = "authenticated";
      user.value = result;
    } catch (error) {
      errorMessage.value = error.message;
    }
  };

  const logout = async () => {
    await signOut(FirebaseAuth);
    user.value = null;
    status.value = "not-authenticated";
  };

  return {
    user,
    status,
    errorMessage,
    isAuthenticated,
    loginUser,
    registerUser,
    uploadProfileImage,
    loginWithGoogle,
    logout,
  };
});
