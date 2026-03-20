<template>
  <v-card elevation="2" class="mb-4">
    <v-card-title class="d-flex align-center justify-space-between py-2">
      <div class="d-flex align-center">
        <v-icon size="20" class="mr-2" color="primary">{{ icon }}</v-icon>
        <span class="text-h6">{{ title }}</span>
        <span v-if="unit" class="text-body-2 text-medium-emphasis ml-2">({{ unit }})</span>
      </div>
      <div class="d-flex align-center ga-1">
        <v-btn-toggle v-model="timeRange" mandatory variant="outlined" color="primary" density="compact" divided>
          <v-btn value="day" size="x-small">Tag</v-btn>
          <v-btn value="week" size="x-small">Woche</v-btn>
          <v-btn value="month" size="x-small">Monat</v-btn>
        </v-btn-toggle>
      </div>
    </v-card-title>
    
    <v-card-text class="pt-0">
      <div v-if="pending" class="d-flex justify-center align-center py-8">
        <v-progress-circular indeterminate color="primary" size="32"></v-progress-circular>
      </div>
      <div v-else-if="error" class="text-center py-6">
        <v-icon size="32" color="error" class="mb-2">mdi-alert-circle</v-icon>
        <p class="text-error text-body-2">Fehler beim Laden der Daten</p>
      </div>
      <div v-else-if="!hasNoData" class="chart-container" style="position: relative; height: 400px; width: 100%;">
        <canvas ref="chartRef"></canvas>
      </div>
      <div v-if="!pending && !error && hasNoData" class="no-data-message">
        <v-icon size="48" color="grey-lighten-1" class="mb-2">mdi-chart-line-variant</v-icon>
        <p class="text-grey-lighten-1 text-body-1">Keine Daten verfügbar</p>
        <p class="text-grey text-caption mt-1">Für diesen Zeitraum liegen keine Messwerte vor</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(...registerables, annotationPlugin);

const props = defineProps({
  title: { type: String, required: true },
  apiEndpoint: { type: String, required: true },
  icon: { type: String, default: 'mdi-chart-line' },
  unit: { type: String, default: '' },
  minLimit: { type: Number, default: null },
  maxLimit: { type: Number, default: null },
  color: { type: String, default: '#5cad8a' }
});

const chartRef = ref(null);
let chartInstance = null;
const timeRange = ref('day');
const rawData = ref(null);
const pending = ref(true);
const error = ref(false);

const hasNoData = computed(() => {
  if (!rawData.value || !Array.isArray(rawData.value)) return false;
  if (rawData.value.length === 0) return true;
  const totalPoints = rawData.value.reduce((sum, ds) => sum + (ds.data?.length || 0), 0);
  return totalPoints === 0;
});

const adjustColorOpacity = (color, opacity) => {
  if (!color) return `rgba(92, 173, 138, ${opacity})`;
  
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/, `${opacity})`);
  }
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

const fetchData = async () => {
  pending.value = true;
  error.value = false;
  try {
    const result = await $fetch(`${props.apiEndpoint}?timerange=${timeRange.value}`);
    rawData.value = result;
    await nextTick();
    await nextTick();
    renderChart();
  } catch (e) {
    error.value = true;
  } finally {
    pending.value = false;
  }
};

const getTimeUnit = () => {
  switch (timeRange.value) {
    case 'day': return 'hour';
    case 'week': return 'day';
    case 'month': return 'day';
    default: return 'hour';
  }
};

const renderChart = () => {
  if (!chartRef.value) {
    setTimeout(renderChart, 50);
    return;
  }
  
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  
  if (!rawData.value) return;

  const ctx = chartRef.value.getContext('2d');
  if (!ctx) return;

  let datasets = [];
  
  if (Array.isArray(rawData.value) && rawData.value.length > 0) {
    datasets = rawData.value.map((ds) => {
      const lineColor = ds.borderColor || props.color;
      return {
        label: ds.label || props.title,
        data: (ds.data || []).map(d => ({
          x: new Date(d.x || d.timestamp || d.time),
          y: d.y ?? d.value
        })),
        borderColor: lineColor,
        backgroundColor: adjustColorOpacity(lineColor, 0.2),
        fill: true,
        tension: 0.3,
        pointRadius: (ds.data?.length || 0) > 50 ? 0 : 2,
        pointHoverRadius: 4
      };
    });
  }

  if (datasets.length === 0) return;
  if (!datasets[0].data || datasets[0].data.length === 0) return;

  const annotations = {};
  
  if (props.minLimit !== null && props.minLimit !== undefined && props.maxLimit !== null && props.maxLimit !== undefined) {
    annotations.belowMin = {
      type: 'box',
      yMin: 0,
      yMax: props.minLimit,
      backgroundColor: 'rgba(234, 129, 98, 0.15)',
      borderColor: 'rgba(234, 129, 98, 0.3)',
      borderWidth: 1
    };
    annotations.aboveMax = {
      type: 'box',
      yMin: props.maxLimit,
      yMax: 'max',
      backgroundColor: 'rgba(234, 129, 98, 0.15)',
      borderColor: 'rgba(234, 129, 98, 0.3)',
      borderWidth: 1
    };
    annotations.minLine = {
      type: 'line',
      yMin: props.minLimit,
      yMax: props.minLimit,
      borderColor: '#EA8162',
      borderWidth: 2,
      borderDash: [5, 5]
    };
    annotations.maxLine = {
      type: 'line',
      yMin: props.maxLimit,
      yMax: props.maxLimit,
      borderColor: '#EA8162',
      borderWidth: 2,
      borderDash: [5, 5]
    };
  } else if (props.minLimit !== null && props.minLimit !== undefined) {
    annotations.belowMin = {
      type: 'box',
      yMin: 0,
      yMax: props.minLimit,
      backgroundColor: 'rgba(234, 129, 98, 0.15)',
      borderColor: 'rgba(234, 129, 98, 0.3)',
      borderWidth: 1
    };
    annotations.minLine = {
      type: 'line',
      yMin: props.minLimit,
      yMax: props.minLimit,
      borderColor: '#EA8162',
      borderWidth: 2,
      borderDash: [5, 5]
    };
  } else if (props.maxLimit !== null && props.maxLimit !== undefined) {
    annotations.aboveMax = {
      type: 'box',
      yMin: props.maxLimit,
      yMax: 'max',
      backgroundColor: 'rgba(234, 129, 98, 0.15)',
      borderColor: 'rgba(234, 129, 98, 0.3)',
      borderWidth: 1
    };
    annotations.maxLine = {
      type: 'line',
      yMin: props.maxLimit,
      yMax: props.maxLimit,
      borderColor: '#EA8162',
      borderWidth: 2,
      borderDash: [5, 5]
    };
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 3,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { display: datasets.length > 1 },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}${props.unit ? ' ' + props.unit : ''}`
          }
        },
        annotation: { annotations }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: getTimeUnit(),
            displayFormats: { hour: 'HH:mm', day: 'DD.MM.' }
          },
          grid: { display: false }
        },
        y: {
          ticks: { callback: (v) => `${v}${props.unit ? ' ' + props.unit : ''}` }
        }
      }
    }
  });
};

watch(timeRange, fetchData);

onMounted(() => {
  fetchData();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
}

.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  border-radius: 8px;
  border: 2px dashed #ccc;
}
</style>
