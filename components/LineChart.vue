<template>
  <v-sheet elevation="4" rounded color="white" class="pa-8">
    <h3 class="text-center">{{text}}</h3>
    <div class="mb-4">
      <v-btn type="outlined" id="day">Tag</v-btn>
      <v-btn type="outlined" id="week" :active="true">Woche</v-btn>
      <v-btn type="outlined" id="month">Monat</v-btn>
    </div>
    <canvas :id="identifier"></canvas>
  </v-sheet>
</template>

<script setup>
const props = defineProps({
    identifier: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});
</script>