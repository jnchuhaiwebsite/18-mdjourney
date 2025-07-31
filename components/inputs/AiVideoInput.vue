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
        <div v-else class="image-preview relative">
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
        :class="['prompt-textarea', { 'prompt-textarea-active': prompt }]"
        placeholder="Describe the motion effect you want, e.g., gentle breeze, flowing water, slow camera movement..."
        rows="3"
        @input="handleInput"
        @focus="handleFocus"
      ></textarea>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useVideoTaskStore } from '~/stores/videoTask'
import { useUserStore } from '~/stores/user'

const videoTaskStore = useVideoTaskStore()

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
const userStore = useUserStore()

// 防抖标记
let isCheckingLogin = false

// 声明 checkLoginStatus 函数
const checkLoginStatus = async () => {
  // 每次都提示用户需要登录
  console.log('检查登录状态...')
  
  // 防止频繁调用登录弹窗
  if (isCheckingLogin) {
    console.log('请先完成登录再继续操作')
    return false
  }
  
  // 每次都重新获取最新的用户信息
  await userStore.fetchUserInfo()
  
  // 检查用户是否已登录
  if (!userStore.userInfo) {
    console.log('用户未登录，请先登录')
    isCheckingLogin = true
    
    const loginButton = document.getElementById('bindLogin')
    if (loginButton) {
      loginButton.click()
    }
    
    // 3秒后重置防抖标记
    setTimeout(() => {
      isCheckingLogin = false
    }, 3000)
    
    return false
  }
  
  console.log('用户已登录，可以继续操作')
  return true
}

// Trigger file selection
const triggerFileInput = async () => {
  if (videoTaskStore.progress > 0) return; // Prevent changing image during generation
  // 只验证登录状态，不做任何额外操作
  await checkLoginStatus()
  fileInput.value?.click()
}

// Handle file selection
const handleFileSelect = async (event: Event) => {
  // 只验证登录状态，不做任何额外操作
  await checkLoginStatus()
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    setImage(file)
  }
}

// Handle drag and drop
const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (videoTaskStore.progress > 0) return;
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
  if (videoTaskStore.progress > 0) return;
  selectedImage.value = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emitChange()
}

// Handle input changes
const handleInput = async () => {
  // 先更新输入内容
  emitChange()
}

// Handle focus - check login status
const handleFocus = async () => {
  // 只验证登录状态，不做任何额外操作
  await checkLoginStatus()
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
}, { deep: true })

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
  @apply border-solid border-gray-400 p-2; /* Adjusted padding for when image is present */
}

.upload-placeholder {
  @apply flex flex-col items-center justify-center text-center;
}

.image-preview {
  @apply relative;
}

.preview-image {
  @apply w-full h-48 object-cover rounded-lg;
}

.remove-btn {
  @apply absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20;
}

.prompt-textarea {
  @apply w-full p-3 border border-gray-300 rounded-lg resize-none transition-colors text-gray-800 font-medium;
}

.prompt-textarea:focus,
.prompt-textarea-active {
  @apply ring-2 ring-purple-500 border-transparent shadow-lg;
}

.input-hint {
  @apply flex flex-col gap-1;
}

.hidden {
  display: none;
}

.loading-dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%, 20% { content: ''; }
  40% { content: '.'; }
  60% { content: '..'; }
  80%, 100% { content: '...'; }
}
</style>