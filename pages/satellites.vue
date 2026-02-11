<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="12" sm="12" md="12" lg="4">
        <v-card>
          <v-card-title>Satelliten:</v-card-title>
          <v-card-text>
          <client-only>
            <!-- Remove v-bind to avoid passing unintended props to TreeChart -->
            <TreeChart :json="architecture" />
          </client-only>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-for="(child, index) in architecture.children" :key="child.name + index" cols="12" sm="12" md="12" lg="4">
        <v-card>
          <v-card-title :style="satelliteStyle(child.online)">{{ child.name }}:</v-card-title>
          <v-card-text class="mt-5">
            <div>{{ child.description }}</div>
            <div><strong>IP: </strong>{{ child.ip }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="elevated">Edit</v-btn>
            <v-btn variant="elevated" color="primary">Healthcheck</v-btn>
            <v-btn variant="elevated" color="primary">Interface</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const architecture = {
  name: "Server",
  imageUrl: "server.png",
  class: ["rootNode"],
  ip: "192.168.178.165:5550",
  online: true,
  children: [],
}

const satelliteStyle = (online) => {
  return "color: white; background-color: ".concat(
    online ? "#5cad8a" : "#EA8162"
  );
}

const children = await $fetch('/api/rest/satellites');
architecture.children = children;
</script>
