<template>
  <v-container fluid>
    <v-row dense>
      <v-col v-for="sensor in sliceSensors(sensors, 0, 4)" v-bind:key="sensor.name + sensor.identifier" cols="12" sm="12"
        md="6" lg="3">
        <MeasureCard :headline="sensor.name" :measurement="measurements[sensor.identifier]" :unit="sensor.unit"
          :description="sensor.description" :icon="sensor.icon" :minAlarmValue="sensor.minAlarmValue"
          :decimals="sensor.decimals" :maxAlarmValue="sensor.maxAlarmValue" />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12" sm="12" md="12" lg="9" style="position: relative">
        <v-row dense justify="end" style="
            position: absolute;
            bottom: 0;
            left: 0;
            padding: 10px;
            z-index: 20;
            width: 100%;
          ">
          <v-col v-for="relay in relays" v-bind:key="relay.name">
            <MiniRelay :color="relay.value ? relay.color : '#343a40'" :name="relay.identifier" :target="relay.target"
              :icon="relay.icon" />
          </v-col>
        </v-row>

        <v-card>
          <v-img :src="cameraPictureUrl()" cover style="transform: rotate(180deg);"></v-img>
        </v-card>
      </v-col>
      <v-col cols="12" sm="12" md="12" lg="3">
        <v-row dense>
          <v-col v-for="sensor in sliceSensors(sensors, 4, 10)" v-bind:key="sensor.name" cols="12" sm="12" md="6" lg="12">
            <MeasureCard :headline="sensor.name" :measurement="measurements[sensor.identifier]" :unit="sensor.unit"
              :description="sensor.description" :icon="sensor.icon" color="#5cad8a" />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="sensor in sliceSensors(sensors, 10, sensors.length)" v-bind:key="sensor.name" cols="12" sm="12" md="6"
        lg="3">
        <MeasureCard :headline="sensor.name" :measurement="measurements[sensor.identifier]" :unit="sensor.unit"
          :description="sensor.description" :icon="sensor.icon" color="#5cad8a" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
const measurements = ref({})
const config = useRuntimeConfig()

const { data: sensors } = await useAsyncData('sensors', () => $fetch(config.public.apiBaseUrl + '/backend/sensors'));
const { data: relays } = await useAsyncData('relays', () => $fetch(config.public.apiBaseUrl + '/backend/relays'));
onMounted(() => {
  const socket = new WebSocket(
    config.public.wssBaseUrl + '/backend/sensors/measurements/socket'
  );
  socket.onmessage = function (message) {
    measurements.value = JSON.parse(message.data);
  };
});

const cameraPictureUrl = () => {
  return config.public.apiBaseUrl + '/backend/satellites/greenhouse-cam/picture.jpg'
}

const sliceSensors = (sensors, start, end) => {
  if (sensors) {
    return sensors.slice(start, end)
  } else {
    return []
  }
}
</script>
