<template>
    <v-container class="fill-height">
        <v-row align="center" justify="center" dense>
            <v-col cols="12" sm="12" md="3" align="center">
                <v-img max-width="300" contain src="img/logo_shadow.png"/>
            </v-col>
            <v-col cols="12" sm="12" md="9" style="text-align: center; text-shadow: 4px 0px 7px black; color: #5cad8a; font-weight: bold; font-size:8vw; font-family: 'Orbitron'">
                Greenhouse
            </v-col>
           
            <v-col cols="12" sm="12" class="text-center">
                <h2>Jetzt anmelden:</h2>
                <v-btn @click="login" size="x-large" variant="outlined" elevation="16" color="#5cad8a" class="mt-3" to="/">Login mit Auth0</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const ses = useSession({ required: false })
if(ses.status.value === 'authenticated') {
    await navigateTo({ path: '/dashboard' });
}

const login = () => ses.signIn('auth0');

definePageMeta({
  layout: "fullscreen",
  auth: false 
});
</script>