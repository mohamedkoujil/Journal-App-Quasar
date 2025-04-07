<script setup>
import { ref, watch, computed } from "vue";
import { useJournalStore } from "stores/journal";
import { date } from "quasar";
import { Notify } from "quasar";
import { useQuasar } from "quasar";
import ImageGallery from "src/components/ImageGallery.vue";

const journalStore = useJournalStore();
const { isSaving, active: note } = journalStore;
const $q = useQuasar();
const imageUrls = ref([]);
watch(
  () => journalStore.active?.imageUrls,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      imageUrls.value = newValue;
    }
  },
  { immediate: true }
);

const dateString = computed(() => {
  if (!note) return "";
  const dateObj = new Date(note.date);
  return date.formatDate(dateObj, "DD-MM-YYYY");
});
const onSave = async () => {
  await journalStore.startSavingNote();
  Notify.create({
    message: journalStore.messageSaved,
    color: "positive",
  });
};

const onDelete = () => {
  $q.dialog({
    title: "¿Estás seguro?",
    message: "No podrás revertir esta acción",
    cancel: true,
    persistent: true,
    ok: {
      label: "Sí, borrar",
      color: "negative",
    },
  }).onOk(async () => {
    try {
      await journalStore.startDeletingNote();
      Notify.create({
        message: journalStore.messageSaved,
        color: "blue-10",
      });
    } catch (error) {
      Notify.create({
        message: "Error al borrar la nota",
        color: "negative",
      });
      return;
    }
  });
};

const onUpload = (event) => {
  const uploadedFiles = event.target.files;
  if (uploadedFiles.length > 0) {
    journalStore.startUploadingFiles(uploadedFiles);
  }
};
</script>

<template>
  <q-page padding class="q-col-gutter-md" v-if="note">
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center">
        <q-icon name="today" size="2rem" class="q-mr-sm" />
        <span class="text-h6">{{ dateString }}</span>
      </div>

      <div class="row items-center">
        <q-btn
          flat
          round
          icon="upload"
          @click="$refs.fileInput.click()"
          :disable="isSaving"
          class="q-mr-sm"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          ref="fileInput"
          class="hidden"
          @change="onUpload"
        />
        <q-btn
          color="primary"
          icon="save"
          label="Guardar"
          :disable="isSaving"
          @click="onSave"
        />
      </div>
    </div>

    <q-input
      filled
      v-model="journalStore.active.title"
      label="Título"
      class="q-mb-md"
      :disable="isSaving"
    />
    <q-input
      filled
      v-model="journalStore.active.body"
      type="textarea"
      label="¿Qué pasó hoy?"
      autogrow
      :disable="isSaving"
    />

    <div class="row justify-end q-mt-md">
      <q-btn
        color="negative"
        icon="delete"
        label="Borrar"
        @click="onDelete"
        :disable="isSaving"
      />
    </div>

    <ImageGallery
      v-if="imageUrls"
      :images="imageUrls"
      @delete-image="journalStore.deleteImg"
    />
  </q-page>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>
