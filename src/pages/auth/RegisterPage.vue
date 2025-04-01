<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <h3 class="text-center q-mb-md">Register</h3>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          v-model="formState.name"
          label="Full Name *"
          hint="Enter your full name"
          lazy-rules
          :error="nameValid !== null"
          :error-message="nameValid"
        />

        <q-input
          filled
          v-model="formState.email"
          label="Email *"
          hint="Enter your email address"
          lazy-rules
          :error="emailValid !== null"
          :error-message="emailValid"
        />

        <q-input
          filled
          type="password"
          v-model="formState.password"
          label="Password *"
          hint="Password must be at least 6 characters"
          lazy-rules
          :error="passwordValid !== null"
          :error-message="passwordValid"
        />

        <q-input
          filled
          type="password"
          v-model="formState.confirmPassword"
          label="Confirm Password *"
          hint="Re-enter your password"
          lazy-rules
          :error="confirmPasswordValid !== null"
          :error-message="confirmPasswordValid"
        />

        <div class="q-mt-md">
          <q-btn
            label="Register"
            type="submit"
            color="primary"
            :disable="!isFormValid"
          />
          <q-btn
            label="Reset"
            type="reset"
            color="secondary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { useForm } from "@/composables/useForm";
import { registerUserWithPassword } from "@/firebase/authMethods"; // Asegúrate de importar los métodos de Firebase

defineOptions({
  name: "RegisterPage",
});

const {
  formState,
  onInputChange,
  onResetForm,
  isFormValid,
  nameValid,
  emailValid,
  passwordValid,
  confirmPasswordValid,
} = useForm(
  { name: "", email: "", password: "", confirmPassword: "" },
  {
    name: [(val) => val.length > 0, "Please type your name"],
    email: [(val) => /.+@.+\..+/.test(val), "Please enter a valid email"],
    password: [
      (val) => val.length >= 6,
      "Password must be at least 6 characters long",
    ],
    confirmPassword: [
      (val) => val === formState.password,
      "Passwords do not match",
    ],
  }
);

const onSubmit = async () => {
  if (!isFormValid.value) return;

  const { name, email, password } = formState;

  const { ok, errorMessage } = await registerUserWithPassword({
    email,
    password,
    displayName: name,
  });

  if (ok) {
    console.log("Registration successful!");
    // Redirect to login or dashboard, for example
  } else {
    console.error("Registration failed:", errorMessage);
  }
};

const onReset = () => {
  onResetForm();
};
</script>
