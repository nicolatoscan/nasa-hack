<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <!-- <div class="min-h-screen flex flex-col items-center justify-between">
    <nav class="w-full bg-gray-800 p-4 shadow-md">
      <div class="flex justify-center space-x-8 text-white">
        <RouterLink 
          class="hover:text-gray-300 transition ease-in-out duration-200" 
          to="/">Home
        </RouterLink>
        <RouterLink 
          class="hover:text-gray-300 transition ease-in-out duration-200" 
          to="/about">About
        </RouterLink>
        <RouterLink 
          class="hover:text-gray-300 transition ease-in-out duration-200" 
          to="/contact">Contact
        </RouterLink>
      </div>
    </nav> -->

    <main class="flex-grow w-full max-w-4xl mx-auto">
      <RouterView />
    </main>
  <!-- </div> -->
</template>

<style scoped lang="scss">
</style>
