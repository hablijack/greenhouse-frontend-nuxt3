<template>
  <v-container fluid>
    <div class="d-flex flex-wrap">
      <div class="flex-card">
        <v-card>
          <v-card-title style="background-color: #343a40; color: white">
            <v-icon color="#5cad8a" class="mr-2">mdi-check-circle</v-icon>
            Satelliten
          </v-card-title>
          <v-card-text class="pa-4">
          <client-only>
            <!-- Remove v-bind to avoid passing unintended props to TreeChart -->
            <TreeChart :json="architecture" />
          </client-only>
          </v-card-text>
        </v-card>
      </div>
      <div v-for="(child, index) in architecture.children" :key="child.name + index" class="flex-card">
        <v-card>
          <v-card-title style="background-color: #343a40; color: white">
            <v-icon :color="child.online ? '#5cad8a' : '#EA8162'" class="mr-2">
              {{ child.online ? 'mdi-check-circle' : 'mdi-close-circle' }}
            </v-icon>
            {{ child.name }}
          </v-card-title>
          <v-card-text class="mt-5">
            <div>{{ child.description }}</div>
            <div><strong>IP: </strong>{{ child.ip }}</div>
            <div v-if="child.identifier === 'greenhouse_cam'" class="mt-3">
              <v-img :src="cameraPictureUrl" contain class="rounded" style="transform: rotate(180deg);" />
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="elevated" @click="openEditDialog(child)">Edit</v-btn>
            <v-btn variant="elevated" color="primary" @click="openHealthcheck(child.ip)">Healthcheck</v-btn>
            <v-btn variant="elevated" color="primary" @click="openInterface(child.ip)">Interface</v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>

    <v-dialog v-model="editDialog" max-width="500">
      <v-card>
        <v-card-title style="background-color: #343a40; color: white">
          <v-icon left>mdi-pencil</v-icon>
          Edit Satellite
        </v-card-title>
        <v-card-text class="pt-4">
          <v-form>
            <v-text-field
              v-model="formData.name"
              label="Name"
              variant="outlined"
              density="compact"
              class="mb-3"
            />
            <v-text-field
              v-model="formData.description"
              label="Description"
              variant="outlined"
              density="compact"
              class="mb-3"
            />
            <v-text-field
              v-model="formData.ip"
              label="IP Address"
              variant="outlined"
              density="compact"
              class="mb-3"
            />
            <v-text-field
              v-model="formData.imageUrl"
              label="Image URL"
              variant="outlined"
              density="compact"
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="editDialog = false">Cancel</v-btn>
          <v-btn color="primary" variant="elevated" :loading="saving" @click="saveSatellite">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

const webcamSatellite = computed(() => {
  return architecture.children.find(s => s.identifier === 'greenhouse_cam');
});

const cameraPictureUrl = '/api/rest/satellites/greenhouse-cam/picture.jpg';

const openHealthcheck = (ip) => {
  window.open(`http://${ip}/health`, '_blank');
}

const openInterface = (ip) => {
  window.open(`http://${ip}`, '_blank');
}

const children = await $fetch('/api/rest/satellites');
architecture.children = children;

const editDialog = ref(false);
const saving = ref(false);
const formData = reactive({
  identifier: '',
  name: '',
  description: '',
  ip: '',
  imageUrl: ''
});

const openEditDialog = (satellite) => {
  formData.identifier = satellite.identifier;
  formData.name = satellite.name;
  formData.description = satellite.description;
  formData.ip = satellite.ip;
  formData.imageUrl = satellite.imageUrl;
  editDialog.value = true;
};

const saveSatellite = async () => {
  saving.value = true;
  try {
    await $fetch(`/api/rest/satellite/${formData.identifier}`, {
      method: 'PUT',
      body: formData
    });
    const index = architecture.children.findIndex(s => s.identifier === formData.identifier);
    if (index !== -1) {
      architecture.children[index] = { ...architecture.children[index], ...formData };
    }
    editDialog.value = false;
  } catch (error) {
    console.error('Error saving satellite:', error);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.d-flex {
  gap: 16px;
  align-items: flex-start;
}

.flex-card {
  flex: 1 1 400px;
  min-width: 350px;
  max-width: 600px;
}
</style>
