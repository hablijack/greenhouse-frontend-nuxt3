<template>
  <v-app style="background-color: #dfdfdf">
    <SystemBar @change-drawer-state="toggleLeftMenu" />
    <Navigation :show="showLeftMenu" @change-drawer-state="toggleLeftMenu" />
    <v-main :style="mainAreaStyle">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { useDisplay } from 'vuetify';

const showLeftMenu = ref(true);

const toggleLeftMenu = () => {
  showLeftMenu.value = !showLeftMenu.value;
}

const mainAreaStyle = computed(() => {
    const display = ref(useDisplay())
    if (display.value.mobile) {
        return 'margin-top: 40px;'
    }
})
</script>