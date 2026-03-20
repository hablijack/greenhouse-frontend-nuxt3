<template>
  <v-card :loading="isLoading" class="limit-card">
    <v-card-title class="pb-2">
      <v-row density="comfortable" align="center" no-gutters>
        <v-col cols="auto">
          <v-avatar :color="statusColor" size="40" class="mr-3">
            <v-icon size="24">{{ icon }}</v-icon>
          </v-avatar>
        </v-col>
        <v-col>
          <span class="text-h6 font-weight-medium">{{ headline }}</span>
          <div class="text-caption text-medium-emphasis">{{ description }}</div>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text class="pt-2">
      <div class="current-value-section mb-4">
        <div class="text-overline text-medium-emphasis">Aktueller Wert</div>
        <div class="d-flex align-center">
          <span class="text-h4 font-weight-bold" :class="`text-${statusColor}`">
            {{ formattedValue }}
          </span>
          <v-spacer />
          <v-chip v-if="isOutOfRange" color="error" size="small" variant="flat">
            <v-icon start size="14">mdi-alert</v-icon>
            Außerhalb
          </v-chip>
          <v-chip v-else color="success" size="small" variant="flat">
            <v-icon start size="14">mdi-check-circle</v-icon>
            OK
          </v-chip>
        </div>
      </div>

      <v-divider class="mb-4" />

      <div v-if="isBoolean" class="boolean-info">
        <v-alert type="info" variant="tonal" density="compact">
          <v-icon start size="16">mdi-information</v-icon>
          Dieser Sensor zeigt nur "Trocken" (0) oder "Nass" (1) an.
        </v-alert>
      </div>

      <div v-else class="limits-section">
        <div class="text-overline text-medium-emphasis mb-2">Alarmgrenzen</div>
        
        <v-range-slider
          v-model="sliderValues"
          :min="sliderMin"
          :max="sliderMax"
          :step="step"
          color="primary"
          track-color="grey-lighten-2"
          class="mb-2"
          hide-details
          thumb-label="always"
        >
          <template #thumb-label="{ modelValue }">
            {{ formatNumber(modelValue) }}
          </template>
        </v-range-slider>

        <v-row density="comfortable" class="mt-1">
          <v-col cols="6">
            <v-text-field
              v-model.number="localMinValue"
              prepend-inner-icon="mdi-arrow-collapse-down"
              variant="outlined"
              density="compact"
              label="Minimum"
              :suffix="unit"
              type="number"
              :step="step"
              hide-spin-buttons
              @update:model-value="onMinChange"
              :error="validationError"
              :error-messages="validationError ? 'Min < Max erforderlich' : ''"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model.number="localMaxValue"
              prepend-inner-icon="mdi-arrow-collapse-up"
              variant="outlined"
              density="compact"
              label="Maximum"
              :suffix="unit"
              type="number"
              :step="step"
              hide-spin-buttons
              @update:model-value="onMaxChange"
              :error="validationError"
            />
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <v-card-actions v-if="!isBoolean" class="px-4 pb-4 pt-0">
      <v-btn
        color="primary"
        variant="elevated"
        @click="saveClick"
        :disabled="!saveButtonEnabled || validationError"
        :loading="isLoading"
        block
        size="large"
      >
        <v-icon start>mdi-content-save</v-icon>
        Speichern
      </v-btn>
    </v-card-actions>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
      <template #actions>
        <v-btn variant="text" @click="snackbar = false">Schließen</v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<script setup>
const props = defineProps({
  id: Number,
  icon: String,
  target: String,
  unit: String,
  headline: String,
  description: String,
  minAlarmValue: [String, Number],
  maxAlarmValue: [String, Number],
  value: [String, Number],
  decimals: {
    type: Number,
    default: 0
  },
  isBoolean: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:minAlarmValue', 'update:maxAlarmValue'])

const saveButtonEnabled = ref(false)
const isLoading = ref(false)
const localMinValue = ref(parseFloat(props.minAlarmValue) || 0)
const localMaxValue = ref(parseFloat(props.maxAlarmValue) || 100)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const step = computed(() => {
  return props.decimals > 0 ? Math.pow(10, -props.decimals) : 1
})

const sliderMin = computed(() => {
  return Math.min(localMinValue.value, localMaxValue.value) - 20
})

const sliderMax = computed(() => {
  return Math.max(localMinValue.value, localMaxValue.value) + 20
})

const sliderValues = computed({
  get: () => [localMinValue.value, localMaxValue.value],
  set: (val) => {
    localMinValue.value = val[0]
    localMaxValue.value = val[1]
    emitUpdate()
  }
})

const validationError = computed(() => {
  return localMinValue.value >= localMaxValue.value
})

const currentValue = computed(() => {
  if (props.isBoolean) {
    return props.value === 1 || props.value === '1' ? 1 : 0
  }
  const val = parseFloat(props.value)
  return isNaN(val) ? 0 : val
})

const formattedValue = computed(() => {
  if (props.isBoolean) {
    return currentValue.value === 1 ? 'Nass' : 'Trocken'
  }
  return formatNumber(currentValue.value) + ' ' + props.unit
})

const formatNumber = (val) => {
  return Number(val).toFixed(props.decimals)
}

const isOutOfRange = computed(() => {
  if (props.isBoolean) {
    return currentValue.value === 0
  }
  return currentValue.value < localMinValue.value || currentValue.value > localMaxValue.value
})

const statusColor = computed(() => {
  if (isOutOfRange.value) return 'error'
  return 'primary'
})

const emitUpdate = () => {
  emit('update:minAlarmValue', localMinValue.value)
  emit('update:maxAlarmValue', localMaxValue.value)
  saveButtonEnabled.value = true
}

const onMinChange = (val) => {
  localMinValue.value = parseFloat(val) || 0
  emitUpdate()
}

const onMaxChange = (val) => {
  localMaxValue.value = parseFloat(val) || 100
  emitUpdate()
}

const showSnackbar = (text, color = 'success') => {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

const saveClick = async () => {
  if (validationError.value) return
  
  isLoading.value = true
  try {
    const sensor = await $fetch(`/backend/rest/sensor/${props.id}`, { method: 'GET' })
    sensor.minAlarmValue = parseInt(localMinValue.value)
    sensor.maxAlarmValue = parseInt(localMaxValue.value)
    await $fetch(`/backend/rest/sensor/${props.id}`, {
      method: 'PUT',
      body: sensor
    })
    saveButtonEnabled.value = false
    showSnackbar('Grenzwerte erfolgreich gespeichert', 'success')
  } catch (err) {
    showSnackbar('Fehler beim Speichern', 'error')
  } finally {
    isLoading.value = false
  }
}

watch(() => props.minAlarmValue, (newVal) => {
  if (!saveButtonEnabled.value) {
    localMinValue.value = parseFloat(newVal) || 0
  }
})

watch(() => props.maxAlarmValue, (newVal) => {
  if (!saveButtonEnabled.value) {
    localMaxValue.value = parseFloat(newVal) || 100
  }
})
</script>

<style scoped>
.limit-card {
  height: 100%;
}

.current-value-section {
  background: rgb(var(--v-theme-surface));
  border-radius: 8px;
  padding: 12px;
}

.text-error {
  color: rgb(var(--v-theme-error)) !important;
}

.text-success {
  color: rgb(var(--v-theme-success)) !important;
}

.v-range-slider :deep(.v-slider-thumb__label) {
  font-size: 11px;
}
</style>
