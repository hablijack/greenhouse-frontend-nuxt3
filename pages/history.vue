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

let air_temperatures = await $fetch(`/api/rest/history/air/temperatures?timerange=${air_temperatures_timerange}`);
let air_humidity = await $fetch(`/api/rest/history/air/humidity?timerange=${air_humidity_timerange}`);
let wifi = await $fetch(`/api/rest/history/wifi?timerange=${wifi_timerange}`);
let co2 = await $fetch(`/api/rest/history/co2?timerange=${co2_timerange}`);
let brightness = await $fetch(`/api/rest/history/brightness?timerange=${brightness_timerange}`);



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
            unit: 'hour',
            displayFormats: {
                hour: 'HH:MM'
            }
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
    createChart('air-temperatures', air_temperatures, '°C', 'day');
    createChart('air-humidity', air_humidity, '%', 'day');
    createChart('wifi', wifi, 'dBi', 'day');
    createChart('co2', co2, 'ppm', 'day');
    createChart('brightness', brightness, 'lux', 'day');
  }
});
</script>
