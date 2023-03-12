<template>
  <v-card :v-bind="relayValue" :theme="relayValue ? 'dark' : 'bright'" :style="relayStyle">
    <v-list-item three-line>
      <div class="text-overline">
        {{ name }}
        <span :if="target">: <strong>{{ target }}</strong></span>
      </div>
      <v-list-item-title style="height: auto">
        <ToggleButton :id="id" :defaultState="initialValue" :color="color"
          :style="transmitting ? 'display: none' : 'display: block'" labelEnableText="AN" labelDisableText="AUS"
          @change="toggleButtonChangedEvent" />
        <v-progress-linear :color="relayValue ? 'white' : color" style="width: 100%" indeterminate rounded height="55"
          v-if="transmitting" />
      </v-list-item-title>
      <v-list-item-subtitle>
        <div style="height: 34px">
          {{ description }}
        </div>
      </v-list-item-subtitle>

      <template v-slot:append>
        <v-icon :v-bind="relayValue" :color="relayValue ? 'white' : '#343a40'" size="120">
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
  color: String
})

const apiBaseUrl = useRuntimeConfig().apiBaseUrl
const username = useSession().data.value?.user?.name

const relayValue = ref(props.initialValue || false)
const transmitting = ref(false)

const relayStyle = computed(() => {
  if (relayValue.value) {
    return "background-color: ".concat(props.color);
  }
})

const toggleButtonChangedEvent = (newValue) => {
  transmitting.value = true;
  $fetch(`${apiBaseUrl}/backend/relay/${props.id}/switch`, {
    method: 'POST',
    body: {
      initiator: username,
      newValue: newValue,
    }
  }).then(() => {
    transmitting.value = false;
    relayValue.value = newValue;
  })
}
</script>
