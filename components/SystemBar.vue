<template>
  <v-system-bar color="#343a40" theme="dark">
    <v-btn class="hidden-lg-and-up mobile-btn" color="black" @click="$emit('change-drawer-state')"><v-icon>mdi-menu</v-icon></v-btn>
    <v-spacer />
    <span style="margin-right: 10px;">
      {{ stats.wifiSignalStrength }}%
      <v-icon>{{ wifiIcon(stats.wifiSignalStrength) }}</v-icon>
    </span>
    <span style="margin-right: 10px;">
      {{ stats.batteryState }}%
      <v-icon>{{ batteryIcon(stats.batteryState) }}</v-icon>
    </span>
    <span style="margin-right: 10px;">
      {{ databaseFillmentState(dbstats) }}%
      <v-icon>{{ databaseIcon(dbstats) }}</v-icon>
    </span>
    <span>{{ currentTime }}</span>
  </v-system-bar>
</template>

<style scoped>
  .mobile-btn {
    position: fixed;
    height: 50px;
    top: 0;
    left: 0;
  }
</style>

<script setup>
import { onMounted } from 'vue';

const currentTime = ref({})
const stats = ref({
  wifiSignalStrength: 0,
  batteryState: 0,
})

const config = useRuntimeConfig()
const { data: dbstats } = await useAsyncData('dbstats', () => $fetch(config.apiBaseUrl + '/backend/database/stats'));

const calculateCurrentTime = () => {
  const date = new Date();
  currentTime.value = date.toLocaleTimeString(
    ['de-DE'],
    { hour: '2-digit', minute: '2-digit' }
  );
}

const databaseIcon = (state) => {
  if (!state) {
    return "mdi-circle-slice-1";
  } else if (state <= 12.5) {
    return "mdi-circle-slice-1";
  } else if (state <= 25) {
    return "mdi-circle-slice-2";
  } else if (state <= 37.5) {
    return "mdi-circle-slice-3";
  } else if (state <= 50) {
    return "mdi-circle-slice-4";
  } else if (state <= 62.5) {
    return "mdi-circle-slice-5";
  } else if (state <= 75) {
    return "mdi-circle-slice-6";
  } else if (state <= 87.5) {
    return "mdi-circle-slice-7";
  } else {
    return "mdi-circle-slice-8";
  }
}
const wifiIcon = (strength) => {
  if (strength <= 25) {
    return "mdi-wifi-strength-1";
  } else if (strength <= 50) {
    return "mdi-wifi-strength-2";
  } else if (strength <= 75) {
    return "mdi-wifi-strength-3";
  } else {
    return "mdi-wifi-strength-4";
  }
}
const batteryIcon = (stat) => {
  if (stat <= 10) {
    return "mdi-battery-10";
  } else if (stat <= 20) {
    return "mdi-battery-20";
  } else if (stat <= 30) {
    return "mdi-battery-30";
  } else if (stat <= 40) {
    return "mdi-battery-40";
  } else if (stat <= 50) {
    return "mdi-battery-50";
  } else if (stat <= 60) {
    return "mdi-battery-60";
  } else if (stat <= 70) {
    return "mdi-battery-70";
  } else if (stat <= 80) {
    return "mdi-battery-80";
  } else if (stat <= 90) {
    return "mdi-battery-90";
  } else {
    return "mdi-battery";
  }
}
const databaseFillmentState = (dbstats) => {
  if (dbstats) {
    let dbSize = dbstats.measurementSizeByte + dbstats.relayLogSizeByte;
    let FIVE_GB_IN_BYTE = 5368709120;
    let percent = dbSize / (FIVE_GB_IN_BYTE / 100);
    return Math.round(percent);
  } else {
    return 0
  }
}

onMounted(() => {
  calculateCurrentTime()
  setInterval(calculateCurrentTime, 10000);
  const socket = new WebSocket(
    config.wssBaseUrl + '/backend/sensors/measurements/socket'
  );
  socket.onmessage = function (message) {
    let measurements = JSON.parse(message.data)
    let newStats = {
      wifiSignalStrength: measurements.wifi,
      batteryState: Math.round(measurements.battery)
    }
    stats.value = newStats
  };
});
</script>