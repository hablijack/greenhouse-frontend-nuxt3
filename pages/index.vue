<template>
    <v-container fluid>
        <v-row no-gutters align="center" justify="center" class="d-none d-lg-flex">
            <v-col cols="12" lg="2">
                <v-img max-width="300" contain src="img/logo.png" />
            </v-col>
            <v-col justify="center" cols="12" lg="7" class="pl-1"
                style="color: #5cad8a; font-weight: bold; font-size:8vw; font-family: 'Orbitron'">
                Greenhouse
            </v-col>
        </v-row>

        <v-row align="center" justify="center" dense>
            <v-col cols="12" sm="12" md="6" lg="4">
                <form @submit.prevent="login">
                    <v-card>
                        <v-card-title style="background-color: #2b2d30; color: white">
                            <v-row align="center" justify="center" dense class="d-lg-none pb-7 pt-5">
                                <v-col
                                    style="text-align: center; color: #5cad8a; font-weight: bold; font-size:10vw; font-family: 'Orbitron'"
                                    justify="center">
                                    Greenhouse
                                </v-col>
                            </v-row>
                           
                            <h4>Anmeldung:</h4>
                               
                        </v-card-title>
                        <v-card-text class="pt-9">
                            <v-text-field v-model="credentials.email" prepend-icon="mdi-account" type="email"
                                label="Email" />
                            <v-text-field v-model="credentials.password" prepend-icon="mdi-lock" type="password"
                                label="Passwort" />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn type="submit" variant="elevated" color="primary" size="x-large">Login</v-btn>
                        </v-card-actions>
                    </v-card>
                </form>
            </v-col>
        </v-row>
    </v-container>
</template>


<script setup lang="ts">
const { loggedIn, user, fetch: refreshSession } = useUserSession()
if(loggedIn) {
    // Refresh the session on client-side and redirect to the home page
    await refreshSession()
    await navigateTo({ path: '/dashboard' });
}
const credentials = reactive({
    email: '',
    password: '',
})
async function login() {
    $fetch('/api/login', {
        method: 'POST',
        body: credentials
    })
        .then(async () => {
            // Refresh the session on client-side and redirect to the home page
            await refreshSession()
            await navigateTo({ path: '/dashboard' });
        })
        .catch((error) => {
            alert('Bad credentials');
            console.log(error)
        })
}
definePageMeta({
    layout: "fullscreen"
});
</script>
