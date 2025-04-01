import { computed, reactive, ref, watch } from "vue";

export const useForm = (initialForm = {}, formValidations = {}) => {
  const formState = reactive({ ...initialForm });
  const formValidation = reactive({});
  const formSubmitted = ref(false);

  watch(
    formState,
    () => {
      createValidators();
    },
    { deep: true }
  );

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
    console.log(value);
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

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,
    isFormValid,
    ...formValidation,
    submitForm,
  };
};
