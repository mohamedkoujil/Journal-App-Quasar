import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { FirebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(FirebaseAuth, googleProvider);
    const credentials = GoogleAuthProvider.credentialFromResult(result);
    const { displayName, email, photoURL, uid } = result.user;
    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    return {
      ok: false,
      errorCode,
      errorMessage,
    };
  }
};

export const registerUserWithPassword = async ({
  email,
  password,
  displayName,
  photoURL,
}) => {
  try {
    const resp = await createUserWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    const { uid } = resp.user;

    await updateProfile(resp.user, { displayName, photoURL });

    return { ok: true, uid, photoURL, email, displayName };
  } catch (error) {
    return { ok: false, errorMessage: error.message };
  }
};

export const loginWithEmailPassword = async ({ email, password }) => {
  try {
    const resp = await signInWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    const { uid, displayName, photoURL } = resp.user;
    return { ok: true, uid, displayName, photoURL, email };
  } catch (error) {
    error;
    return { ok: false, errorMessage: error.message };
  }
};

// Logout function
export const logoutFirebase = async () => {
  return await FirebaseAuth.signOut();
};
