<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import useAPIStore from '@/stores/api';
import useCampiStore from '@/stores/campi';
import type { Campo } from '@/types';

const route = useRoute();
const guid = ref(route.params.guid as string)
const campiStore = useCampiStore()
const campo = ref<Campo | null>(campiStore.campi.find(c => c.guid === guid.value) ?? null)

const coloratoSRC = ref<string | null>(null)
const moistSRC = ref<string | null>(null)
const vegetationSRC = ref<string | null>(null)

const api = useAPIStore()

async function load() {
  if (!campo.value) return
  const lat = campo.value.coordinates.latitude
  const lng = campo.value.coordinates.longitude


  const colorato = await api.getCampoColorato(lat, lng)
  coloratoSRC.value = URL.createObjectURL(colorato);


  const moist = await api.getCampoMoisture(lat, lng)
  moistSRC.value = URL.createObjectURL(moist);

  const vegetation = await api.getVegetation(lat, lng)
  vegetationSRC.value = URL.createObjectURL(vegetation);
}
load()

// height="200px"

</script>

<template>
  <v-card v-if="campo">
    <v-img :src="coloratoSRC" class="align-end" cover v-if="coloratoSRC" />
    
    <v-card-title v-text="campo.name"></v-card-title>
    <v-card-text>
      <p>Latitude: {{ campo.coordinates.latitude }}</p>
      <p>Longitude: {{ campo.coordinates.longitude }}</p>
    </v-card-text>

    <v-card-title>Moisture Level</v-card-title>
    <v-img :src="moistSRC" class="align-end" cover v-if="moistSRC" />
    <v-card-title>Vegetation Level</v-card-title>
    <v-img :src="vegetationSRC" class="align-end" cover v-if="vegetationSRC" />

  </v-card>
</template>

<style>
</style>
