<template>
  <v-card theme="dark" :color="color" class="text-center" style="opacity: 0.7">
    <div class="d-flex align-center justify-center pa-2">
      <v-icon size="24" class="mr-2">{{ icon }}</v-icon>
      <span>{{ target || name }}</span>
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  color: String,
  name: String,
  target: String,
  icon: String,
})
</script>
