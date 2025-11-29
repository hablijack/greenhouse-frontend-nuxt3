<template>
  <v-card :theme="relayValue ? 'dark' : 'light'" :style="relayStyle">
    <v-list-item three-line>
      <v-list-item-title class="text-overline">
        {{ name }}<span v-if="target">: <strong>{{ target }}</strong></span>
      </v-list-item-title>
      
      <v-list-item-subtitle class="py-4">
        <ToggleButton 
          v-if="!transmitting"
          :id="id" 
          :defaultState="initialValue" 
          :color="color"
          labelEnableText="AN" 
          labelDisableText="AUS"
          @change="toggleButtonChangedEvent" 
        />
        <v-progress-linear 
          v-else
          :color="relayValue ? 'white' : color" 
          indeterminate 
          rounded 
          height="55"
        />
      </v-list-item-subtitle>
      
      <v-list-item-subtitle>
        {{ description }}
      </v-list-item-subtitle>

      <template #append>
        <v-icon :color="relayValue ? 'white' : '#343a40'" size="120">
          {{ icon }}
        </v-icon>
      </template>
    </v-list-item>
  </v-card>
</template>

<script setup>
const props = defineProps({
  id: String,
  name: String,
  target: String,
  initialValue: Boolean,
  description: String,
  icon: String,
  color: String,
})

const { user } = useUserSession()
const username = computed(() => user.value?.email || '')

const relayValue = ref(props.initialValue || false)
const transmitting = ref(false)

const relayStyle = computed(() => 
  relayValue.value ? `background-color: ${props.color}` : ''
)

const toggleButtonChangedEvent = async (newValue) => {
  transmitting.value = true
  try {
    await $fetch(`/api/rest/relay/${props.id}/switch`, {
      method: 'POST',
      body: {
        initiator: username.value,
        newValue,
      }
    })
    relayValue.value = newValue
  } finally {
    transmitting.value = false
  }
}
</script>
