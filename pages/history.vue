<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12">
        <v-card>
          <canvas id="ff"></canvas>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { Chart, registerables } from "chart.js";

if (Chart) {
  Chart.register(...registerables);

  const data = {
    labels: ['Januar', 'Februar', 'März', 'April'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [10, 90, 20, 25],
        borderColor: 'red',
        backgroundColor: 'gray',
      },
      {
        label: 'Dataset 2',
        data: [20, 70, 54, 22],
        borderColor: 'blue',
        backgroundColor: 'gray',
      }
    ]
  };
  new Chart("ff", {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        }
      }
    },
  });
}
</script>