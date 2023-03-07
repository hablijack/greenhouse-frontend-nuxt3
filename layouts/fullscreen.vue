<template>
  <v-app class="fullscreenpage">
    <v-main>
      <slot />
    </v-main>
  </v-app >
</template>

<style>
  .fullscreenpage {
    background-color: #343a40;
    color: white;
  }
  html {
    overflow-y: hidden;
  }
</style>