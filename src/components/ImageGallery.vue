<script setup>
import { defineProps } from "vue";

defineProps({
  images: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="row q-col-gutter-md">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="col-12 col-sm-6 col-md-4"
    >
      <q-card>
        <q-img :src="image" :alt="'Imagen ' + (index + 1)" />
      </q-card>
    </div>
  </div>
</template>
