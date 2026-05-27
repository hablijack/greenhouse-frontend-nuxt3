<template>
  <div ref="container" class="muuri-grid">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  dragEnabled?: boolean
  layoutDuration?: number
  gap?: number
}>(), {
  dragEnabled: false,
  layoutDuration: 400,
  gap: 8,
})

const container = ref<HTMLElement | null>(null)

const { columnCount, refresh } = useMuuriGrid(container, {
  fillGaps: true,
  dragEnabled: props.dragEnabled,
  layoutDuration: props.layoutDuration,
  gap: props.gap,
})

defineExpose({
  columnCount,
  refresh,
})
</script>

<style scoped>
.muuri-grid {
  position: relative;
  width: 100%;
}

.muuri-grid :deep(.muuri-item) {
  position: absolute;
}
</style>
