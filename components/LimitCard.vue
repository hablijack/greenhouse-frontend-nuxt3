<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-icon size="30" class="mr-3">{{ icon }}</v-icon>
      {{ headline }} {{ target }}
    </v-card-title>
    
    <v-card-subtitle>{{ description }}</v-card-subtitle>
    
    <v-card-text>
      <v-text-field
        v-model="localMinValue"
        prepend-icon="mdi-arrow-collapse-down"
        variant="outlined"
        label="untere Grenze:"
        :suffix="unit"
        type="number"
        @update:model-value="$emit('update:minAlarmValue', $event)"
      />
      <v-text-field
        v-model="localMaxValue"
        prepend-icon="mdi-arrow-collapse-up"
        variant="outlined"
        label="obere Grenze:"
        :suffix="unit"
        type="number"
        class="mt-4"
        @update:model-value="$emit('update:maxAlarmValue', $event)"
      />
    </v-card-text>
    
    <v-card-actions>
      <v-btn 
        color="primary" 
        variant="elevated" 
        @click="saveClick" 
        :disabled="!saveButtonEnabled" 
        size="x-large"
        block
      >
        Speichern
      </v-btn>
    </v-card-actions>
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
})

const emit = defineEmits(['update:minAlarmValue', 'update:maxAlarmValue'])

const saveButtonEnabled = ref(false)
const isLoading = ref(false)
const localMinValue = ref(props.minAlarmValue)
const localMaxValue = ref(props.maxAlarmValue)

const saveClick = async () => {
  isLoading.value = true
  try {
    const sensor = await $fetch(`/backend/rest/sensor/${props.id}`, { method: 'GET' })
    sensor.minAlarmValue = parseInt(props.minAlarmValue)
    sensor.maxAlarmValue = parseInt(props.maxAlarmValue)
    await $fetch(`/backend/rest/sensor/${props.id}`, {
      method: 'PUT',
      body: sensor
    })
    saveButtonEnabled.value = false
  } finally {
    isLoading.value = false
  }
}

watch(() => props.minAlarmValue, () => {
  saveButtonEnabled.value = true
  localMinValue.value = props.minAlarmValue
})

watch(() => props.maxAlarmValue, () => {
  saveButtonEnabled.value = true
  localMaxValue.value = props.maxAlarmValue
})
</script>
