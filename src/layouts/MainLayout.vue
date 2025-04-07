<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/auth";
import { useJournalStore } from "stores/journal";
import EssentialLink from "components/EssentialLink.vue";
import UserCard from "src/components/UserCard.vue";
import { ref } from "vue";

const authStore = useAuthStore();
const journalStore = useJournalStore();
const router = useRouter();

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const handleLogout = async () => {
  await authStore.logout();
  journalStore.clearNotesLogout();
  router.push({ name: "Login" });
};

const handleActiveNote = (noteId) => {
  router.push({ name: "Journal" });
  journalStore.setActiveNote(noteId);
};

const handleNewNote = async () => {
  await journalStore.startNewNote();
};

onMounted(async () => {
  if (journalStore.notes.length === 0) {
    await journalStore.startLoadingNotes();
  }
});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Journal App </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="logout"
          aria-label="Logout"
          @click="handleLogout"
          class="q-ml-auto"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <UserCard
          :displayName="authStore.user.displayName"
          :email="authStore.user.email"
          :photoURL="authStore.user.photoURL"
          class="q-mb-md"
        />

        <q-item clickable v-ripple @click="handleNewNote">
          <q-item-section avatar>
            <q-icon name="note_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Nueva Nota</q-item-label>
          </q-item-section>
        </q-item>

        <EssentialLink
          v-for="note in journalStore.notes"
          :key="note.id"
          :title="note.title || 'Nota sin título'"
          :caption="new Date(note.date).toLocaleDateString()"
          @click="handleActiveNote(note)"
          icon="description"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
