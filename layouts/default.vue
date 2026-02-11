<template>
    <v-app style="background-color: #dfdfdf">

      <v-system-bar app color="#343a40" theme="dark" :height="$vuetify.display.mobile ? '70' : undefined">
        <v-col class="text-left hidden-lg-and-up">
          <v-app-bar-nav-icon variant="tonal" @click="drawer = !drawer"></v-app-bar-nav-icon>
        </v-col>
        <span style="margin-right: 10px;">
          {{ stats.wifiSignalStrength }}dBi
          <v-icon>{{ wifiIcon(stats.wifiSignalStrength) }}</v-icon>
        </span>
        <span style="margin-right: 10px;">
          {{ databaseFillmentState(dbstats) }}%
          <v-icon>{{ databaseIcon(databaseFillmentState(dbstats)) }}</v-icon>
        </span>
        <span>{{ currentTime }}</span>
      </v-system-bar>

      <v-navigation-drawer app v-model="drawer" theme="dark" color="#343a40">
        <v-list>
          <v-list-item class="hidden-md-and-down">
            <img width="220" src="/img/green_sphere.gif" />
          </v-list-item>
          <v-list-item class="logo">
            <template v-slot:prepend>
              <img height="40" class="mr-2" src="/img/logo.png" />
            </template>
            Greenhouse
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list nav>
          <v-list-item to="/dashboard">
            <template v-slot:prepend>
              <v-icon>mdi-home</v-icon>
            </template>
            <v-list-item-title style="line-height: 2rem;" class="text-h6">Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item to="/satellites">
            <template v-slot:prepend>
              <v-icon>mdi-home-automation</v-icon>
            </template>
            <v-list-item-title style="line-height: 2rem;" class="text-h6">Satelliten</v-list-item-title>
          </v-list-item>
          <v-list-item to="/control">
            <template v-slot:prepend>
              <v-icon>mdi-toggle-switch</v-icon>
            </template>
            <v-list-item-title style="line-height: 2rem;" class="text-h6">Steuerung</v-list-item-title>
          </v-list-item>
          <v-list-item to="/limits">
            <template v-slot:prepend>
              <v-icon>mdi-plus-minus-box</v-icon>
            </template>
            <v-list-item-title style="line-height: 2rem;" class="text-h6">Grenzwerte</v-list-item-title>
          </v-list-item>
          <v-list-item to="/automation">
            <template v-slot:prepend>
              <v-icon>mdi-cog-box</v-icon>
            </template>
            <v-list-item-title style="line-height: 2rem;" class="text-h6">Automatik</v-list-item-title>
          </v-list-item>
          <v-list-item to="/history">
            <template v-slot:prepend>
              <v-icon>mdi-chart-areaspline</v-icon>
            </template>
            <v-list-item-title style="line-height: 2rem;" class="text-h6">Historie</v-list-item-title>
          </v-list-item>
          <v-list-item to="/users">
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title style="line-height: 2rem;" class="text-h6">Benutzer</v-list-item-title>
          </v-list-item>
          <v-divider class="mb-4" />
          <v-list-item>
            <v-btn style="width: 100%" variant="elevated" size="x-large" color="#6aab8b" @click="logout" to="/">
              <v-icon>mdi-logout</v-icon>
              logout
            </v-btn>
          </v-list-item>
          <v-list-item link>
            <template v-slot:prepend>
              <v-avatar color="black">
                <v-icon>mdi-account</v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="text-h6 mt-2">
              {{ username }}
            </v-list-item-title>
            <v-list-item-subtitle class="mt-3">{{ email }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider />
          <v-list-item style="min-height: 20px;">
            <v-list-item-subtitle class="ma-3" style="align-items: center;">
              <i>© Copyright 2026 Greenhouse</i>
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>



      <v-main>
        <slot />
      </v-main>
    </v-app>
</template>

<style scoped>
.logo {
  color: #5cad8a;
  font-weight: bold;
  font-size: 26px;
  font-family: 'Orbitron'
}
</style>

<script setup>
const { user, clear: clearSession } = useUserSession()

const username = user.value.name
const email = user.value.email


const drawer = ref(null)
const currentTime = ref({})
const stats = ref({
  wifiSignalStrength: 0,
  batteryState: 0,
})

const dbstats = await $fetch('/api/rest/database/stats');

async function logout() {
  await clearSession()
  await navigateTo('/')
}

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
    let TEN_MB_IN_BYTE = 104857600;
    let percent = dbSize / (TEN_MB_IN_BYTE / 100);
    return Math.round(percent);
  } else {
    return 0
  }
}

onMounted(() => {
  calculateCurrentTime()
  setInterval(calculateCurrentTime, 10000);
  
  // Use runtime config to get the base URL
  const config = useRuntimeConfig()
  const wsUrl = config.public.wssBaseUrl.replace(/^ws/, 'ws') + '/api/socket/sensors/measurements'
  
  const socket = new WebSocket(wsUrl);
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
