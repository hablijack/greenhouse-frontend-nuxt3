<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title style="background-color: #343a40; color: white">
            <v-icon left>mdi-cog-box</v-icon>
            Automatik
          </v-card-title>
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="12" sm="12" md="12" lg="4" v-for="(relay, i) in relays" :key="i">
                <AutomationCard :id="relay.id" :icon="relay.icon" :target="relay.target" :headline="relay.name"
                  :description="relay.description" :initialTimeTriggerActive="relay.timeTrigger.active"
                  :initialConditionTriggerActive="relay.conditionTrigger.active"
                  :initialTimeRule="relay.timeTrigger.cronString" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const relays = await $fetch('/api/rest/relays');
</script>
