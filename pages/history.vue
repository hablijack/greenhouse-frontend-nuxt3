<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card variant="outlined" class="pa-8 bgwhite">
          <canvas id="airtemperature"></canvas>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.bgwhite {
  background-color: white;
}
</style>

<script setup>
import { Chart, registerables } from "chart.js";
import 'chartjs-adapter-moment';

const config = useRuntimeConfig()
const timerange = ref("week");

const { data: datasets } = await useLazyFetch(config.apiBaseUrl + `/backend/history/air/temperatures?range=${timerange}`);

onMounted(() => {
  if (Chart) {
    Chart.register(...registerables);

    new Chart("airtemperature", {
      type: 'line',
      data: { datasets: datasets.value },
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
              unit: 'month'
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