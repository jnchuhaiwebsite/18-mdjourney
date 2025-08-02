import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isLoginPromptVisible = ref(false)

  function showLoginPrompt() {
    isLoginPromptVisible.value = true
  }

  function hideLoginPrompt() {
    isLoginPromptVisible.value = false
  }

  return {
    isLoginPromptVisible,
    showLoginPrompt,
    hideLoginPrompt,
  }
}) 