<template>
    <v-card :loading="isLoading">
        <v-card-title>
            <v-icon size="30" class="mr-3">{{ icon }}</v-icon>
            {{ headline }}
        </v-card-title>
        <v-card-subtitle>
            {{ description }}
        </v-card-subtitle>
        <v-card-text>
            <v-text-field prepend-icon="mdi-arrow-collapse-down" variant="outlined" :model-value="minAlarmValue"
                label="untere Grenze:" :suffix="unit" type="number"
                @input="$emit('update:minAlarmValue', $event.target.value)" />
            <v-text-field :model-value="maxAlarmValue" prepend-icon="mdi-arrow-collapse-up" variant="outlined"
                label="obere Grenze:" :suffix="unit" type="number"
                @input="$emit('update:maxAlarmValue', $event.target.value)" />
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" variant="elevated" @click="saveClick" :disabled="!saveButtonEnabled" size="x-large">
                Speichern
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
const saveButtonEnabled = ref(false)
const isLoading = ref(false)
const config = useRuntimeConfig()

const saveClick = async () => {
    isLoading.value = true;
    let sensor = await $fetch(`${config.apiBaseUrl}/backend/sensor/${props.id}`, {method: 'GET'})
    sensor.minAlarmValue = parseInt(props.minAlarmValue);
    sensor.maxAlarmValue = parseInt(props.maxAlarmValue);
    await $fetch(`${config.apiBaseUrl}/backend/sensor/${props.id}`, {
        method: 'PUT',
        body: sensor
    })
    saveButtonEnabled.value = false;
    isLoading.value = false;
}

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    minAlarmValue: {
        required: true,
    },
    maxAlarmValue: {
        required: true,
    },
})

watch(() => props.minAlarmValue, (first, second) => {
    saveButtonEnabled.value = true
});

watch(() => props.maxAlarmValue, (first, second) => {
    saveButtonEnabled.value = true
});
</script>
