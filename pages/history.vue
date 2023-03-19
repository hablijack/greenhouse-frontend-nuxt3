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
  </v-container>
</template>

<script setup>
import { Chart, registerables } from "chart.js";
import 'chartjs-adapter-moment';

const config = useRuntimeConfig()
const air_temperatures_timerange = ref("week");
const air_humidity_timerange = ref("week");

const { data: air_temperatures } = await useFetch(config.apiBaseUrl + `/backend/history/air/temperatures?range=${air_temperatures_timerange}`);
const { data: air_humidity } = await useFetch(config.apiBaseUrl + `/backend/history/air/humidity?range=${air_humidity_timerange}`);

onMounted(() => {
  if (Chart) {
    Chart.register(...registerables);

    new Chart("air-temperatures", {
      type: 'line',
      data: { datasets: air_temperatures.value },
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
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      },
    });

    new Chart("air-humidity", {
      type: 'bar',
      data: { datasets: air_humidity.value },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
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
});
</script>