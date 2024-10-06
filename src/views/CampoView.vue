<script setup lang="ts">
import { useRoute } from 'vue-router';
import useAPIStore from '@/stores/api';
import useCampiStore from '@/stores/campi';
import type { Campo } from '@/types';
import { onMounted, ref, watch, watchEffect } from "vue";
import leaflet from "leaflet";
import * as ai from '@/stores/ai'

const route = useRoute();
const guid = ref(route.params.guid as string)
const campiStore = useCampiStore()
const campo = ref<Campo | null>(campiStore.campi.find(c => c.guid === guid.value) ?? null)

const coloratoSRC = ref<string | null>(null)
const moistSRC = ref<string | null>(null)
const vegetationSRC = ref<string | null>(null)
const reflectanceSRC = ref<string | null>(null)

const suggestions = ref<{ name: string, description: string }[]>([])
const weatherData = ref<string[]>([])



const api = useAPIStore()

async function load() {
  if (!campo.value) return
  const lat = campo.value.coordinates.latitude
  const lng = campo.value.coordinates.longitude

  const weather = await ai.fetchWeatherData(lat, lng);
  suggestions.value = await ai.generateText(weather)
  weatherData.value = ai.generateWeatherTexts(weather)

  const imgs = (await Promise.all([
    api.getCampoColorato(lat, lng),
    api.getCampoMoisture(lat, lng),
    api.getVegetation(lat, lng),
    api.getReflectance(lat, lng)
  ])).map(img => URL.createObjectURL(img))
  coloratoSRC.value = imgs[0];
  moistSRC.value = imgs[1];
  vegetationSRC.value = imgs[2];
  reflectanceSRC.value = imgs[3];



}
load()

let map: leaflet.Map;
onMounted(() => {
  if (!campo.value) return

  console.log([campo.value.coordinates.longitude, campo.value.coordinates.latitude])
  map = leaflet
    .map("campo")
    map.setView([campo.value.coordinates.latitude, campo.value.coordinates.longitude], 13);

  leaflet
    .tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    })
    .addTo(map);
  leaflet
    .marker([campo.value.coordinates.latitude, campo.value.coordinates.longitude])
    .addTo(map);
});

</script>

<template>
  <v-card v-if="campo" >
    <div id="campo"></div>
    <v-card-title class="title" v-text="campo.name"></v-card-title>

    <v-card-title>Suggestions:</v-card-title>
    <div class="suggestions pa-5">
      <v-card class="suggestions-card" v-for="s of suggestions" :title="s.name" :text="s.description" color="surface-variant">
      </v-card>
    </div>

    <v-card-title>Satellite View</v-card-title>
    <div class="img-grid ma-5">
      <v-card>
        <v-img :src="coloratoSRC" class="align-end" cover v-if="coloratoSRC" />
        <v-card-text>Satellite Image</v-card-text>
      </v-card>
      <v-card>
        <v-img :src="reflectanceSRC" class="align-end" cover v-if="reflectanceSRC" />
        <v-card-text>Nature false color</v-card-text>
      </v-card>
      <v-card>
        <v-img :src="moistSRC" class="align-end" cover v-if="moistSRC" />
        <v-card-text>Moisture Level</v-card-text>
      </v-card>
      <v-card>
        <v-img :src="vegetationSRC" class="align-end" cover v-if="vegetationSRC" />
        <v-card-text>Vegetation Level</v-card-text>
      </v-card>
    </div>

    
    <v-card-title>Historical Data:</v-card-title>
    <v-card-text>
      <p v-for="d of weatherData">{{ d }}</p>
    </v-card-text>

  </v-card>
</template>

<style>
#campo {
  width: 100%;
  height: 400px;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
}

.img-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media screen and (max-width: 700px) {
  .img-grid {
    grid-template-columns: 1fr;
  }
  
}
.columns-2 {
  grid-column: span 2;
}
.suggestions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}
</style>
