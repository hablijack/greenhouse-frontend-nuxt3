<template>
  <v-card theme="dark" :color="color" style="opacity: 0.7" class="text-center">
    <v-icon>{{ icon }}</v-icon>
    {{ name }}
  </v-card>
</template>

<script>
export default {
  name: "MiniRelay",
  props: ["color", "name", "icon"],
  data() {
    return {};
  },
};
</script>
