<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="4" v-for="(relay, i) in relays" :key="i">
        <AutomationCard :id="relay.id" :icon="relay.icon" :target="relay.target" :headline="relay.name"
          :description="relay.description" :initialTimeTriggerActive="relay.timeTrigger.active"
          :initialConditionTriggerActive="relay.conditionTrigger.active"
          :initialTimeRule="relay.timeTrigger.cronString" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const { data: relays } = await useAsyncData('relays', () => $fetch('/api/rest/relays'));
</script>
