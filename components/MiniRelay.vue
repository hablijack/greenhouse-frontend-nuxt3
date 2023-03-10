<template>
  <v-card theme="dark" :color="color" style="opacity: 0.7" class="text-center">
    <v-icon>{{ icon }}</v-icon>
    <span v-if="target">{{ target }}</span>
    <span v-else>{{ name }}</span>
  </v-card>
</template>

<script>
export default {
  name: "MiniRelay",
  props: ["color", "name", "target", "icon"],
  data() {
    return {};
  },
};
</script>
