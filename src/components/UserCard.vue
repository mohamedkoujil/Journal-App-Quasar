<template>
  <div class="user-card">
    <img
      :src="photoURL || defaultPhoto"
      :alt="displayName"
      class="user-card__photo"
    />
    <div class="user-card__info">
      <h3 class="user-card__name">{{ displayName }}</h3>
      <p class="user-card__email">{{ email }}</p>
    </div>
  </div>
</template>

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
const defaultPhoto =
  "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1743788189~exp=1743791789~hmac=f73890cca01d7c06e339adb28a8009613866c0161b10f49164be32629add42d8&w=740";
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.user-card__photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
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
