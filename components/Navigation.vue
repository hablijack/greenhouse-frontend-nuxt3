<template>
    <v-navigation-drawer v-model="showNavigationModel" theme="dark" :location="$vuetify.display.mobile ? 'bottom' : 'left'" location="left" color="#343a40" style="border: none;">
        <v-list>
            <v-list-item class="hidden-md-and-down">
                <img width="220" src="/img/green_sphere.gif" />
            </v-list-item>
            <v-list-item class="logo">
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
            <v-list-item to="/satellites">
                <template v-slot:prepend>
                    <v-icon>mdi-home-automation</v-icon>
                </template>
                <v-list-item-title style="line-height: 2rem;" class="text-h6">Satelliten</v-list-item-title>
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
                <v-list-item-title class="text-h6 mt-2">
                    {{ username }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-3">{{ email }}</v-list-item-subtitle>
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

<style scoped>
.logo {
    text-shadow: 2px 0px 2px black;
    color: #5cad8a;
    font-weight: bold;
    font-size: 26px;
    font-family: 'Orbitron'
}
</style>

<script setup>
    const ses = useAuth()

    const props = defineProps({
        showNavigation: Boolean
    })

    const showNavigationModel = ref(props.showNavigation)

    const splitted = ses.data.value?.user?.name.split('.')
    const username = splitted[0].charAt(0).toUpperCase() + splitted[0].slice(1) + ' ' + splitted[1].charAt(0).toUpperCase() + splitted[1].slice(1)
    const email = ses.data.value?.user?.email
    const logout = () => {ses.signOut('auth0')};

    watch(() => props.showNavigation, (oldValue, newValue) => {
        showNavigationModel.value = newValue;
    });
</script>
