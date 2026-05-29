<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="8" offset-md="2">
        <v-card>
          <v-card-title style="background-color: #343a40; color: white">
            <v-icon left>mdi-robot</v-icon>
            KI-Assistent für Pflanzenpflege
          </v-card-title>

          <v-card-text class="chat-container" ref="chatContainer">
            <div v-if="messages.length === 0" class="text-center pa-6 text-medium-emphasis">
              <v-icon size="64" color="grey">mdi-robot-outline</v-icon>
              <p class="text-h6 mt-2">Wie kann ich dir helfen?</p>
              <p class="text-body-2">Stelle eine Frage zur Pflanzenpflege oder wähle eine Schnellfrage unten.</p>
            </div>

            <div v-for="(msg, i) in messages" :key="i" :class="['message-row', msg.role]">
              <v-chip v-if="msg.role === 'assistant'" class="mb-1" size="x-small" color="primary" variant="tonal">
                <v-icon start size="x-small">mdi-robot</v-icon>
                KI-Assistent
              </v-chip>
              <v-chip v-else class="mb-1" size="x-small" color="grey" variant="tonal">
                <v-icon start size="x-small">mdi-account</v-icon>
                Du
              </v-chip>
              <div :class="['message-bubble', msg.role]">
                {{ msg.content }}
              </div>
            </div>

            <div v-if="loading" class="message-row assistant">
              <v-chip class="mb-1" size="x-small" color="primary" variant="tonal">
                <v-icon start size="x-small">mdi-robot</v-icon>
                KI-Assistent
              </v-chip>
              <div class="message-bubble assistant">
                <v-progress-circular indeterminate size="16" width="2" class="mr-2" />
                Denke nach...
              </div>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-text>
            <v-select
              v-model="plantType"
              :items="availablePlants"
              label="Pflanzentyp (Kontext)"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-3"
            />

            <v-row dense class="mb-3">
              <v-col v-for="(q, i) in quickQuestions" :key="i" cols="6" md="3">
                <v-btn
                  variant="tonal"
                  size="x-small"
                  color="primary"
                  class="text-caption"
                  style="width: 100%; white-space: normal; line-height: 1.2; height: auto; padding: 6px 8px;"
                  @click="askQuestion(q)"
                  :disabled="loading"
                >
                  {{ q }}
                </v-btn>
              </v-col>
            </v-row>

            <v-text-field
              v-model="input"
              variant="outlined"
              density="compact"
              placeholder="Stelle eine Frage zur Pflanzenpflege..."
              :loading="loading"
              hide-details
              @keydown.enter="sendMessage"
            >
              <template #append-inner>
                <v-icon
                  @click="sendMessage"
                  color="primary"
                  style="cursor: pointer;"
                  :disabled="loading || !input.trim()"
                >
                  mdi-send
                </v-icon>
              </template>
            </v-text-field>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "default",
  middleware: ['authenticated']
})

const plantType = ref('Allgemein')
const messages = ref<Array<{ role: string; content: string }>>([])
const input = ref('')
const loading = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const relays = await $fetch('/api/rest/relays')

const availablePlants = computed(() => {
  const plants = new Set<string>()
  plants.add('Allgemein')
  if (relays) {
    for (const relay of relays) {
      if (relay.target) plants.add(relay.target)
    }
  }
  return Array.from(plants)
})

const quickQuestions = [
  'Optimale Temperatur für Tomaten?',
  'Anzeichen von Überwässerung?',
  'Luftfeuchtigkeit zu hoch - was tun?',
  'Pilzkrankheiten vorbeugen?',
  'Beste Bewässerungsstrategie?',
  'Nährstoffmangel erkennen?',
  'Lichtbedarf Gurken?',
  'CO2-Werte verbessern?',
]

async function sendMessage() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  loading.value = true

  try {
    const plant = plantType.value === 'Allgemein' ? null : plantType.value
    const response = await $fetch('/api/rest/ask-ai', {
      method: 'POST',
      body: { question: text, plantType: plant },
    })
    messages.value.push({ role: 'assistant', content: response.answer })
  } catch (err) {
    messages.value.push({
      role: 'assistant',
      content: 'Entschuldigung, ich habe einen Fehler bei der Verarbeitung deiner Frage. Bitte versuche es später erneut.'
    })
    console.error('AI chat error:', err)
  } finally {
    loading.value = false
    nextTick(() => scrollToBottom())
  }
}

function askQuestion(question: string) {
  input.value = question
  sendMessage()
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}
</script>

<style scoped>
.chat-container {
  max-height: 500px;
  overflow-y: auto;
  padding: 16px;
}

.message-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  max-width: 80%;
}

.message-row.assistant {
  align-items: flex-start;
}

.message-row.user {
  align-items: flex-end;
  margin-left: auto;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.4;
}

.message-bubble.assistant {
  background: rgba(92, 173, 138, 0.15);
  color: inherit;
  border-bottom-left-radius: 4px;
}

.message-bubble.user {
  background: rgba(33, 150, 243, 0.15);
  color: inherit;
  border-bottom-right-radius: 4px;
}
</style>
