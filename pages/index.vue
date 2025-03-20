<template>
    <v-container fill-height fluid>
        <v-row align="center" justify="center" dense>
            <v-col cols="2">
                <v-img max-width="300" contain src="img/logo.png" />
            </v-col>
            <v-col cols="7"
                style="text-align: left; color: #5cad8a; font-weight: bold; font-size:8vw; font-family: 'Orbitron'"
                justify="center">
                Greenhouse
            </v-col>
        </v-row>

        <v-row align="center" justify="center" dense>
            <v-col cols="4">
                <form @submit.prevent="login">
                    <v-card class="elevation-12">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>Login form</v-toolbar-title>
                        </v-toolbar>
                        <v-card-text>
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
console.log(user)
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
        .catch(() => alert('Bad credentials'))
}
definePageMeta({
    layout: "fullscreen"
});
</script>
