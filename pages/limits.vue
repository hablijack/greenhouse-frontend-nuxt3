<template>
  <v-container fluid class="pa-4 pa-md-6">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title style="background-color: #343a40; color: white">
            <v-icon left>mdi-plus-minus-box</v-icon>
            Grenzwerte
          </v-card-title>
          <v-card-text class="pt-4">
            <p class="text-body-2 text-medium-emphasis mb-4">
              Legen Sie die Alarmgrenzen für jeden Sensor fest
            </p>

            <v-row v-if="pending" justify="center" class="my-12">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </v-row>

            <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">
              Fehler beim Laden der Sensoren. Bitte versuchen Sie es erneut.
            </v-alert>

            <v-row v-else-if="sensors && sensors.length > 0" density="comfortable">
              <v-col 
                v-for="sensor in sensors" 
                :key="sensor.name + sensor.unit" 
                cols="12" 
                sm="6" 
                md="4" 
                lg="4"
              >
                <LimitCard 
                  :id="sensor.id" 
                  :headline="sensor.name" 
                  v-model:max-alarm-value="sensor.maxAlarmValue"
                  :icon="sensor.icon" 
                  v-model:min-alarm-value="sensor.minAlarmValue" 
                  :unit="sensor.unit" 
                  :description="sensor.description" 
                  :value="getMeasurement(sensor.identifier)"
                  :decimals="sensor.decimals"
                  :is-boolean="isBooleanSensor(sensor.identifier)"
                />
              </v-col>
            </v-row>

            <v-row v-else justify="center" class="my-12">
              <v-col cols="12" class="text-center">
                <v-icon size="64" color="grey">mdi-sensor-off</v-icon>
                <p class="text-h6 mt-4 text-medium-emphasis">Keine Sensoren gefunden</p>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
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
const { data: sensors, pending, error } = await useFetch('/api/rest/sensors');

onMounted(() => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  const wsUrl = `${protocol}//${host}/api/socket/sensors/measurements`
  
  const socket = new WebSocket(wsUrl);
  socket.onmessage = function (message) {
    measurements.value = JSON.parse(message.data);
  };
});

const getMeasurement = (identifier) => {
  return measurements.value[identifier] ?? null;
}

const isBooleanSensor = (identifier) => {
  if (!identifier) return false;
  const lower = identifier.toLowerCase();
  return lower.includes('soil') || lower.includes('boden') || lower.includes('rain');
}
</script>
