<script setup>
import { useRouter } from "vue-router";
import { useCheckAuth } from "src/composables/useCheckAuth";
import { onMounted } from "vue";

const router = useRouter();

onMounted(async () => {
  const status = await useCheckAuth();
  if (status === "authenticated") {
    router.replace({ name: "Journal" });
  } else {
    router.replace({ name: "Login" });
  }
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center">
        <q-spinner color="primary" size="50px" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
