<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm } from "../../composables/useForm";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// Form handling
const {
  formState,
  isFormValid,
  displayNameValid,
  photoURLValid,
  emailValid,
  passwordValid,
  formValidation,
  submitForm,
  formSubmitted,
  clearValidations,
} = useForm(
  {
    email: "",
    displayName: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  },
  {
    displayName: [() => true, "displayName is required"],
    photoURL: [() => true, "Photo URL is required"],
    email: [
      (val) => val.length > 0 && val.includes("@"),
      "Please enter a valid email",
    ],
    password: [(val) => val.length > 0, "Password is required"],
  }
);

const isSubmitting = ref(false);
const errorMessage = ref("");

const onSubmit = async () => {
  submitForm();

  if (!isFormValid.value) return;
  isSubmitting.value = true;

  const result = await authStore.registerUser({ ...formState });
  if (result?.error) {
    errorMessage.value = result.error;
  } else {
    const loginResult = await authStore.loginWithEmail({
      email: formState.email,
      password: formState.password,
    });
    if (loginResult?.error) {
      errorMessage.value = loginResult.error;
    } else {
      router.push({ name: "Journal" });
    }
  }

  isSubmitting.value = false;
};

const onGoogleSignIn = async () => {
  clearValidations();
  submitForm();

  isSubmitting.value = true;

  const result = await authStore.loginWithGoogle();

  if (result?.error) {
    errorMessage.value = result.error;
  } else {
    router.push({ name: "Journal" });
  }

  isSubmitting.value = false;
};

const goToLogin = () => {
  router.push({ name: "Login" });
};
</script>

<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md auth-form" style="max-width: 400px">
      <q-form @submit="onSubmit" class="q-gutter-md">
        <q-input
          filled
          v-model="formState.displayName"
          label="Display Name"
          lazy-rules
          :error="formSubmitted && formValidation.displayNameValid !== null"
          :error-message="displayNameValid"
        />
        <!-- TODO Change to a file input -->
        <q-input
          filled
          v-model="formState.photoURL"
          label="Photo URL"
          lazy-rules
          :error="formSubmitted && formValidation.photoURLValid !== null"
          :error-message="photoURLValid"
        />

        <q-input
          filled
          v-model="formState.email"
          label="Email *"
          hint="example@example.com"
          lazy-rules
          :error="formSubmitted && formValidation.emailValid !== null"
          :error-message="emailValid"
        />

        <q-input
          filled
          type="password"
          v-model="formState.password"
          label="Password *"
          lazy-rules
          :error="formSubmitted && formValidation.passwordValid !== null"
          :error-message="passwordValid"
        />

        <q-input
          filled
          type="password"
          v-model="formState.confirmPassword"
          label="Confirm Password *"
          lazy-rules
          :error="
            formSubmitted && formState.password !== formState.confirmPassword
          "
          error-message="Passwords do not match"
        />

        <div
          class="q-mt-md"
          style="display: flex; gap: 10px; justify-content: flex-end"
        >
          <q-btn
            label="Register"
            type="submit"
            color="primary"
            :disabled="isSubmitting"
          />
          <q-btn
            label="Google"
            color="secondary"
            @click="onGoogleSignIn"
            :loading="isSubmitting"
          />
        </div>

        <div
          class="q-mt-md"
          style="display: flex; gap: 10px; justify-content: flex-end"
        >
          <q-btn
            flat
            label="Already have an account? Login"
            @click="goToLogin"
          />
        </div>

        <div v-if="errorMessage" class="q-mt-md">
          <q-banner color="negative" class="q-pa-none">
            <span>{{ errorMessage }}</span>
          </q-banner>
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<style scoped>
.auth-form {
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  max-width: 400px;
  width: 100%;
}
</style>
