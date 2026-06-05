<template>
  <v-container fluid>
    <v-row v-if="relays && relays.length" class="relay-row" no-gutters>
      <div v-for="relay in relays" :key="relay.name" class="relay-item">
        <MiniRelay
          :color="relay.value ? relay.color : '#343a40'"
          :name="relay.identifier"
          :target="relay.target"
          :icon="relay.icon"
        />
      </div>
    </v-row>

    <AiDashboardPanel
      :measurements="measurements"
      :relays="relays"
      :sensors="sensors"
      class="mb-2"
    />

    <DashboardGrid ref="gridRef">
      <DashboardWidget :colspan="cameraColspan">
        <div class="camera-wrapper">
          <v-img
            :src="cameraPictureUrl()"
            style="transform: rotate(180deg);"
            height="544"
            contain
            @load="onCameraLoad"
          />
        </div>
      </DashboardWidget>

      <DashboardWidget
        v-for="sensor in sensors"
        :key="sensor.name + sensor.identifier"
        :colspan="sensorColspan"
        :width="sensorWidth"
      >
        <MeasureCard
          :headline="getSensorHeadline(sensor)"
          :measurement="measurements[sensor.identifier]"
          :unit="sensor.unit"
          :description="sensor.description"
          :icon="sensor.icon"
          :min-alarm-value="sensor.minAlarmValue"
          :decimals="sensor.decimals"
          :max-alarm-value="sensor.maxAlarmValue"
          :is-boolean="isBooleanSensor(sensor.identifier)"
          :informational="isRainSensor(sensor.identifier)"
        />
      </DashboardWidget>
    </DashboardGrid>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: ['authenticated']
})

const measurements = ref({})
const sensors = await $fetch('/api/rest/sensors')
const relays = await $fetch('/api/rest/relays')

const gridRef = ref<any>(null)

const cameraColspan = computed(() => {
  const cols = gridRef.value?.columnCount?.value ?? 4
  if (cols >= 8) return 5
  if (cols >= 6) return 4
  if (cols >= 4) return 3
  return 2
})

const sensorColspan = 1.5
const sensorWidth = 360

let refreshTimeout: ReturnType<typeof setTimeout> | null = null

function scheduleRefresh() {
  if (refreshTimeout) clearTimeout(refreshTimeout)
  refreshTimeout = setTimeout(() => {
    gridRef.value?.refresh()
  }, 200)
}

onMounted(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  const wsUrl = `${protocol}//${host}/api/socket/sensors/measurements`

  const socket = new WebSocket(wsUrl)
  socket.onopen = () => console.log('[WS] dashboard connected')
  socket.onerror = (err) => console.error('[WS] dashboard error:', err)
  socket.onclose = (ev) => console.log('[WS] dashboard closed:', ev.code, ev.reason)
  socket.onmessage = function (message) {
    measurements.value = JSON.parse(message.data)
  }
})

watch(measurements, () => {
  scheduleRefresh()
}, { deep: true })

function onCameraLoad() {
  nextTick(() => {
    gridRef.value?.refresh()
  })
}

function isBooleanSensor(identifier: string | null | undefined): boolean {
  if (!identifier) return false
  const lower = identifier.toLowerCase()
  return !lower.includes('temp') && (lower.includes('soil') || lower.includes('boden') || lower.includes('rain'))
}

function isRainSensor(identifier: string | null | undefined): boolean {
  if (!identifier) return false
  return identifier.toLowerCase().includes('rain')
}

function getSensorHeadline(sensor: any): string {
  if (isBooleanSensor(sensor.identifier)) {
    const plantType = getPlantType(sensor.identifier)
    if (plantType) {
      return `${sensor.name}: ${plantType}`
    }
  }
  return sensor.name
}

function getPlantType(identifier: string | null | undefined): string | null {
  if (!identifier) return null
  const relay = relays.find((r: any) =>
    r.conditionTrigger &&
    r.conditionTrigger.triggerSensor &&
    r.conditionTrigger.triggerSensor.identifier === identifier
  )
  return relay?.target || null
}

function cameraPictureUrl(): string {
  return '/api/rest/satellites/greenhouse-cam/picture.jpg'
}
</script>

<style scoped>
.relay-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.relay-item {
  width: 100px;
  flex: 0 0 100px;
}

.camera-wrapper {
  width: 100%;
  min-height: 544px;
  border-radius: 8px;
  background: rgb(52, 58, 64);
  overflow: hidden;
}
</style>
