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
            ×
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
import { useNuxtApp } from 'nuxt/app'
import { useUiStore } from '~/stores/ui';
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
const { $toast } = useNuxtApp() as any
const uiStore = useUiStore();
// 防抖标记
let isCheckingLogin = false

// 声明 checkLoginStatus 函数
const checkLoginStatus = async () => {
  // 防止频繁调用登录弹窗
  if (isCheckingLogin) {
    $toast.warning('Please complete the login process first')
    return false
  }
  
  // 每次都重新获取最新的用户信息
  await userStore.fetchUserInfo()
  
  // 检查用户是否已登录
  if (!userStore.userInfo) {
    uiStore.showLoginPrompt();
    return false;
  }
  
  return true
}

// Trigger file selection
const triggerFileInput = async () => {
  if (videoTaskStore.progress > 0) return; // Prevent changing image during generation
  // 验证登录状态，如果未登录则不继续执行
  const isLoggedIn = await checkLoginStatus()
  if (!isLoggedIn) return
  fileInput.value?.click()
}

// Handle file selection
const handleFileSelect = async (event: Event) => {
  // 检查登录状态，如果未登录则不处理文件
  const isLoggedIn = await checkLoginStatus()
  if (!isLoggedIn) {
    // 清空文件输入，防止文件被选择
    const target = event.target as HTMLInputElement
    target.value = ''
    return
  }
  
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.type.startsWith('image/')) {
    setImage(file)
  }
}

// Handle drag and drop
const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  if (videoTaskStore.progress > 0) return;
  
  // 验证登录状态，如果未登录则不继续执行
  const isLoggedIn = await checkLoginStatus()
  if (!isLoggedIn) return
  
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
  // 验证登录状态，如果未登录则不继续执行
  const isLoggedIn = await checkLoginStatus()
  if (!isLoggedIn) return
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
    const errors: string[] = []
    
    if (!selectedImage.value) {
      errors.push('Please upload an image to continue.')
    }
    
    // 对于AI视频，提示词是可选的，所以不需要验证
    
    return {
      isValid: errors.length === 0,
      errors: errors
    }
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
  @apply block text-sm font-semibold text-blue-navtext;
}

.upload-area {
  @apply border-2 border-dashed border-blue-pricingborder rounded-lg p-6 cursor-pointer transition-colors hover:border-blue-medium h-48;
}

.upload-area.has-image {
  @apply border-solid border-blue-pricingborder p-2 h-48; /* Fixed height to prevent size change */
}

.upload-placeholder {
  @apply flex flex-col items-center justify-center text-center;
}

.image-preview {
  @apply relative w-full h-full flex items-center justify-center;
}

.preview-image {
  @apply max-w-full max-h-full object-contain rounded-lg bg-blue-pale;
}

.remove-btn {
  @apply absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-20 text-sm font-bold leading-none;
}

.prompt-textarea {
  @apply w-full p-3 border border-blue-pricingborder rounded-lg resize-none transition-colors text-blue-inputtext font-medium;
}

.prompt-textarea:focus,
.prompt-textarea-active {
  @apply ring-2 ring-blue-medium border-transparent shadow-lg;
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