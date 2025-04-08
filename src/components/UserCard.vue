<script setup>
import { defineProps } from "vue";

// Props del componente
const props = defineProps({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
    default: "",
  },
});

// Imagen por defecto
const defaultPfp =
  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1743788189~exp=1743791789~hmac=f73890cca01d7c06e339adb28a8009613866c0161b10f49164be32629add42d8&w=740";
</script>

<template>
  <div class="user-card">
    <img
      :src="photoURL || defaultPfp"
      :alt="displayName"
      class="user-card__photo"
    />
    <div class="user-card__info">
      <div class="user-card__name">{{ displayName }}</div>
      <div class="user-card__email">{{ email }}</div>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
  width: 90%;
  height: 60px;
  margin: 1em;
  z-index: 100;
}

.user-card__photo {
  width: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-card__info {
  display: flex;
  flex-direction: column;
}

.user-card__name {
  font-size: 1.2em;
  font-weight: bold;
}

.user-card__email {
  font-size: 1em;
  color: #777;
}
</style>
