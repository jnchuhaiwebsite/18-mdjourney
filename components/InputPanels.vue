<template>
  <div class="input-panels">
    <div 
      v-if="selectedMode === 'text-to-image'"
      class="input-group"
    >
      <TextToImageInput 
        :check-login-status="props.checkLoginStatus"
        @input-change="emit('input-change', $event)" 
      />
    </div>
    <div 
      v-if="selectedMode === 'image-to-image'"
      class="input-group"
    >
      <ImageToImageInput 
        :check-login-status="props.checkLoginStatus"
        @input-change="emit('input-change', $event)" 
      />
    </div>
    <div 
      v-if="selectedMode === 'ai-video'"
      class="input-group"
    >
      <AiVideoInput 
        :check-login-status="props.checkLoginStatus"
        @input-change="emit('input-change', $event)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Props
interface Props {
  selectedMode: string
  checkLoginStatus?: () => Promise<boolean>
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['input-change'])

// Dynamically import input components
const TextToImageInput = defineAsyncComponent(() => import('./inputs/TextToImageInput.vue'))
const ImageToImageInput = defineAsyncComponent(() => import('./inputs/ImageToImageInput.vue'))
const AiVideoInput = defineAsyncComponent(() => import('./inputs/AiVideoInput.vue'))
</script>

<style scoped>
.input-panels {
  @apply mb-6;
}

.input-group {
  @apply flex flex-col gap-4;
}

.input-group.hidden {
  display: none;
}
</style>
