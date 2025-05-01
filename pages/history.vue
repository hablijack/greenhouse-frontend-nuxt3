<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <LineChart text="Lufttemperaturen" identifier="air-temperatures" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <LineChart text="Luftfeuchtigkeit" identifier="air-humidity" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <LineChart text="WiFi Signalstärke" identifier="wifi" />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <LineChart text="CO2 Gehalt" identifier="co2" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <LineChart text="Sonneneinstrahlung (Helligkeit)" identifier="brightness" />
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { Chart, registerables } from "chart.js";
import 'chartjs-adapter-moment';

const air_temperatures_timerange = ref("day");
const air_humidity_timerange = ref("day");
const wifi_timerange = ref("day");
const co2_timerange = ref("day");
const brightness_timerange = ref("day");

const { data: air_temperatures } = await useFetch(`/api/rest/history/air/temperatures?timerange=${air_temperatures_timerange}`);
const { data: air_humidity } = await useFetch(`/api/rest/history/air/humidity?timerange=${air_humidity_timerange}`);
const { data: wifi } = await useFetch(`/api/rest/history/wifi?timerange=${wifi_timerange}`);
const { data: co2 } = await useFetch(`/api/rest/history/co2?timerange=${co2_timerange}`);
const { data: brightness } = await useFetch(`/api/rest/history/brightness?timerange=${brightness_timerange}`);

const createChart = (identifier, datasets, scale, unit) => {
  new Chart(identifier, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      elements: {
        line: {
          tension: 0.3
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit
          }
        },
        y: {
          ticks: {
            callback: function (value, index, ticks) {
              return value + ' ' + scale;
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
        }
      }
    },
  });
}

onMounted(() => {
  if (Chart) {
    Chart.register(...registerables);
    createChart('air-temperatures', air_temperatures.value, '°C', 'day');
    createChart('air-humidity', air_humidity.value, '%', 'day');
    createChart('wifi', wifi.value, 'dBi', 'day');
    createChart('co2', co2.value, 'ppm', 'day');
    createChart('brightness', brightness.value, 'lux', 'day');
  }
});
</script>
