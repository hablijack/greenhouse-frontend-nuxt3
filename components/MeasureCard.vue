<template>
  <v-card :color="cardColor" theme="dark">
    <v-list-item three-line>
      <template #append>
        <v-icon size="120">{{ icon }}</v-icon>
      </template>

      <v-list-item-title class="text-overline">
        {{ headline }}
      </v-list-item-title>

      <v-list-item-subtitle class="text-h4 py-2">
        <span v-if="measurement == null">...</span>
        <template v-else>{{ cardValue }} {{ unit }}</template>
      </v-list-item-subtitle>

      <v-list-item-subtitle>
        {{ description }}
      </v-list-item-subtitle>
    </v-list-item>
  </v-card>
</template>

<script setup>
const props = defineProps({
  headline: String,
  unit: String,
  measurement: [Number, String],
  icon: String,
  description: String,
  decimals: { type: Number, default: 1 },
  color: String,
  minAlarmValue: Number,
  maxAlarmValue: Number,
})

const cardValue = computed(() => {
  if (props.measurement == null) return null
  return parseFloat(props.measurement).toFixed(props.decimals)
})

const cardColor = computed(() => {
  if (props.measurement <= props.minAlarmValue || props.measurement >= props.maxAlarmValue) {
    return "#EA8162"
  }
  return "#5cad8a"
})
</script>
