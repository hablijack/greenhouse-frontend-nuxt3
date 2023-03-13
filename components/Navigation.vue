<template>
    <v-navigation-drawer v-model="internalShow" app theme="dark" :location="navbarPosition" :style="navbarStyle" color="#343a40">
        <v-list>
            <v-list-item class="hidden-md-and-down">
                <img width="220" src="/img/green_sphere.gif" />
            </v-list-item>
            <v-list-item
                style="text-shadow: 2px 0px 2px black; color: #5cad8a; font-weight: bold; font-size: 26px; font-family: 'Orbitron'">
                <template v-slot:prepend>
                    <img height="40" class="mr-2" src="/img/logo_shadow.png" />
                </template>
                Greenhouse
            </v-list-item>
        </v-list>

        <v-divider />

        <v-list nav>
            <v-list-item to="/dashboard">
                <template v-slot:prepend>
                    <v-icon>mdi-home</v-icon>
                </template>
                <v-list-item-title style="line-height: 2rem;" class="text-h6">Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item to="/satelites">
                <template v-slot:prepend>
                    <v-icon>mdi-home-automation</v-icon>
                </template>
                <v-list-item-title style="line-height: 2rem;" class="text-h6">Sateliten</v-list-item-title>
            </v-list-item>
            <v-list-item to="/control">
                <template v-slot:prepend>
                    <v-icon>mdi-toggle-switch</v-icon>
                </template>
                <v-list-item-title style="line-height: 2rem;" class="text-h6">Steuerung</v-list-item-title>
            </v-list-item>
            <v-list-item to="/limits">
                <template v-slot:prepend>
                    <v-icon>mdi-plus-minus-box</v-icon>
                </template>
                <v-list-item-title style="line-height: 2rem;" class="text-h6">Grenzwerte</v-list-item-title>
            </v-list-item>
            <v-list-item to="/automation">
                <template v-slot:prepend>
                    <v-icon>mdi-cog-box</v-icon>
                </template>
                <v-list-item-title style="line-height: 2rem;" class="text-h6">Automatik</v-list-item-title>
            </v-list-item>
            <v-list-item to="/history">
                <template v-slot:prepend>
                    <v-icon>mdi-chart-areaspline</v-icon>
                </template>
                <v-list-item-title style="line-height: 2rem;" class="text-h6">Historie</v-list-item-title>
            </v-list-item>
            <v-divider class="mb-4" />
            <v-list-item>
                <v-btn style="width: 100%" variant="elevated" size="x-large" @click="logout" to="/">
                    <v-icon>mdi-logout</v-icon>
                    logout
                </v-btn>
            </v-list-item>
            <v-list-item link>
                <template v-slot:prepend>
                    <v-avatar color="black">
                        <v-icon>mdi-account</v-icon>
                    </v-avatar>
                </template>
                <v-list-item-title class="text-h6">
                    {{ username }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider />
            <v-list-item style="min-height: 20px;">
                <v-list-item-subtitle class="ma-3" style="align-items: center;">
                    <i>© Copyright 2023 Greenhouse</i>
                </v-list-item-subtitle>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const ses = useSession()

const props = defineProps({
    show: Boolean,
})

const internalShow = ref(false);

watch(() => props.show, (oldValue, newValue) => {
    internalShow.value = newValue;
});

watch(() => internalShow, (oldValue, newValue) => {
    if (newValue !== props.show) {
        this.$emit("change-drawer-state");
    }
});

const logout = () => ses.signOut('auth0');

const navbarPosition = computed(() => {
    const display = ref(useDisplay())
    if(display.value.mobile){
        return 'bottom'
    } else {
        return 'left'
    }
})

const navbarStyle = computed(() => {
    const display = ref(useDisplay())
    if(display.value.mobile){
        return 'height: 100vh; padding-left: 60px; padding-top: 60px;'
    }
})

const username = computed(() => {
    return ses.data.value?.user?.name
})
const email = computed(() => {
    return ses.data.value?.user?.email
})
</script>

