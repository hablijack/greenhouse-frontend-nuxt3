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
        <span class="text-body-2">Pflanzengesundheit</span>
      </v-list-item-subtitle>
    </v-list-item>

    <v-card-text class="py-1">
      <template v-if="Object.keys(analyses).length">
        <div v-for="(result, plant) in analyses" :key="plant" class="d-flex align-center ga-2 mb-1 text-body-2">
          <strong class="text-caption" style="min-width: 5em;">{{ plant }}</strong>
          <v-chip :color="getUrgencyColor(result.urgency)" size="x-small" variant="flat">
            {{ getUrgencyLabel(result.urgency) }}
          </v-chip>
          <span class="text-caption">{{ result.summary }}</span>
        </div>
      </template>
      <v-alert v-else type="info" variant="tonal" density="compact" class="mt-2">
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
const analyses = ref<Record<string, any>>({})
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

const cardColor = computed(() => {
  const urgencies = Object.values(analyses.value).map(a => a.urgency)
  if (!urgencies.length) return '#343a40'
  if (urgencies.includes('high')) return '#EA8162'
  if (urgencies.includes('medium')) return '#FFA726'
  return '#5cad8a'
})

function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'high': return 'error'
    case 'medium': return 'warning'
    default: return 'success'
  }
}

function getUrgencyLabel(urgency: string): string {
  switch (urgency) {
    case 'high': return 'Kritisch'
    case 'medium': return 'Achtung'
    default: return 'Optimal'
  }
}

function getPlantTypes(): string[] {
  const plantTypes = new Set<string>()
  if (props.relays) {
    for (const relay of props.relays) {
      if (relay.target) plantTypes.add(relay.target)
    }
  }
  return Array.from(plantTypes)
}

function buildSensorData(plantType: string): Record<string, any> {
  const m = props.measurements || {}
  return {
    plantType,
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
    const plantTypes = getPlantTypes()
    if (!plantTypes.length) plantTypes.push('general')

    const results = await Promise.all(plantTypes.map(async (plant) => {
      try {
        const data = buildSensorData(plant)
        const response = await $fetch('/api/rest/sensor-data', {
          method: 'POST',
          body: data,
        })
        return { plant, response }
      } catch (err) {
        console.error(`AI analysis failed for ${plant}:`, err)
        return null
      }
    }))

    const newAnalyses: Record<string, any> = {}
    for (const result of results) {
      if (result) {
        newAnalyses[result.plant] = result.response
      }
    }
    analyses.value = newAnalyses
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
    if (!Object.keys(analyses.value).length) {
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
