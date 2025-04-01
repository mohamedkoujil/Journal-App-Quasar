<template>
  <q-page class="flex flex-center">
    <div class="q-pa-md" style="max-width: 400px">
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          filled
          v-model="formState.name"
          label="Your name *"
          hint="Name and surname"
          lazy-rules
          :error="nameValid !== null"
          :error-message="nameValid"
        />

        <q-input
          filled
          type="password"
          v-model="formState.password"
          label="Password *"
          lazy-rules
          :error="passwordValid !== null"
          :error-message="passwordValid"
        />

        <div>
          <q-btn label="Submit" type="submit" color="primary" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
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

defineOptions({
  name: "LoginPage",
});

const {
  formState,
  onInputChange,
  onResetForm,
  isFormValid,
  nameValid,
  passwordValid,
} = useForm(
  { name: "", password: "" },
  {
    name: [(val) => val.length > 0, "Please type something"],
    password: [
      (val) => val.length > 0,
      "Please type a password",
      (val) => val.length > 5,
      "Password must be at least 6 characters long",
    ],
  }
);

const onSubmit = () => {
  if (!isFormValid.value) return;
  console.log("Form Submitted:", formState);
};

const onReset = () => {
  onResetForm();
};
</script>
