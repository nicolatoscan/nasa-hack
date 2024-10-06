<script setup lang="ts">
import useCampiStore from '@/stores/campi'
import { ref } from 'vue';
import AddCampoForm from '@/components/forms/AddCampoForm.vue';
const campiStore = useCampiStore()

const addingCampo = ref(false)

</script>

<template>
  <div class="flex flex-col pa-5">

    <v-card color="surface" v-for="campo in campiStore.campi" :key="campo.guid" class="ma-5" :to="`campo/${campo.guid}`">
      <v-card-title>{{ campo.name }}</v-card-title>
      <v-card-text>
        <p>[{{ campo.coordinates.latitude }}, {{ campo.coordinates.longitude }}]</p>
      </v-card-text>
    </v-card>
    
    <v-btn color="primary" @click="addingCampo = true">Aggiungi campo</v-btn>
  </div>

  <AddCampoForm v-model="addingCampo" />
</template>
