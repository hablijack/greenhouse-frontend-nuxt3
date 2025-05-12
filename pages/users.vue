<template>
  <v-container fluid>
    <v-col cols="10" sm="10" md="10" lg="6">
      <v-card class="elevation-2">
        <v-data-table :headers="headers" :hide-default-footer="users.length < 11" :items="users">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon color="medium-emphasis" icon="mdi-account" start></v-icon>
                Benutzerverwaltung
              </v-toolbar-title>

              <v-btn prepend-icon="mdi-plus" variant="elevated" color="primary" text="Neuen Benutzer anlegen" border
                @click="add"></v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.title="{ value }">
            <v-chip :text="value" border="thin opacity-25" prepend-icon="mdi-book" label>
              <template v-slot:prepend>
                <v-icon color="medium-emphasis"></v-icon>
              </template>
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
              <v-icon color="medium-emphasis" icon="mdi-pencil" size="small"
                @click="edit(item.username)">mdi-pencil</v-icon>
            </div>
          </template>

          <template v-slot:no-data>
            <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" border
              @click="reset"></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-container>

  <v-dialog v-model="dialog" max-width="500">
    <v-card :subtitle="`${isEditing ? 'Ändere' : 'Erstelle'} einen Benutzer`">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="user.username" label="Username"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="user.name" label="Name"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="user.role" label="Rolle"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field type="password" v-model="user.password" label="Passwort"></v-text-field>
          </v-col>
        </v-row>
      </template>

      <v-divider></v-divider>

      <v-card-actions class="bg-surface-light">
        <v-btn text="Abbrechen" variant="plain" @click="dialog = false"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Speichern" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
tbody tr:nth-of-type(odd) {
  /* 'teal lighten-5' basides on material design color */
  background-color: rgb(238, 238, 238)
}
</style>

<script setup>
import { onMounted, ref, shallowRef } from 'vue'

definePageMeta({
  layout: "default",
  middleware: ['authenticated']
});

const DEFAULT_USER = { username: '', name: '', role: '', password: '' }
const loaded_users = await $fetch('/api/rest/users')

const users = ref([])
const user = ref(DEFAULT_USER)
const dialog = shallowRef(false)
const isEditing = shallowRef(false)

const headers = [
  { title: 'Username', key: 'username', align: 'start' },
  { title: 'Name', key: 'name' },
  { title: 'Rechte', key: 'role' },
  { title: 'Actions', key: 'actions', align: 'end', sortable: false },
]

onMounted(() => {
  dialog.value = false
  user.value = DEFAULT_USER
  users.value = loaded_users.value
})

function add() {
  isEditing.value = false
  user.value = DEFAULT_USER
  dialog.value = true
}

function edit(username) {
  isEditing.value = true

  const found = users.value.find(user => user.username === username)

  user.value = {
    username: found.username,
    name: found.name,
    role: found.role,
    password: 'XXXXXXXXXXX',
  }

  dialog.value = true
}

async function save() {
  if (isEditing.value) {
    // PUT REQUEST
    await $fetch(`/api/rest/users/${user.value.username}`, {
      method: 'PUT',
      body: user.value
    }).then(() => {
      dialog.value = false
    })
  } else {
    // POST REQUEST
    user.value
  }
}
</script>
