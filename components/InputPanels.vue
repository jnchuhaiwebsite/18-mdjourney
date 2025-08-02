<template>
  <div class="input-panels">
    <div 
      v-if="selectedMode === 'text-to-image'"
      class="input-group"
    >
      <TextToImageInput 
        ref="textToImageInputRef"
        @input-change="emit('input-change', $event)" 
      />
    </div>
    <div 
      v-if="selectedMode === 'image-to-image'"
      class="input-group"
    >
      <ImageToImageInput 
        ref="imageToImageInputRef"
        @input-change="emit('input-change', $event)" 
      />
    </div>
    <div 
      v-if="selectedMode === 'ai-video'"
      class="input-group"
    >
      <AiVideoInput 
        ref="aiVideoInputRef"
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
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits(['input-change'])

// Dynamically import input components
const TextToImageInput = defineAsyncComponent(() => import('./inputs/TextToImageInput.vue'))
const ImageToImageInput = defineAsyncComponent(() => import('./inputs/ImageToImageInput.vue'))
const AiVideoInput = defineAsyncComponent(() => import('./inputs/AiVideoInput.vue'))

// Refs for input components
const textToImageInputRef = ref<any>(null)
const imageToImageInputRef = ref<any>(null)
const aiVideoInputRef = ref<any>(null)

// Get current input component based on selected mode
const getCurrentInputComponent = () => {
  switch (props.selectedMode) {
    case 'text-to-image':
      return textToImageInputRef.value
    case 'image-to-image':
      return imageToImageInputRef.value
    case 'ai-video':
      return aiVideoInputRef.value
    default:
      return null
  }
}

// Expose methods
defineExpose({
  getCurrentInputComponent
})
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
