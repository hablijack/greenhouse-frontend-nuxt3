import Muuri from 'muuri'

interface MuuriGridOptions {
  columns?: number
  itemSelector?: string
  fillGaps?: boolean
  dragEnabled?: boolean
  layoutDuration?: number
  gap?: number
}

export function useMuuriGrid(
  containerRef: any,
  options: MuuriGridOptions = {}
) {
  const {
    itemSelector = '.muuri-item',
    fillGaps = true,
    dragEnabled = false,
    layoutDuration = 400,
    gap = 8,
  } = options

  const grid = shallowRef<any>(null)
  const columnCount = ref(options.columns ?? getColumnCountForWidth(0))

  function getColumnCountForWidth(width: number): number {
    if (width < 600) return 2
    if (width < 960) return 3
    if (width < 1280) return 4
    if (width < 1920) return 6
    return 8
  }

  function updateColumnCount() {
    if (!containerRef.value) return
    const width = containerRef.value.offsetWidth
    columnCount.value = getColumnCountForWidth(width)
  }

  function getContainerWidth(): number {
    return containerRef.value?.offsetWidth ?? 0
  }

  function calculateItemWidth(colspan: number): number {
    const cols = columnCount.value
    const containerWidth = getContainerWidth()
    if (cols === 0 || containerWidth === 0) return 0
    const availableWidth = containerWidth - gap * (cols - 1)
    const colWidth = availableWidth / cols
    return colWidth * colspan + gap * (colspan - 1)
  }

  function updateItemSizes() {
    if (!containerRef.value) return
    const items: NodeListOf<HTMLElement> = containerRef.value.querySelectorAll(itemSelector)
    items.forEach((el: HTMLElement) => {
      const colspan = parseInt(el.dataset.colspan || '1', 10)
      el.style.width = `${calculateItemWidth(colspan)}px`
    })
  }

  function init() {
    if (!containerRef.value) return
    destroy()

    updateColumnCount()

    grid.value = new Muuri(containerRef.value, {
      items: itemSelector,
      layout: { fillGaps },
      layoutOnResize: false,
      dragEnabled,
      layoutDuration,
      layoutEasing: 'ease',
    })

    updateItemSizes()
    requestAnimationFrame(() => {
      grid.value?.refreshItems().layout()
    })
  }

  function refresh() {
    if (!grid.value) return
    updateItemSizes()
    grid.value.refreshItems().layout()
  }

  function destroy() {
    if (grid.value) {
      grid.value.destroy()
      grid.value = null
    }
  }

  let resizeTimer: ReturnType<typeof setTimeout> | null = null

  function handleResize() {
    if (resizeTimer) return
    resizeTimer = setTimeout(() => {
      resizeTimer = null
      if (!grid.value) return
      updateColumnCount()
      requestAnimationFrame(() => {
        updateItemSizes()
        grid.value.refreshItems().layout()
      })
    }, 100)
  }

  let observer: ResizeObserver | null = null

  function setupObserver() {
    if (!containerRef.value) return
    observer = new ResizeObserver(handleResize)
    observer.observe(containerRef.value)
  }

  onMounted(() => {
    init()
    setupObserver()
  })

  onUnmounted(() => {
    destroy()
    if (observer) {
      observer.disconnect()
      observer = null
    }
    if (resizeTimer) {
      clearTimeout(resizeTimer)
      resizeTimer = null
    }
  })

  return {
    grid,
    columnCount,
    refresh,
    destroy,
  }
}
