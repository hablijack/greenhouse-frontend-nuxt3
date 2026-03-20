<template>
  <v-container fluid class="pa-4 pa-md-6">
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <v-icon size="32" class="mr-3" color="primary">mdi-chart-areaspline</v-icon>
          <div>
            <h1 class="text-h4 text-md-h3 font-weight-bold">Historie</h1>
            <p class="text-body-2 text-medium-emphasis mt-1">
              Entwicklung der Sensorwerte über Zeit
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row v-if="pending" justify="center" class="my-12">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <v-alert v-else-if="error" type="error" variant="tonal" class="mb-4">
      Fehler beim Laden der Sensoren. Bitte versuchen Sie es erneut.
    </v-alert>

    <template v-else>
      <v-row v-for="sensor in chartSensors" :key="sensor.id" density="compact">
        <v-col cols="12">
          <HistoryChart
            :title="sensor.name"
            :api-endpoint="sensor.apiEndpoint"
            :icon="sensor.icon"
            :unit="sensor.unit"
            :min-limit="sensor.minAlarmValue"
            :max-limit="sensor.maxAlarmValue"
            :color="sensor.color"
          />
        </v-col>
      </v-row>

      <v-row v-if="chartSensors.length === 0" justify="center" class="my-12">
        <v-col cols="12" class="text-center">
          <v-icon size="64" color="grey">mdi-chart-line-variant</v-icon>
          <p class="text-h6 mt-4 text-medium-emphasis">Keine Sensoren mit Historien-Daten gefunden</p>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: "default",
  middleware: ['authenticated']
});

const pending = ref(true);
const error = ref(false);
const sensors = ref([]);

const sensorConfig = {
  'air_temperature': {
    name: 'Lufttemperatur',
    icon: 'mdi-thermometer',
    unit: '°C',
    color: '#EA8162',
    endpoint: '/api/rest/history/air/temperatures',
    match: (id) => id.toLowerCase().includes('temp')
  },
  'air_humidity_inside': {
    name: 'Luftfeuchtigkeit',
    icon: 'mdi-water-percent',
    unit: '%',
    color: '#42A5F5',
    endpoint: '/api/rest/history/air/humidity',
    match: (id) => id.toLowerCase().includes('humidity') && !id.toLowerCase().includes('soil')
  },
  'co2': {
    name: 'CO2-Gehalt',
    icon: 'mdi-molecule-co2',
    unit: 'ppm',
    color: '#78909C',
    endpoint: '/api/rest/history/co2',
    match: (id) => id.toLowerCase().includes('co2')
  },
  'brightness': {
    name: 'Helligkeit',
    icon: 'mdi-brightness-6',
    unit: 'lux',
    color: '#FFA726',
    endpoint: '/api/rest/history/brightness',
    match: (id) => id.toLowerCase().includes('brightness')
  },
  'wifi': {
    name: 'WiFi Signalstärke',
    icon: 'mdi-wifi',
    unit: 'dBi',
    color: '#AB47BC',
    endpoint: '/api/rest/history/wifi',
    match: (id) => id.toLowerCase().includes('wifi')
  }
};

const chartSensors = computed(() => {
  const seenEndpoints = new Set();
  
  return sensors.value
    .filter(s => {
      const identifier = (s.identifier || '').toLowerCase();
      return !identifier.includes('soil') && !identifier.includes('rain') && !identifier.includes('boden');
    })
    .map(sensor => {
      const identifier = sensor.identifier || '';
      
      // Find matching config
      const config = Object.values(sensorConfig).find(c => c.match(identifier));
      
      if (config) {
        // Skip if we've already seen this endpoint
        if (seenEndpoints.has(config.endpoint)) {
          return null;
        }
        seenEndpoints.add(config.endpoint);
        
        return {
          ...sensor,
          name: config.name,
          icon: config.icon,
          unit: config.unit,
          color: config.color,
          apiEndpoint: config.endpoint
        };
      }
      return null;
    })
    .filter(s => s !== null);
});

onMounted(async () => {
  try {
    sensors.value = await $fetch('/api/rest/sensors');
  } catch (e) {
    error.value = true;
  } finally {
    pending.value = false;
  }
});
</script>
