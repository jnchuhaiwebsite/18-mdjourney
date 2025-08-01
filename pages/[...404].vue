<template>
  <div class="min-h-screen bg-blue-pale flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-blue-h1 mb-4">404</h1>
      <p class="text-xl text-blue-navtext mb-8">Page not found</p>
      <NuxtLink to="/" class="inline-block px-6 py-3 bg-blue-button text-blue-buttontext rounded-lg font-medium hover:bg-blue-buttonhover transition-colors duration-200">Return to Homepage</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from '~/composables/useSeo';
useSeo({
  title: 'Page Not Found - 404 Error',
  description: 'The requested page could not be found. Please return to homepage or use navigation menu.'
})
</script>

<style scoped>

</style> 