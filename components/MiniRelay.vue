<template>
  <v-card theme="dark" :color="color" class="text-center" style="opacity: 0.7">
    <div class="d-flex align-center justify-center pa-1">
      <v-icon size="16" class="mr-1">{{ icon }}</v-icon>
      <span class="text-caption">{{ target || name }}</span>
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
