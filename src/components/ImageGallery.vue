<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["deleteImage"]);
</script>

<template>
  <div class="row q-col-gutter-md">
    <div
      v-for="(image, index) in images"
      :key="index"
      class="col-12 col-sm-6 col-md-4"
      style="position: relative"
    >
      <q-card class="overflow-hidden">
        <q-img :src="image" :alt="'Imagen ' + (index + 1)" class="card-img">
          <template #default>
            <div
              class="absolute-full bg-opacity-50 row justify-end items-start q-pa-sm"
              style="opacity: 0; transition: opacity 0.3s"
              @mouseover="(e) => (e.currentTarget.style.opacity = 1)"
              @mouseleave="(e) => (e.currentTarget.style.opacity = 0)"
            >
              <q-btn
                dense
                round
                flat
                icon="download"
                color="white"
                class="q-mr-sm"
                :href="image"
                target="_blank"
              />
              <q-btn
                dense
                round
                flat
                icon="delete"
                color="negative"
                @click="emit('deleteImage', image)"
              />
            </div>
          </template>
        </q-img>
      </q-card>
    </div>
  </div>
</template>

<style scoped>
.card-img {
  transition: opacity 0.3s;
}

.card-img:hover {
  filter: brightness(0.9);
}
</style>
