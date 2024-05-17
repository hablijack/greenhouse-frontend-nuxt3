<template>
  <v-app style="background-color: #dfdfdf">
    <Navigation :showNavigation="showNavigation" />
    <SystemBar @toggleNavigation="toggleNavigation" />
    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
  const navigationState = ref(true)
  const showNavigation = computed(() => {
    return navigationState.value
  })

  const toggleNavigation = () => {
    navigationState.value = !navigationState.value
  }
</script>
