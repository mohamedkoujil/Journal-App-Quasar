<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "stores/auth";
import EssentialLink from "components/EssentialLink.vue";
import UserCard from "src/components/UserCard.vue";

defineOptions({
  name: "MainLayout",
});

const leftDrawerOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();
console.log(authStore.user);
const linksList = [
  {
    title: "example",
    caption: "example",
    icon: "bookmark_border",
    link: "https://quasar.dev",
  },
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const handleLogout = async () => {
  await authStore.logout();
  router.push({ name: "Login" });
};
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

        <!-- Logout Icon -->
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

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
/* Add custom styles here if needed */
</style>
