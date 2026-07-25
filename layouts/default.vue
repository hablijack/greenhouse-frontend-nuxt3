<template>
    <v-app class="default-layout">

      <v-system-bar app color="#343a40" theme="dark" class="system-bar" :height="$vuetify.display.mobile ? '70' : undefined">
        <v-col class="text-left hidden-lg-and-up menu-btn-col">
          <v-app-bar-nav-icon variant="tonal" @click="drawer = !drawer"></v-app-bar-nav-icon>
        </v-col>
        <span class="system-bar-item">
          {{ stats.wifiSignalStrength }}dBi
          <v-icon>{{ wifiIcon(stats.wifiSignalStrength) }}</v-icon>
        </span>
        <span class="system-bar-item">
          {{ databaseFillmentState(dbstats) }}%
          <v-icon>{{ databaseIcon(databaseFillmentState(dbstats)) }}</v-icon>
        </span>
        <span class="system-bar-item">{{ currentTime }}</span>
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
            <v-list-item-title class="text-h6">Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item to="/satellites">
            <template v-slot:prepend>
              <v-icon>mdi-home-automation</v-icon>
            </template>
            <v-list-item-title class="text-h6">Satelliten</v-list-item-title>
          </v-list-item>
          <v-list-item to="/control">
            <template v-slot:prepend>
              <v-icon>mdi-toggle-switch</v-icon>
            </template>
            <v-list-item-title class="text-h6">Steuerung</v-list-item-title>
          </v-list-item>
          <v-list-item to="/planting-tracks">
            <template v-slot:prepend>
              <v-icon>mdi-sprout</v-icon>
            </template>
            <v-list-item-title class="text-h6">Pflanzspuren</v-list-item-title>
          </v-list-item>
          <v-list-item to="/limits">
            <template v-slot:prepend>
              <v-icon>mdi-plus-minus-box</v-icon>
            </template>
            <v-list-item-title class="text-h6">Grenzwerte</v-list-item-title>
          </v-list-item>
          <v-list-item to="/automation">
            <template v-slot:prepend>
              <v-icon>mdi-cog-box</v-icon>
            </template>
            <v-list-item-title class="text-h6">Automatik</v-list-item-title>
          </v-list-item>
          <v-list-item to="/history">
            <template v-slot:prepend>
              <v-icon>mdi-chart-areaspline</v-icon>
            </template>
            <v-list-item-title class="text-h6">Historie</v-list-item-title>
          </v-list-item>
          <v-list-item to="/ai">
            <template v-slot:prepend>
              <v-icon>mdi-robot</v-icon>
            </template>
            <v-list-item-title class="text-h6">KI-Assistent</v-list-item-title>
          </v-list-item>
          <v-list-item to="/users">
            <template v-slot:prepend>
              <v-icon>mdi-account</v-icon>
            </template>
            <v-list-item-title class="text-h6">Benutzer</v-list-item-title>
          </v-list-item>
          <v-divider class="mb-4" />
          <v-list-item>
            <v-btn class="logout-btn" variant="elevated" size="x-large" color="#6aab8b" @click="logout" to="/">
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
          <v-list-item class="copyright-item">
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
.default-layout {
  background-color: #dfdfdf;
}

.system-bar {
  gap: 10px;
}

.system-bar-item {
  margin-right: 10px;
}

.menu-btn-col {
  /* intentional */
}

.copyright-item {
  min-height: 20px;
}

.logout-btn {
  width: 100%;
}

.v-list-item--nav .v-list-item-title {
  font-size: 20px !important;
}

.logo {
  color: #5cad8a;
  font-weight: bold;
  font-size: 26px;
  font-family: 'Orbitron'
}
</style>

<script setup lang="ts">
const { user, clear: clearSession } = useUserSession()

const username = computed(() => user.value?.name ?? 'Gast')
const email = computed(() => user.value?.email ?? '')

let timeInterval: ReturnType<typeof setInterval> | null = null

const drawer = ref(null)
const currentTime = ref({})
const stats = ref({
  wifiSignalStrength: 0,
  batteryState: 0,
})

const { data: dbstatsData } = await useFetch('/api/rest/database/stats')
const dbstats = computed(() => dbstatsData.value ?? null)

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

// Generic icon helper for threshold-based icon selection
function iconForThreshold(value: number, prefix: string, maxSteps: number): string {
  const step = 100 / maxSteps
  return `${prefix}-${Math.ceil(Math.min(value, 100) / step)}`
}

const databaseIcon = (state: number): string => iconForThreshold(state, 'mdi-circle-slice', 8)
const wifiIcon = (strength: number): string => iconForThreshold(strength, 'mdi-wifi-strength', 4)
const batteryIcon = (stat: number): string => iconForThreshold(stat, 'mdi-battery', 10)
const databaseFillmentState = (dbstats: any) => {
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
  timeInterval = setInterval(calculateCurrentTime, 10000);
  
  // Use Nuxt proxy endpoint for WebSocket connection
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = window.location.host
  const wsUrl = `${protocol}//${host}/api/socket/sensors/measurements`
  
  const socket = new WebSocket(wsUrl);
  socket.onopen = () => console.log('[WS] layout connected');
  socket.onerror = (err) => console.error('[WS] layout error:', err);
  socket.onclose = (ev) => console.log('[WS] layout closed:', ev.code, ev.reason);
  socket.onmessage = function (message) {
    let measurements = JSON.parse(message.data)
    let newStats = {
      wifiSignalStrength: measurements.wifi,
      batteryState: Math.round(measurements.battery)
    }
    stats.value = newStats
  };
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }
});
</script>
