import { computed, reactive, ref, watch, watchEffect } from "vue";

export const useForm = (initialForm = {}, formValidations = {}) => {
  const formState = reactive({ ...initialForm });
  const formValidation = reactive({});
  const formSubmitted = ref(false);

  watch(
    () => ({ ...initialForm }),
    () => {
      Object.assign(formState, initialForm);
    }
  );

  const isFormValid = computed(() => {
    return Object.values(formValidation).every((v) => v === null);
  });

  const onInputChange = (name, value) => {
    formSubmitted.value = false;
    formState[name] = value;
  };

  const onResetForm = () => {
    Object.assign(formState, initialForm);
  };

  const createValidators = () => {
    for (const field in formValidations) {
      const [fn, errorMessage] = formValidations[field];
      formValidation[`${field}Valid`] = fn(formState[field])
        ? null
        : errorMessage;
    }
  };

  const submitForm = () => {
    formSubmitted.value = true;
  };

  watchEffect(() => {
    createValidators();
    console.log(formValidation);
  });

  watch(formState, () => {
    formSubmitted.value = false;
  });

  const clearValidations = () => {
    for (const field in formValidations) {
      formValidation[`${field}Valid`] = null;
    }
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    isFormValid,
    ...formValidation,
    formValidation,
    formSubmitted,
    submitForm,
    clearValidations,
  };
};
