<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" sm="12" md="12" lg="6">
        <v-row dense>
          <v-col v-for="relay in relays" v-bind:key="relay.name" cols="12">
            <Relay :id="relay.identifier" :name="relay.name" :target="relay.target" :initialValue="relay.value"
              :description="relay.description" :icon="relay.icon" :color="relay.color" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="6">
        <v-card style="height: 100%">
          <v-list-item three-line>
            <div class="text-overline">Logbuch:</div>
            <v-table class="elevation-1" density="compact">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Zeitpunkt</th>
                    <th class="text-left">Initiator</th>
                    <th class="text-left">Event</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="log in logs" :key="log.id">
                    <td>{{ formatTimestamp(log.timestamp) }}</td>
                    <td>{{ log.initiator }}</td>
                    <td>
                      <v-chip label outlined :color="log.value ? 'green' : 'gray'" v-if="log.relay">
                        {{ log.relay.target }}
                        {{ log.relay.name }}
                      </v-chip>
                      {{ log.value ? "angeschaltet" : "ausgeschaltet" }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';

// Initialize logs array as empty
const logs = ref([]);

// Get relays data
const relays = await $fetch('/api/rest/relays');

// Get username from user session
const { user } = useUserSession()
const username = user.value.name

// Format timestamp function
function formatTimestamp(timestamp) {
  try {
    return Intl.DateTimeFormat("de-DE", { dateStyle: 'medium', timeStyle: 'medium' }).format(new Date(timestamp))
  } catch (e) {
    return e.message;
  }
}

onMounted(() => {
  // Use runtime config to get the base URL
  const config = useRuntimeConfig()
  const wsUrl = config.public.wssBaseUrl.replace(/^ws/, 'ws') + '/api/socket/relays/' + username
  
  const socket = new WebSocket(wsUrl);
  socket.onmessage = function (message) {
    let newLogEntries = JSON.parse(message.data)
    logs.value.unshift(...newLogEntries);
    // Keep only the last 10 entries
    if (logs.value.length > 10) {
      logs.value = logs.value.slice(0, 10);
    }
  };
});
</script>