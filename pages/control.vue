<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" sm="12" md="12" lg="6">
        <v-row dense>
          <v-col v-for="relay in relays" v-bind:key="relay.name" cols="12">
            <Relay :id="relay.identifier" :name="relay.name" :initialValue="relay.value" :description="relay.description"
              :icon="relay.icon" :color="relay.color" />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="6">
        <v-card style="height: 100%">
          <v-list-item three-line>
            <div class="text-overline">Logbuch:</div>
            <v-table>
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
                    <td>{{ log.timestamp }}</td>
                    <td>{{ log.initiator }}</td>
                    <td>
                      hat
                      <v-chip label outlined :color="log.value ? 'green' : 'gray'">{{ log.relay.name }}</v-chip>
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
import { onMounted } from 'vue';
const ses = useSession()
const username = ses.data.value?.user?.name
const logs = ref([])
const config = useRuntimeConfig()

const { data: relays } = await useAsyncData('relays', () => $fetch(config.apiBaseUrl + '/api/relays'));

onMounted(() => {
  const socket = new WebSocket(
    config.wssBaseUrl + '/api/relays/socket/' + username
  );
  socket.onmessage = function (message) {
    let newLogEntries = JSON.parse(message.data)
    logs.value.unshift(...newLogEntries);
    logs.value.pop();
  };
});
</script>