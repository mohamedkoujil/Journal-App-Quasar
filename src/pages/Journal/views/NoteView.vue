<script setup>
import { ref, watch, computed } from "vue";
import { useJournalStore } from "stores/journal";
import { date } from "quasar";
import { Notify } from "quasar";
import { useQuasar } from "quasar";

const journalStore = useJournalStore();
const $q = useQuasar();

const note = journalStore.active;

const title = ref("");
const body = ref("");
const isSaving = ref(false);

watch(note, (newNote) => {
  title.value = newNote?.title || "";
  body.value = newNote?.body || "";
});

const dateString = computed(() => {
  return note.value
    ? date.formatDate(note.value.date, "dddd, DD MMMM YYYY")
    : "";
});

const onSave = async () => {
  isSaving.value = true;
  await journalStore.startSavingNote(title.value, body.value);
  isSaving.value = false;
  Notify.create({
    message: "Nota guardada con éxito",
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
    await journalStore.startDeletingNote();
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
      <div>
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
      v-model="title"
      label="Título"
      class="q-mb-md"
      :disable="isSaving"
    />
    <q-input
      filled
      v-model="body"
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

    <div v-if="note.imageUrls?.length" class="row q-col-gutter-md q-mt-md">
      <q-img
        v-for="(img, index) in note.imageUrls"
        :key="index"
        :src="img"
        class="col-6 col-md-4 col-lg-3"
        :ratio="4 / 3"
        spinner-color="primary"
      />
    </div>
  </q-page>
</template>

<style scoped>
.hidden {
  display: none;
}
</style>
