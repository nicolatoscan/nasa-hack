import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Campo } from '@/types'
import { useStorage } from '@vueuse/core'

const useCampiStore = defineStore('campi', () => {

  const campi = useStorage<Campo[]>('campi', [])

  function addCampo(campo: Campo) {
    campo.guid = Math.random().toString(36).substr(2, 9)
    campi.value.push(campo)
  }

  function getCampo(guid: string) {
    return campi.value.find(c => c.guid === guid)
  }



  return { campi, addCampo, getCampo }
})

export default useCampiStore;