<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import leaflet from "leaflet";
import { onMounted, ref, watch, watchEffect } from "vue";

let map: leaflet.Map;
const model = defineModel<{ latitude: number; longitude: number }>();

// on change props change marker
watch(() => model.value, (newCoords) => {
  // console.log('newCoords', newCoords)
  if (map && newCoords) {
    map.setView([newCoords.latitude, newCoords.longitude], 50);
    leaflet
      .marker([newCoords.latitude, newCoords.longitude])
      .addTo(map);
  }
});

onMounted(() => {
  map = leaflet
    .map("map")
  if (model)
    map.setView([model.value?.latitude ?? 0, model.value?.latitude ?? 0], 13);

  leaflet
    .tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    })
    .addTo(map);

  map.addEventListener("click", (e) => {
    const { lat: latitude, lng: longitude } = e.latlng;
    model.value = { latitude, longitude };
  });
});

</script>

<style scoped>
#map {
  width: 100%;
  height: 400px;
}
</style>