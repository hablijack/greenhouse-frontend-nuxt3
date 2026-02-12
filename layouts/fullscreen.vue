<template>
  <v-app class="fullscreenpage">
    <v-main>
      <slot />
    </v-main>
  </v-app >
</template>

<style>
  .fullscreenpage {
    background: linear-gradient(135deg, #1e272e, #2c3e50);
    color: white;
  }
  html {
    overflow-y: hidden;
  }
</style>