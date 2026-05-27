<template>
  <div class="muuri-item" :data-colspan="colspan">
    <div class="muuri-item-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  colspan?: number
}>(), {
  colspan: 1,
})
</script>

<style scoped>
.muuri-item {
  display: block;
}

.muuri-item-content {
  padding: 4px;
  height: 100%;
}
</style>
