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
        @focus="handleFocus"
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
import { useUserStore } from '~/stores/user'
import { useNuxtApp } from 'nuxt/app'
import { useUiStore } from '~/stores/ui';
const uiStore = useUiStore();
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
  'input-change': [value: { prompt: string }]
}>()

// Reactive data
const prompt = ref(props.modelValue)
const promptError = ref(false)
const userStore = useUserStore()
const { $toast } = useNuxtApp() as any

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

// Handle input changes
const handleInput = async () => {
  // 先更新输入内容
  promptError.value = false
  emit('update:modelValue', prompt.value)
  // 发出对象格式，保持与其他组件一致
  emit('input-change', { prompt: prompt.value })
}

// Handle focus - check login status
const handleFocus = async () => {
  // 验证登录状态，如果未登录则不继续执行
  const isLoggedIn = await checkLoginStatus()
  if (!isLoggedIn) return
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
    const errors: string[] = []
    
    if (!prompt.value.trim()) {
      promptError.value = true
      errors.push('Please enter a prompt to continue.')
    } else {
      promptError.value = false
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    }
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
  @apply block text-sm font-semibold text-blue-navtext;
}

.prompt-textarea {
  @apply w-full p-3 border border-blue-pricingborder rounded-lg resize-none focus:ring-2 focus:ring-blue-medium focus:border-transparent transition-colors text-blue-inputtext;
}

.input-hint {
  @apply flex flex-col gap-1;
}
</style> 