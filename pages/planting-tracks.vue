<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title style="background-color: #343a40; color: white">
            <v-icon left>mdi-sprout</v-icon>
            Planting Tracks
          </v-card-title>
          <v-card-text class="pt-4">
            <v-alert
              v-if="wateringRelays.length === 0"
              type="info"
              variant="tonal"
            >
              No watering relays found.
            </v-alert>
            
            <v-table v-else density="comfortable">
              <thead>
                <tr>
                  <th class="text-left">Relay</th>
                  <th class="text-left">Plant Type</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="relay in wateringRelays" :key="relay.id">
                  <td>
                    <v-icon :color="relay.color" class="mr-2">{{ relay.icon }}</v-icon>
                    {{ relay.name }}
                  </td>
                  <td>
                    <v-select
                      v-model="relay.target"
                      :items="plantOptions"
                      variant="outlined"
                      density="compact"
                      hide-details
                      style="max-width: 300px"
                      @update:model-value="updateTarget(relay)"
                    />
                  </td>
                  <td>
                    <v-btn
                      color="primary"
                      variant="tonal"
                      size="small"
                      :loading="savingId === relay.id"
                      @click="updateTarget(relay)"
                    >
                      <v-icon left>mdi-content-save</v-icon>
                      Save
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
definePageMeta({
  middleware: 'authenticated'
})

const relays = ref([])
const savingId = ref(null)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('success')

const plantOptions = [
  'Tomatoes',
  'Salad',
  'Cucumber',
  'Radishes',
  'Melons',
  'Grapes',
  'Peppers',
  'Zucchini',
  'Beans',
  'Peas',
  'Spinach',
  'Carrots',
  'Onions',
  'Garlic',
  'Basil',
  'Parsley',
  'Chives',
  'Oregano',
  'Thyme',
  'Rosemary',
  'Other'
]

const wateringRelays = computed(() => {
  return relays.value.filter(relay => 
    relay.icon === 'mdi-water' || 
    relay.name.toLowerCase().includes('bewässerung') ||
    relay.name.toLowerCase().includes('wasser')
  )
})

async function loadRelays() {
  try {
    relays.value = await $fetch('/api/rest/relays')
  } catch (error) {
    showSnackbar('Error loading relays', 'error')
  }
}

async function updateTarget(relay) {
  savingId.value = relay.id
  try {
    await $fetch(`/api/rest/relay/${relay.id}/target`, {
      method: 'POST',
      body: {
        target: relay.target || null
      }
    })
    showSnackbar(`${relay.name} updated`, 'success')
  } catch (error) {
    showSnackbar('Error saving', 'error')
  } finally {
    savingId.value = null
  }
}

function showSnackbar(text, color = 'success') {
  snackbarText.value = text
  snackbarColor.value = color
  snackbar.value = true
}

onMounted(() => {
  loadRelays()
})
</script>
