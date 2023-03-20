<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-sheet elevation="4" rounded color="white" class="pa-8">
          <h3 class="text-center">Lufttemperaturen</h3>
          <div class="mb-4">
            <v-btn type="outlined" id="day">Tag</v-btn>
            <v-btn type="outlined" id="week" :active="true">Woche</v-btn>
            <v-btn type="outlined" id="month">Monat</v-btn>
          </div>
          <canvas id="air-temperatures"></canvas>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-sheet elevation="4" rounded color="white" class="pa-8">
          <h3 class="text-center">Luftfeuchtigkeit</h3>
          <div class="mb-4">
            <v-btn type="outlined" id="day">Tag</v-btn>
            <v-btn type="outlined" id="week" :active="true">Woche</v-btn>
            <v-btn type="outlined" id="month">Monat</v-btn>
          </div>
          <canvas id="air-humidity"></canvas>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-sheet elevation="4" rounded color="white" class="pa-8">
          <h3 class="text-center">WiFI Signalstärke</h3>
          <div class="mb-4">
            <v-btn type="outlined" id="day">Tag</v-btn>
            <v-btn type="outlined" id="week" :active="true">Woche</v-btn>
            <v-btn type="outlined" id="month">Monat</v-btn>
          </div>
          <canvas id="wifi"></canvas>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-sheet elevation="4" rounded color="white" class="pa-8">
          <h3 class="text-center">CO2 Gehalt</h3>
          <div class="mb-4">
            <v-btn type="outlined" id="day">Tag</v-btn>
            <v-btn type="outlined" id="week" :active="true">Woche</v-btn>
            <v-btn type="outlined" id="month">Monat</v-btn>
          </div>
          <canvas id="co2"></canvas>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-sheet elevation="4" rounded color="white" class="pa-8">
          <h3 class="text-center">Sonneneinstrahlung (Helligkeit)</h3>
          <div class="mb-4">
            <v-btn type="outlined" id="day">Tag</v-btn>
            <v-btn type="outlined" id="week" :active="true">Woche</v-btn>
            <v-btn type="outlined" id="month">Monat</v-btn>
          </div>
          <canvas id="brightness"></canvas>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { Chart, registerables } from "chart.js";
import 'chartjs-adapter-moment';

const config = useRuntimeConfig()
const air_temperatures_timerange = ref("week");
const air_humidity_timerange = ref("week");
const wifi_timerange = ref("week");
const co2_timerange = ref("week");
const brightness_timerange = ref("week");
const battery_timerange = ref("week");


const { data: air_temperatures } = await useFetch(config.apiBaseUrl + `/backend/history/air/temperatures?range=${air_temperatures_timerange}`);
const { data: air_humidity } = await useFetch(config.apiBaseUrl + `/backend/history/air/humidity?range=${air_humidity_timerange}`);
const { data: wifi } = await useFetch(config.apiBaseUrl + `/backend/history/wifi?range=${wifi_timerange}`);
const { data: co2 } = await useFetch(config.apiBaseUrl + `/backend/history/co2?range=${co2_timerange}`);
const { data: brightness } = await useFetch(config.apiBaseUrl + `/backend/history/brightness?range=${brightness_timerange}`);
const { data: battery } = await useFetch(config.apiBaseUrl + `/backend/history/battery?range=${battery_timerange}`);

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
              unit: 'day'
            }
          },
          y: {
            ticks: {
                callback: function(value, index, ticks) {
                    return value + unit;
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
    createChart('air-temperatures', air_temperatures.value, '°C', 'day' );
    createChart('air-humidity', air_humidity.value, '%', 'day' );
    createChart('wifi', wifi.value, '%', 'day' );
    createChart('co2', co2.value, 'ppm', 'day' );
    createChart('brightness', brightness.value, 'cp', 'day' );
    createChart('battery', battery.value, '%', 'day' );
  }
});
</script>