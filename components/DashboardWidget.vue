<template>
  <div class="muuri-item" :data-colspan="colspan" :data-width="width">
    <div class="muuri-item-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  colspan?: number
  width?: number
}>(), {
  colspan: 1,
  width: 0,
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
