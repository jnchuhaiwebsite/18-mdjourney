<template>
  <div class="ai-video-input">
    <!-- Image Upload Area -->
    <div class="input-group">
      <label class="input-label">Upload Static Image</label>
      <div 
        class="upload-area"
        :class="{ 'has-image': selectedImage }"
        @click="triggerFileInput"
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <div v-if="!selectedImage" class="upload-placeholder">
          <i class="fa-solid fa-film text-2xl text-purple-500 mb-2"></i>
          <p class="text-sm font-medium text-gray-600">Upload a static image to generate animation</p>
          <p class="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP formats</p>
        </div>
        <div v-else class="image-preview">
          <img :src="imagePreview" alt="Preview Image" class="preview-image" />
          <button 
            @click.stop="removeImage"
            class="remove-btn"
            title="Remove Image"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
      </div>
      <input 
        ref="fileInput"
        type="file" 
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
    </div>

    <!-- Motion Description Input -->
    <div class="input-group">
      <label class="input-label">Motion Description (Optional)</label>
      <textarea
        v-model="prompt"
        class="prompt-textarea"
        placeholder="Describe the motion effect you want, e.g., gentle breeze, flowing water, slow camera movement..."
        rows="3"
        @input="handleInput"
      ></textarea>
      <div class="input-hint">
        <p class="text-sm text-gray-500">
          Optional: Describe your desired motion effect. AI will automatically generate appropriate animation based on the image content
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// Props
interface Props {
  modelValue?: {
    image?: File
    prompt?: string
    duration?: number
    fps?: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'input-change': [value: any]
}>()

// Reactive data
const fileInput = ref<HTMLInputElement | null>(null)
const selectedImage = ref<File | null>(null)
const imagePreview = ref<string>('')
const prompt = ref(props.modelValue?.prompt || '')
const duration = ref(props.modelValue?.duration || 6)
const fps = ref(props.modelValue?.fps || 30)

// Trigger file selection
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    setImage(file)
  }
}

// Handle drag and drop
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      setImage(file)
    }
  }
}

// Set image
const setImage = (file: File) => {
  selectedImage.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  emitChange()
}

// Remove image
const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emitChange()
}

// Handle input changes
const handleInput = () => {
  emitChange()
}

// Emit change events
const emitChange = () => {
  const value = {
    image: selectedImage.value,
    prompt: prompt.value,
    duration: duration.value,
    fps: fps.value
  }
  emit('update:modelValue', value)
  emit('input-change', value)
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue?.prompt !== undefined) {
    prompt.value = newValue.prompt
  }
  if (newValue?.duration !== undefined) {
    duration.value = newValue.duration
  }
  if (newValue?.fps !== undefined) {
    fps.value = newValue.fps
  }
}, { deep: true })

// Expose methods
defineExpose({
  getValue: () => ({
    image: selectedImage.value,
    prompt: prompt.value,
    duration: duration.value,
    fps: fps.value
  }),
  setValue: (value: any) => {
    if (value.image) {
      setImage(value.image)
    }
    if (value.prompt !== undefined) {
      prompt.value = value.prompt
    }
    if (value.duration !== undefined) {
      duration.value = value.duration
    }
    if (value.fps !== undefined) {
      fps.value = value.fps
    }
  },
  validate: () => {
    return !!selectedImage.value
  }
})
</script>

<style scoped>
.ai-video-input {
  @apply w-full;
}

.input-group {
  @apply flex flex-col gap-2 mb-4;
}

.input-label {
  @apply block text-sm font-semibold text-gray-700;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer transition-colors hover:border-purple-500;
}

.upload-area.has-image {
  @apply border-solid border-gray-400;
}

.upload-placeholder {
  @apply flex flex-col items-center justify-center text-center;
}

.image-preview {
  @apply relative;
}

.preview-image {
  @apply w-full h-32 object-cover rounded-lg;
}

.remove-btn {
  @apply absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors;
}

.prompt-textarea {
  @apply w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors;
}

.input-hint {
  @apply flex flex-col gap-1;
}

.video-params {
  @apply mt-4;
}

.param-row {
  @apply grid grid-cols-2 gap-4;
}

.param-group {
  @apply flex flex-col gap-2;
}

.param-label {
  @apply text-sm font-medium text-gray-700;
}

.param-select {
  @apply p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors;
}

.hidden {
  display: none;
}
</style> 