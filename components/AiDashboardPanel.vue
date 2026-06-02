<template>
  <v-card :color="cardColor" theme="dark" class="ai-card">
    <v-list-item>
      <template #append>
        <v-icon size="48">mdi-robot</v-icon>
      </template>
      <v-list-item-title class="text-overline">
        KI-Analyse
      </v-list-item-title>
      <v-list-item-subtitle class="text-h6 d-flex align-center ga-2">
        <v-chip v-if="analysis" :color="urgencyColor" size="small" variant="flat">
          {{ urgencyLabel }}
        </v-chip>
        <span class="text-body-2">Pflanzengesundheit</span>
      </v-list-item-subtitle>
    </v-list-item>

    <v-card-text v-if="analysis" class="py-1">
      <p class="text-body-2 mb-2">{{ analysis.summary }}</p>
      <v-list v-if="analysis.recommendations?.length" density="compact" class="bg-transparent">
        <v-list-item v-for="(rec, i) in analysis.recommendations.slice(0, 3)" :key="i" class="pa-0 ma-0">
          <template #prepend>
            <v-icon color="warning" size="x-small" class="mr-1">mdi-lightbulb-outline</v-icon>
          </template>
          <v-list-item-title class="text-caption">{{ rec }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <v-alert v-if="!analysis" type="info" variant="tonal" density="compact" class="mt-2">
        Klicke auf "Analysieren" für eine KI-Bewertung der aktuellen Sensordaten.
      </v-alert>
    </v-card-text>

    <v-card-actions>
      <v-btn variant="text" size="small" @click="refreshAnalysis" :loading="loading">
        <v-icon start>mdi-refresh</v-icon> Analysieren
      </v-btn>
      <v-spacer />
      <v-btn variant="text" size="small" @click="showChat = !showChat">
        <v-icon start>mdi-chat</v-icon> Fragen
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-if="showChat" class="px-3 pb-3">
        <v-select
          v-model="chatPlantType"
          :items="availablePlants"
          label="Pflanzentyp"
          variant="solo"
          density="compact"
          hide-details
          class="mb-2"
        />
        <v-text-field
          v-model="chatQuestion"
          variant="solo"
          density="compact"
          placeholder="Frage zur Pflanzenpflege..."
          @keydown.enter="sendChatQuestion"
          :loading="chatLoading"
          hide-details
        >
          <template #append-inner>
            <v-icon @click="sendChatQuestion" color="primary" style="cursor: pointer;">mdi-send</v-icon>
          </template>
        </v-text-field>
        <v-expand-transition>
          <div v-if="chatAnswer" class="mt-2 text-caption pa-2 rounded" style="background: rgba(255,255,255,0.1)">
            <v-icon start size="x-small">mdi-robot</v-icon>
            {{ chatAnswer }}
          </div>
        </v-expand-transition>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  measurements: Record<string, number>
  relays: any[]
  sensors: any[]
}>()

const loading = ref(false)
const analysis = ref<any>(null)
const showChat = ref(false)
const chatQuestion = ref('')
const chatAnswer = ref('')
const chatLoading = ref(false)

const chatPlantType = ref('Allgemein')

const availablePlants = computed(() => {
  const plants = new Set<string>()
  plants.add('Allgemein')
  if (props.relays) {
    for (const relay of props.relays) {
      if (relay.target) plants.add(relay.target)
    }
  }
  return Array.from(plants)
})

const urgencyColor = computed(() => {
  if (!analysis.value) return 'grey'
  switch (analysis.value.urgency) {
    case 'high': return 'error'
    case 'medium': return 'warning'
    default: return 'success'
  }
})

const urgencyLabel = computed(() => {
  if (!analysis.value) return ''
  switch (analysis.value.urgency) {
    case 'high': return 'Kritisch'
    case 'medium': return 'Achtung'
    default: return 'Optimal'
  }
})

const cardColor = computed(() => {
  if (!analysis.value) return '#343a40'
  switch (analysis.value.urgency) {
    case 'high': return '#EA8162'
    case 'medium': return '#FFA726'
    default: return '#5cad8a'
  }
})

function buildSensorData(): Record<string, any> {
  const plantTypes = new Set<string>()
  if (props.relays) {
    for (const relay of props.relays) {
      if (relay.target) plantTypes.add(relay.target)
    }
  }
  const primaryPlant = plantTypes.values().next().value || 'general'

  const m = props.measurements || {}
  return {
    plantType: primaryPlant,
    temperature: m['air_temp_inside'] || 0,
    humidity: m['air_humidity_inside'] || 0,
    soilMoisture: m['soil_humidity_line1'] || 0,
    lightIntensity: m['brightness'] || 0,
    co2Level: m['co2'] || 0,
  }
}

async function refreshAnalysis() {
  loading.value = true
  try {
    const data = buildSensorData()
    const response = await $fetch('/api/rest/sensor-data', {
      method: 'POST',
      body: data,
    })
    analysis.value = response
  } catch (err) {
    console.error('AI analysis failed:', err)
  } finally {
    loading.value = false
  }
}

async function sendChatQuestion() {
  const question = chatQuestion.value.trim()
  if (!question || chatLoading.value) return

  chatLoading.value = true
  chatAnswer.value = ''
  try {
    const plant = chatPlantType.value === 'Allgemein' ? null : chatPlantType.value
    const response = await $fetch('/api/rest/ask-ai', {
      method: 'POST',
      body: { question, plantType: plant },
    })
    chatAnswer.value = response.answer
  } catch (err) {
    chatAnswer.value = 'Fehler bei der Anfrage. Bitte versuche es später erneut.'
    console.error('AI chat failed:', err)
  } finally {
    chatLoading.value = false
  }
}

const measurementsCount = ref(0)
watch(() => props.measurements, () => {
  const count = Object.keys(props.measurements || {}).length
  if (count > 0 && count !== measurementsCount.value) {
    measurementsCount.value = count
    if (!analysis.value) {
      refreshAnalysis()
    }
  }
}, { deep: true })
</script>

<style scoped>
.ai-card {
  min-height: 180px;
}

.v-list--dense .v-list-item {
  min-height: 24px;
}

:deep(.v-list-item__prepend) {
  align-items: flex-start;
  padding-top: 2px;
}
</style>
