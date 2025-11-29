<template>
  <v-card :loading="isLoading">
    <v-card-title>
      <v-icon size="30" class="mr-2">{{ icon }}</v-icon>
      <span class="text-h6">{{ headline }}: {{ target }}</span>
      <v-spacer />
      <v-icon :color="activeIconColor" size="30">mdi-circle</v-icon>
    </v-card-title>
    
    <v-card-subtitle>{{ description }}</v-card-subtitle>
    
    <v-card-text>
      <div class="mb-6">
        <h3 class="text-h6 mb-3">Zeitsteuerung:</h3>
        <ToggleButton 
          :id="`time${id}`" 
          color="#5cad8a" 
          :defaultState="initialTimeTriggerActive"
          labelEnableText="AN" 
          labelDisableText="AUS" 
          @change="timeTriggerEnabled = $event" 
        />
      </div>
      
      <v-card class="mb-6" variant="outlined" :disabled="!timeTriggerEnabled">
        <v-card-text>
          <v-select 
            v-model="dayRule" 
            :items="dayRules" 
            label="Tages Regel" 
            hide-details
            :disabled="!timeTriggerEnabled" 
          />
          <v-select 
            v-model="hourRule" 
            :items="hourRules" 
            label="Stunden Regel" 
            hide-details
            class="mt-4"
            :disabled="!timeTriggerEnabled" 
          />
          <v-select 
            v-model="minuteRule" 
            :items="minuteRules" 
            label="Aktivierungsdauer" 
            hide-details
            class="mt-4"
            :disabled="!timeTriggerEnabled" 
          />
        </v-card-text>
      </v-card>
      
      <div class="mb-6">
        <h3 class="text-h6 mb-3">Bedingungssteuerung:</h3>
        <ToggleButton 
          :id="`condition${id}`" 
          :defaultState="initialConditionTriggerActive" 
          color="#5cad8a"
          labelEnableText="AN" 
          labelDisableText="AUS" 
          @change="conditionTriggerEnabled = $event" 
        />
      </div>

      <v-card variant="outlined" :disabled="!conditionTriggerEnabled">
        <v-card-text>
          <v-select 
            :items="items" 
            label="Trigger Sensor" 
            hide-details
            :disabled="!conditionTriggerEnabled" 
          />
        </v-card-text>
      </v-card>
    </v-card-text>
    
    <v-card-actions>
      <v-btn 
        color="primary" 
        @click="saveClick" 
        :disabled="!saveButtonEnabled" 
        size="x-large"
        block
      >
        Speichern
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style lang="scss" scoped>
.v-card--disabled {
    background-color: #f0f0f0;
    border-color: #f0f0f0;
}
</style>

<script setup>
const props = defineProps({
  id: Number,
  icon: String,
  target: String,
  headline: String,
  description: String,
  initialTimeTriggerActive: Boolean,
  initialConditionTriggerActive: Boolean,
  initialTimeRule: String,
})

const timeTriggerEnabled = ref(props.initialTimeTriggerActive)
const conditionTriggerEnabled = ref(props.initialConditionTriggerActive)
const saveButtonEnabled = ref(false)
const isLoading = ref(false)

const minuteRule = ref(props.initialTimeRule)
const hourRule = ref(props.initialTimeRule)
const dayRule = ref(props.initialTimeRule)

const minuteRules = [
  'für 1 Minute', 'für 2 Minuten', 'für 3 Minuten', 'für 5 Minuten',
  'für 6 Minuten', 'für 7 Minuten', 'für 8 Minuten', 'für 10 Minuten',
  'für 15 Minuten', 'für 30 Minuten'
]

const hourRules = [
  'Stündlich von 8 - 18 Uhr',
  'alle 2 Stunden von 8 - 18 Uhr',
  'um 08, 10, 12, 14, 17 Uhr',
  'um 08, 10, 12, 13, 16, 18 Uhr',
  'Mittens', 'Morgens', 'Abends',
  'Morgens und Abends',
  'Morgens, Mittags und Abends'
]

const dayRules = ['Täglich', 'Alle 2 Tage', 'Wöchentlich']

const items = []

const activeIconColor = computed(() => 
  (timeTriggerEnabled.value || conditionTriggerEnabled.value) ? '#5cad8a' : 'gray'
)

const saveClick = async () => {
  console.log("save clicked")
}
</script>
