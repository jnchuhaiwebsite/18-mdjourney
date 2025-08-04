<template>
  <Transition
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="uiStore.isLoginPromptVisible" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm m-4 p-8 text-center transform transition-all border border-blue-pale"
           @click.stop
      >
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-blue-h1 mb-2">Log In to Continue</h2>
          <p class="text-blue-h1p">
            Please log in or create an account to generate video & images and access all features.
          </p>
        </div>
        <div class="flex flex-col gap-4 mt-8">
          <button
            @click="handleLogin"
            class="w-full py-3 px-4 bg-blue-button hover:bg-blue-buttonhover text-blue-buttontext font-bold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-medium focus:ring-offset-2"
          >
            Log In / Sign Up
          </button>
          <button
            @click="uiStore.hideLoginPrompt()"
            class="w-full py-3 px-4 bg-blue-pale hover:bg-blue-light text-blue-h1p font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-medium focus:ring-offset-2 border border-blue-pale"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { useUiStore } from '~/stores/ui'

const uiStore = useUiStore()

const handleLogin = () => {
  uiStore.hideLoginPrompt()
  // Use nextTick to ensure the modal is hidden before triggering the click
  nextTick(() => {
    const loginButton = document.getElementById('bindLogin')
    if (loginButton) {
      loginButton.click()
    } else {
      console.error('Login button with id "bindLogin" not found.')
      // Optionally, show a toast notification about the error
    }
  })
}
</script> 