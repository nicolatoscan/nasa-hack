<script setup lang="ts">
import { useDisplay } from 'vuetify'
import useCampiStore from '@/stores/campi'
import type { Campo } from '@/types';
import { ref, watch } from 'vue';
import leaflet from "leaflet";
import { onMounted, watchEffect } from "vue";
import { useGeolocation } from "@vueuse/core";
import Map from '@/components/Map.vue'

const { coords } = useGeolocation();

const { xs } = useDisplay()
const campiStore = useCampiStore()

const model = defineModel<boolean>()
const campo = ref<Campo>({ name: '', coordinates: { latitude: 0, longitude: 0 } })


watch(model, (value) => {
  if (value) {
    campo.value = { name: 'New Campo', coordinates: { latitude: coords.value.latitude, longitude: coords.value.longitude } }
  }
})

async function addCampoLocation() {
  try {
    campo.value.coordinates = { latitude: coords.value.latitude, longitude: coords.value.longitude }
  } catch (error) {
    campo.value.coordinates = { latitude: 0, longitude: 0 }
  }
}

function save() {
  campiStore.addCampo(campo.value)
  model.value = false
}

</script>

<template>
  <v-dialog :fullscreen="xs" :width="xs ? undefined : 550" v-model="model">
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title>Add your campo</v-toolbar-title>
      </v-toolbar>

      <v-container>
        <v-text-field label="Name" required v-model="campo.name"></v-text-field>

        <div class="flex">
          <v-btn icon="mdi-map-marker" class="ma-2" @click="addCampoLocation()" />
          <v-text-field class="ma-2" label="Latitude"  v-model="campo.coordinates.latitude" hide-details required></v-text-field>
          <v-text-field class="ma-2" label="Longitude" v-model="campo.coordinates.longitude" hide-details required></v-text-field>
        </div>

        <Map v-model="campo.coordinates" />

      </v-container>

      <v-card-actions >
        <v-spacer />
        <v-btn variant="outlined" color="primary" @click="save()">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>