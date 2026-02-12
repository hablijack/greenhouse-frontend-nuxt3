<template>
    <v-container fluid class="main-content">
<!-- Hero section with logo and title for large screens -->
<div class="hero-section">
    <v-row no-gutters justify="center" class="d-none d-lg-flex">
        <v-col cols="12" class="text-center">
            <v-img max-width="300" max-height="300" src="/img/logo.png" class="mx-auto mb-4" />
            <div class="hero-title">Greenhouse</div>
        </v-col>
    </v-row>
</div>

<v-row justify="center" dense>
    <v-col cols="12" sm="10" md="6" lg="4" class="login-col">
                <form @submit.prevent="login">
                    <v-card>
                        <v-card-title style="background-color: #2b2d30; color: white">
                            <!-- Mobile hero title (hidden on large) -->
                            <v-row align="center" justify="center" dense class="d-lg-none pb-7 pt-5">
                                <v-col cols="12" class="text-center mobile-title">
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
            <v-row class="d-lg-none" justify="center" align="center" style="margin-top:1rem;">
                <v-img max-width="150" contain src="/img/logo.png" />
            </v-row>
            </v-col>
        </v-row>
    </v-container>

    <!-- Footer -->
    <v-footer class="footer-section fixed-footer" padless>
        <v-container>
            <v-row justify="center" align="center">
                <v-col cols="12" class="text-center">
                    <p class="footer-text">&copy; {{ new Date().getFullYear() }} Greenhouse. All rights reserved.</p>
                </v-col>
            </v-row>
        </v-container>
    </v-footer>
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
<style scoped>
/* Hero section styles */
.hero-section {
    padding: 2rem 0;
    color: #5cad8a;
    font-family: 'Orbitron', sans-serif;
}
.hero-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.text-center {
    text-align: center;
}
.hero-title {
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 700;
    color: #5cad8a;
}
.mobile-title {
    font-size: clamp(2rem, 12vw, 4rem);
    font-weight: 700;
    color: #5cad8a;
}
/* Login card styling */
v-card {
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.v-card-title {
    background: black !important;
    color: white !important;
    border-radius: 0rem 0rem 0 0 !important;
}
/* Adjust form fields spacing */
v-text-field {
    margin-bottom: 1rem;
}
/* Button style tweak */
v-btn[type="submit"] {
    margin-top: 1rem;
}

/* Main content layout */
.main-content {
    min-height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.hero-section {
    margin-bottom: 0;
}

/* Footer styles */
.footer-section {
    background-color: black !important;
    color: white !important;
    min-height: 60px;
}

.fixed-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
}

.footer-text {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.8;
}
</style>
