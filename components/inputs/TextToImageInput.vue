<template>
  <div class="text-to-image-input">
    <div class="input-group">
      <label class="input-label">Prompt Description</label>
      <textarea
        v-model="prompt"
        class="prompt-textarea"
        placeholder="e.g., A majestic lion running across the savanna at sunset, cinematic photography style..."
        rows="4"
        @input="handleInput"
      ></textarea>
      <div class="input-hint">
        <p v-if="promptError" class="text-sm text-red-500 mt-1">
          Please enter a prompt to generate an image
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props
interface Props {
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input-change': [value: string]
}>()

// Reactive data
const prompt = ref(props.modelValue)
const promptError = ref(false)

// Handle input changes
const handleInput = () => {
  promptError.value = false
  emit('update:modelValue', prompt.value)
  emit('input-change', prompt.value)
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  prompt.value = newValue
})

// Expose methods
defineExpose({
  getValue: () => prompt.value,
  setValue: (value: string) => {
    prompt.value = value
  },
  validate: () => {
    if (!prompt.value.trim()) {
      promptError.value = true
      return false
    }
    promptError.value = false
    return true
  }
})
</script>

<style scoped>
.text-to-image-input {
  @apply w-full;
}

.input-group {
  @apply flex flex-col gap-2;
}

.input-label {
  @apply block text-sm font-semibold text-gray-700;
}

.prompt-textarea {
  @apply w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors;
}

.input-hint {
  @apply flex flex-col gap-1;
}
</style> 