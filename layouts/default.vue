<template>
  <v-app style="background-color: #dfdfdf">
    <SystemBar @change-drawer-state="toggleLeftMenu" />
    <Navigation :show="showLeftMenu" @change-drawer-state="toggleLeftMenu" />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
const showLeftMenu = ref(false);
const toggleLeftMenu = () => {
  showLeftMenu.value = !showLeftMenu.value;
}
</script>