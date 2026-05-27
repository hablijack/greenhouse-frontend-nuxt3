<template>
  <v-container fluid>
    <v-row density="comfortable">
      <v-col cols="12" sm="12" md="12" lg="6">
        <v-img :src="cameraPictureUrl()" style="transform: rotate(180deg);" class="w-100" contain></v-img>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="6">
        <v-row density="comfortable">
          <v-col v-for="sensor in sensors" v-bind:key="sensor.name + sensor.identifier" cols="12" sm="6">
            <MeasureCard :headline="sensor.name" :measurement="measurements[sensor.identifier]" :unit="sensor.unit"
              :description="sensor.description" :icon="sensor.icon" :minAlarmValue="sensor.minAlarmValue"
              :decimals="sensor.decimals" :maxAlarmValue="sensor.maxAlarmValue" :is-boolean="isBooleanSensor(sensor.identifier)"
              :plant-type="isBooleanSensor(sensor.identifier) ? getPlantType(sensor.identifier) : null" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="relays && relays.length" density="comfortable">
      <v-col v-for="relay in relays" v-bind:key="relay.name" cols="6" sm="4" md="3" lg="2">
        <MiniRelay :color="relay.value ? relay.color : '#343a40'" :name="relay.identifier" :target="relay.target"
          :icon="relay.icon" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';

definePageMeta({
  layout: "default",
  middleware: ['authenticated']
});

const measurements = ref({})
const sensors = await $fetch('/api/rest/sensors');
const relays = await $fetch('/api/rest/relays');
onMounted(() => {
  // Use Nuxt proxy endpoint for WebSocket connection
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  const wsUrl = `${protocol}//${host}/api/socket/sensors/measurements`
  
  const socket = new WebSocket(wsUrl);
  socket.onmessage = function (message) {
    measurements.value = JSON.parse(message.data);
  };
});

const cameraPictureUrl = () => {
  return '/api/rest/satellites/greenhouse-cam/picture.jpg'
}

const isBooleanSensor = (identifier) => {
  if (!identifier) return false;
  const lower = identifier.toLowerCase();
  return !lower.includes('temp') && (lower.includes('soil') || lower.includes('boden') || lower.includes('rain'));
}

const getPlantType = (identifier) => {
  if (!identifier) return null;
  const relay = relays.find(r => 
    r.conditionTrigger && 
    r.conditionTrigger.triggerSensor &&
    r.conditionTrigger.triggerSensor.identifier === identifier
  );
  return relay?.target || null;
}
</script>
