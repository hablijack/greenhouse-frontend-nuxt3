<template>
    <v-card :loading="isLoading">
        <v-card-title>
            <v-icon size="30">{{ icon }}</v-icon>
            <span class="text-h6">{{ headline }}</span>
            <span class="float-right">
                <v-icon :color="activeIconColor" size="30">mdi-circle</v-icon>
            </span>
        </v-card-title>
        <v-card-subtitle>
            {{ description }}
        </v-card-subtitle>
        <v-card-text>
            <div class="mt-8 mb-3">
                <span class="text-h6">Zeitsteuerung:</span>
                <ToggleButton :id="'time' + id" color="#5cad8a" :defaultState="initialTimeTriggerActive"
                    labelEnableText="AN" labelDisableText="AUS" @change="timeTriggerSwitchEvent" />
            </div>
            <v-card class="mb-6" variant="outlined" :disabled="!timeTriggerEnabled">
                <v-card-text>
                    <v-select hide-details :items="dayRules" label="Tages Regel" class="mb-6"
                        :disabled="!timeTriggerEnabled" />
                    <v-select hide-details :items="hourRules" label="Stunden Regel" class="mb-6"
                        :disabled="!timeTriggerEnabled" />
                    <v-select hide-details :items="minuteRules" label="Aktivierungsdauer" :disabled="!timeTriggerEnabled" />
                </v-card-text>
            </v-card>
            <div class="mt-8 mb-3">
                <span class="text-h6">Bedingungssteuerung:</span>
                <ToggleButton :id="'condition' + id" :defaultState="initialConditionTriggerActive" color="#5cad8a"
                    labelEnableText="AN" labelDisableText="AUS" @change="conditionTriggerSwitchEvent" />
            </div>

            <v-card variant="outlined" :disabled="!conditionTriggerEnabled">
                <v-card-text>
                    <v-select hide-details :items="items" label="Trigger Sensor" class="mb-5"
                        :disabled="!conditionTriggerEnabled" />
                </v-card-text>
            </v-card>
        </v-card-text>
        <v-card-actions>
            <v-btn color="primary" @click="saveClick" :disabled="!saveButtonEnabled" class="mt-6" x-large>
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

<script>
export default {
    name: "AutomationCard",
    props: {
        id: {
            type: Number,
            required: true,
        },
        icon: {
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
        initialTimeTriggerActive: {
            type: Boolean,
            required: true,
        },
        initialConditionTriggerActive: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            timeTriggerEnabled: this.initialTimeTriggerActive,
            conditionTriggerEnabled: this.initialConditionTriggerActive,
            saveButtonEnabled: false,
            isLoading: false,
            minuteRules: [
                'f??r 1 Minute',
                'f??r 2 Minuten',
                'f??r 5 Minuten',
                'f??r 6 Minuten',
                'f??r 7 Minuten',
                'f??r 8 Minuten',
                'f??r 10 Minuten',
                'f??r 15 Minuten',
                'f??r 30 Minuten'
            ],
            hourRules: [
                'St??ndlich von 8 - 18 Uhr',
                'alle 2 Stunden von 8 - 18 Uhr',
                'um 08, 10, 11, 12, 13, 17, 18 Uhr',
                'Mittags',
                'Morgens',
                'Abends',
                'Morgens und Abends',
                'Morgens, Mittags und Abends'
            ],
            dayRules: [
                'T??glich',
                'Alle 2 Tage',
                'W??chentlich'
            ]
        };
    },
    methods: {
        saveClick: async function () {
            console.log("save clicked");
        },
        conditionTriggerSwitchEvent(newValue) {
            this.conditionTriggerEnabled = newValue;
        },
        timeTriggerSwitchEvent(newValue) {
            this.timeTriggerEnabled = newValue;
        },
    },
    computed: {
        activeIconColor() {
            if (this.timeTriggerEnabled || this.conditionTriggerEnabled) {
                return "#5cad8a";
            } else {
                return "gray";
            }
        }
    }
}
</script>
