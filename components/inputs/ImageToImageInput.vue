<template>
  <div class="image-to-image-input">
    <!-- Image upload area -->
    <div class="input-group">
      <label class="input-label">Upload Reference Image</label>
      <div 
        class="upload-area"
        :class="{ 'has-image': selectedImage }"
        @click="triggerFileInput"
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <div v-if="!selectedImage" class="upload-placeholder">
          <i class="fa-solid fa-cloud-arrow-up text-2xl text-blue-500 mb-2"></i>
          <p class="text-sm font-medium text-gray-600">Click to upload or drag image here</p>
          <p class="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP formats</p>
        </div>
        <div v-else class="image-preview">
          <img :src="imagePreview" alt="Preview image" class="preview-image" />
          <button 
            @click.stop="removeImage"
            class="remove-btn"
            title="Remove image"
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

    <!-- Prompt input -->
    <div class="input-group">
      <label class="input-label">Transformation Description</label>
      <textarea
        v-model="prompt"
        class="prompt-textarea"
        placeholder="Describe how you want to transform this image, e.g., change style, add elements, adjust colors, etc..."
        rows="3"
        @input="handleInput"
        @focus="handleFocus"
      ></textarea>
      <div class="input-hint">
        <p class="text-sm text-gray-500">
          Describe how you want to modify or transform this image
        </p>
        <p v-if="promptError" class="text-sm text-red-500 mt-1">
          Please enter a transformation description
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
  }
  checkLoginStatus?: () => Promise<boolean>
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
const promptError = ref(false)

// Trigger file selection
const triggerFileInput = async () => {
  if (props.checkLoginStatus) {
    const isLoggedIn = await props.checkLoginStatus()
    if (!isLoggedIn) {
      return
    }
  }
  fileInput.value?.click()
}

// Handle file selection
const handleFileSelect = async (event: Event) => {
  if (props.checkLoginStatus) {
    const isLoggedIn = await props.checkLoginStatus()
    if (!isLoggedIn) {
      return
    }
  }
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
const handleInput = async () => {
  promptError.value = false
  emitChange()
}

// Handle focus - check login status
const handleFocus = async () => {
  if (props.checkLoginStatus) {
    const isLoggedIn = await props.checkLoginStatus()
    if (!isLoggedIn) {
      return
    }
  }
}

// Emit change event
const emitChange = () => {
  const value = {
    image: selectedImage.value,
    prompt: prompt.value
  }
  emit('update:modelValue', value)
  emit('input-change', value)
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue?.prompt !== undefined) {
    prompt.value = newValue.prompt
  }
}, { deep: true })

// Expose methods
defineExpose({
  getValue: () => ({
    image: selectedImage.value,
    prompt: prompt.value
  }),
  setValue: (value: any) => {
    if (value.image) {
      setImage(value.image)
    }
    if (value.prompt !== undefined) {
      prompt.value = value.prompt
    }
  },
  validate: () => {
    if (!selectedImage.value) {
      return false
    }
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
.image-to-image-input {
  @apply w-full;
}

.input-group {
  @apply flex flex-col gap-2 mb-4;
}

.input-label {
  @apply block text-sm font-semibold text-gray-700;
}

.upload-area {
  @apply border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer transition-colors hover:border-blue-500;
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
  @apply w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors;
}

.input-hint {
  @apply flex flex-col gap-1;
}

.hidden {
  display: none;
}
</style> 