<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="sensor in sensors" v-bind:key="sensor.name + sensor.unit" cols="12" sm="12" md="3" lg="3">
        <LimitCard :id="sensor.id" :headline="sensor.name" v-model:max-alarm-value="sensor.maxAlarmValue"
          :icon="sensor.icon" v-model:min-alarm-value="sensor.minAlarmValue" :unit="sensor.unit" :key="sensor.name"
          :description="sensor.description" :value="sensor.value" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { data: sensors } = await useAsyncData('sensors', () => $fetch('/api/rest/sensors'));
</script>
