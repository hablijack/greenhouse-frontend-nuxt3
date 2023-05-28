<template>
    <v-card :color="cardColor" theme="dark">
        <v-list-item three-line>
            <template v-slot:append>
                <v-icon size="120">{{ icon }}</v-icon>
            </template>

            <div class="text-overline">
                {{ headline }}
            </div>

            <v-card-text class="pa-0">
                <v-row align="stretch" no-gutters>
                    <v-col class="text-h4">
                        <span v-if="!measurement && measurement != 0">...</span>
                        {{ cardValue }} {{ unit }}
                    </v-col>
                </v-row>
            </v-card-text>

            <v-list-item-subtitle>
                {{ description }}
            </v-list-item-subtitle>
        </v-list-item>
    </v-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
export default defineComponent({
    props: [
        'headline',
        'unit',
        'measurement',
        'icon',
        'description',
        'decimals',
        'color',
        'minAlarmValue',
        'maxAlarmValue'
    ],
    computed: {
        cardValue() {
            if (this.measurement !== undefined) {
                return parseFloat(this.measurement).toFixed(this.decimals)
            } else {
                return null;
            }
        },
        cardColor() {
            if (this.measurement <= this.minAlarmValue) {
                return "#EA8162";
            } else if (this.measurement >= this.maxAlarmValue) {
                return "#EA8162";
            } else {
                return "#5cad8a";
            }
        }
    }
})
</script>
