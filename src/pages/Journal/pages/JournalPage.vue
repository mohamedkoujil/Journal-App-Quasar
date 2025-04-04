<script setup>
import { useJournalStore } from "stores/journal";
import NothingSelectedView from "../views/NothingSelectedView.vue";
import NoteView from "../views/NoteView.vue";

const journalStore = useJournalStore();
</script>

<template>
  <q-layout
    ><q-page
      v-if="!journalStore.active"
      class="flex flex-center"
      style="min-height: 100vh"
    >
      <NothingSelectedView />
    </q-page>
    <q-page v-else> <NoteView /> </q-page
  ></q-layout>
</template>

<style scoped></style>
