<template>
  <div class="parameter-settings">
    <!-- Mode Switcher -->
    <div v-if="!hideModeSwitcher" class="mode-switcher">
      <button 
        v-for="mode in modes" 
        :key="mode.value"
        :class="['mode-btn', { active: selectedMode === mode.value }]"
        @click="selectedMode = mode.value"
      >
        {{ mode.label }}
      </button>
    </div>

    <!-- Input Panels -->
    <InputPanels 
      ref="inputPanelsRef"
      :selected-mode="selectedMode" 
      @input-change="handleInputChange" 
    />

    <!-- Parameters Panel -->
    <div class="parameters-panel">
      <!-- Aspect Ratio Selector -->
      <div class="param-group text-blue-parameters">
        <label>Aspect Ratio</label>
        <div class="aspect-ratio-dropdown">
          <button 
            class="aspect-ratio-trigger"
            @click="showAspectRatioDropdown = !showAspectRatioDropdown"
          >
            <div class="selected-ratio-display">
              <div 
                class="ar-shape" 
                :style="{ 
                  width: selectedAspectRatioData.width + 'px', 
                  height: selectedAspectRatioData.height + 'px' 
                }"
              ></div>
              <span class="ar-label">{{ selectedAspectRatio }}</span>
            </div>
            <i class="fa-solid fa-chevron-down dropdown-icon" :class="{ 'rotate-180': showAspectRatioDropdown }"></i>
          </button>
          
          <div 
            class="aspect-ratio-dropdown-menu"
            :class="{ 'show': showAspectRatioDropdown }"
          >
            <div class="aspect-ratio-grid">
              <button 
                v-for="ratio in aspectRatios" 
                :key="ratio.value"
                :class="['ar-grid-item', { active: selectedAspectRatio === ratio.value }]"
                @click="selectAspectRatio(ratio.value)"
              >
                <span class="ar-label">{{ ratio.value }}</span>
                <div 
                  class="ar-shape" 
                  :style="{ 
                    width: ratio.width + 'px', 
                    height: ratio.height + 'px' 
                  }"
                ></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Speed Selector -->
      <div class="param-group text-blue-parameters">
        <label>Generation Speed</label>
        <div class="speed-selector">
          <button 
            v-for="speed in speeds" 
            :key="speed.value"
            :class="['speed-btn', { active: selectedSpeed === speed.value }]"
            @click="selectedSpeed = speed.value"
          >
            <i :class="speed.icon"></i> {{ speed.label }}
          </button>
        </div>
      </div>

      <!-- Stylization Slider -->
      <div v-if="selectedMode !== 'ai-video'" class="param-group text-blue-parameters">
        <label for="stylization">Stylization</label>
        <div class="slider-group">
          <input 
            type="range" 
            id="stylization" 
            v-model="stylizationValue"
            min="0" 
            max="1000" 
            step="1"
            @input="updateStylization"
          >
          <input 
            type="number" 
            id="stylization-value" 
            v-model="stylizationValue"
            min="0" 
            max="1000"
            @input="updateStylization"
          >
        </div>
      </div>

      <!-- Weirdness Slider -->
      <div v-if="selectedMode !== 'ai-video'" class="param-group text-blue-parameters">
        <label for="weirdness">Weirdness</label>
        <div class="slider-group">
          <input 
            type="range" 
            id="weirdness" 
            v-model="weirdnessValue"
            min="0" 
            max="3000" 
            step="10"
            @input="updateWeirdness"
          >
          <input 
            type="number" 
            id="weirdness-value" 
            v-model="weirdnessValue"
            min="0" 
            max="3000"
            @input="updateWeirdness"
          >
        </div>
      </div>
    </div>

    <!-- Generate Button -->
    <div class="generate-button-container">
      <div class="credit-info">
        <span class="credit-label">Credit Cost:</span>
        <span class="credit-amount">
          {{ currentCreditCost }} credits
        </span>
      </div>
      <button 
        class="generate-btn"
        @click="handleGenerate"
        :disabled="isGenerating"
      >
        <i class="fa-solid fa-wand-magic-sparkles"></i> 
        {{ isGenerating ? 'Generating...' : 'Generate' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '~/stores/user'
import { useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'
import { upload } from '~/api/index'
import { createTasks } from '~/api/index'
import { useClerkAuth } from '~/utils/authHelper';
import { useVideoTaskStore } from '~/stores/videoTask';
import { storeToRefs } from 'pinia';
// 定义接口
interface Mode {
  value: string
  label: string
  component: string
}

interface AspectRatio {
  value: string
  width: number
  height: number
}

interface Speed {
  value: string
  label: string
  icon: string
}

interface CreditConfig {
  [key: string]: {
    [key: string]: number
  }
}

// Props
interface Props {
  modelValue?: any
  hideModeSwitcher?: boolean
  defaultMode?: string
  availableModes?: string[]
}


// // 使用用户信息 store
// const userStore = useUserStore()
// const userInfo = computed(() => userStore.userInfo)
// const remainingTimes = ref(userStore.userInfo?.free_limit+userStore.userInfo?.remaining_limit|| 0)

// // 修改 checkLoginStatus 函数
// const checkLoginStatus = async () => {
//   if (!userInfo.value) {
//     // 先尝试获取用户信息
//     await userStore.fetchUserInfo()
    
//     if (!userStore.userInfo) {
//       // 缓存当前表单数据（用于请求时）
//       cacheFormData()
//       const loginButton = document.getElementById('bindLogin')
//       if (loginButton) {
//         loginButton.click()
//       }
//       return false
//     }
//   }
//   return true
// }


const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  hideModeSwitcher: false,
  defaultMode: 'text-to-image',
  availableModes: () => ['text-to-image', 'image-to-image', 'ai-video']
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'generate': [params: any]
}>()

const videoTaskStore = useVideoTaskStore();
const { progress, currentTask } = storeToRefs(videoTaskStore);

const isGenerating = computed(() => !!videoTaskStore.currentTask?.isGenerating);

// Input panels ref
const inputPanelsRef = ref<any>(null);

const durationConfig = {
  'text-to-image': {
    relaxed: 10,
    fast: 5,
    turbo: 2,
  },
  'image-to-image': {
    relaxed: 15,
    fast: 8,
    turbo: 4,
  },
  'ai-video': {
    relaxed: 120,
    fast: 60,
    turbo: 30,
  }
};

const estimatedTime = computed(() => {
  if (!currentTask.value) return 'N/A';
  
  const mode = currentTask.value.type;
  const speed = currentTask.value.speed;
  
  const totalDuration = durationConfig[mode]?.[speed] || 60;
  const remainingSeconds = Math.round(totalDuration * (1 - progress.value / 100));
  
  if (remainingSeconds > 60) {
    return `About ${Math.round(remainingSeconds / 60)} min left`;
  }
  return `About ${remainingSeconds} sec left`;
});

// Reactive data
const selectedMode = ref<string>(props.availableModes.includes(props.defaultMode) ? props.defaultMode : (props.availableModes[0] || 'text-to-image'))
const selectedAspectRatio = ref('16:9')
const selectedSpeed = ref('fast')
const stylizationValue = ref(250)
const weirdnessValue = ref(0)
const showAspectRatioDropdown = ref(false)
const prompt = ref('')
const imageFile = ref<File | null>(null)
const { isSignedIn } = useClerkAuth();
import { useUiStore } from '~/stores/ui';
const uiStore = useUiStore();
const userStore = useUserStore()
const router = useRouter()
const { $toast } = useNuxtApp() as any

const userCredits = computed(() => {
  const userInfo = userStore.userInfo
  if (!userInfo) return 0
  return (userInfo.free_limit || 0) + (userInfo.remaining_limit || 0)
})

// 使用用户信息 store
const userInfo = computed(() => userStore.userInfo)

// 修改 checkLoginStatus 函数
const checkLoginStatus = async () => {
  // 每次都重新获取最新的用户信息
  await userStore.fetchUserInfo()
  
  // 检查用户是否已登录
  if (!userStore.userInfo) {
    const loginButton = document.getElementById('bindLogin')
    if (loginButton) {
      loginButton.click()
    }
    return false
  }
  return true
}




onMounted(() => {
  userStore.fetchUserInfo()
})

// Credit consumption configuration
const creditConfig: CreditConfig = {
  'ai-video': {
    'relaxed': 20,
    'fast': 40,
    'turbo': 70
  },
  'image-to-image': {
    'relaxed': 4,
    'fast': 8,
    'turbo': 12
  },
  'text-to-image': {
    'relaxed': 4,
    'fast': 8,
    'turbo': 12
  }
}

// Mode configuration
const allModes: Mode[] = [
  { value: 'text-to-image', label: 'Text to Image', component: 'TextToImageInput' },
  { value: 'image-to-image', label: 'Image to Image', component: 'ImageToImageInput' },
  { value: 'ai-video', label: 'AI Video', component: 'AiVideoInput' }
]

// Filter modes based on availableModes prop
const modes = computed(() => {
  return allModes.filter(mode => props.availableModes.includes(mode.value))
})

// Import InputPanels component
const InputPanels = defineAsyncComponent(() => import('./InputPanels.vue'))

// Aspect ratio configuration
const aspectRatios: AspectRatio[] = [
  { value: '2:1', width: 36, height: 18 },
  { value: '16:9', width: 32, height: 18 },
  { value: '4:3', width: 28, height: 21 },
  { value: '3:2', width: 30, height: 20 },
  { value: '6:5', width: 24, height: 20 },
  { value: '1:1', width: 24, height: 24 },
  { value: '5:6', width: 20, height: 24 },
  { value: '3:4', width: 21, height: 28 },
  { value: '2:3', width: 20, height: 30 },
  { value: '9:16', width: 18, height: 32 }
]

// Speed configuration
const speeds: Speed[] = [
  { value: 'relaxed', label: 'relaxed', icon: 'fa-solid fa-mug-hot' },
  { value: 'fast', label: 'Fast', icon: 'fa-solid fa-bolt' },
  { value: 'turbo', label: 'Turbo', icon: 'fa-solid fa-rocket' }
]

// Computed properties
const currentParams = computed(() => ({
  mode: selectedMode.value,
  aspectRatio: selectedAspectRatio.value,
  speed: selectedSpeed.value,
  stylization: stylizationValue.value,
  weirdness: weirdnessValue.value
}))

// Get current credit cost
const currentCreditCost = computed(() => {
  const mode = selectedMode.value as keyof CreditConfig
  const speed = selectedSpeed.value as keyof CreditConfig[keyof CreditConfig]
  return creditConfig[mode]?.[speed] || 0
})

// Get selected aspect ratio data
const selectedAspectRatioData = computed(() => {
  return aspectRatios.find(ratio => ratio.value === selectedAspectRatio.value) || aspectRatios[1] // Default to 16:9
})

const handleInputChange = (value: any) => {
  if (value.prompt !== undefined) {
    prompt.value = value.prompt;
  }
  if (value.image !== undefined) {
    imageFile.value = value.image;
  }
}

// Watch parameter changes
watch(currentParams, (newParams) => {
  emit('update:modelValue', newParams)
}, { deep: true })

// Methods
const updateStylization = () => {
  // Ensure value is within valid range
  if (stylizationValue.value < 0) stylizationValue.value = 0
  if (stylizationValue.value > 1000) stylizationValue.value = 1000
}

const updateWeirdness = () => {
  // Ensure value is within valid range
  if (weirdnessValue.value < 0) weirdnessValue.value = 0
  if (weirdnessValue.value > 3000) weirdnessValue.value = 3000
}

const handleGenerate = async () => {
  if (!isSignedIn.value) {
    uiStore.showLoginPrompt();
    return false;
  }

  if (userCredits.value < currentCreditCost.value) {
    $toast.error('Insufficient credits. Please top up to continue.');
    router.push('/pricing');
    return;
  }

  // 验证输入组件
  if (inputPanelsRef.value) {
    const currentInputComponent = inputPanelsRef.value.getCurrentInputComponent();
    console.log('Current input component:', currentInputComponent);
    console.log('Selected mode:', selectedMode.value);
    
    if (currentInputComponent && typeof currentInputComponent.validate === 'function') {
      const validationResult = currentInputComponent.validate();
      console.log('Validation result:', validationResult);
      
      if (!validationResult.isValid) {
        // 根据验证结果显示具体的错误信息
        if (validationResult.errors && Array.isArray(validationResult.errors)) {
          validationResult.errors.forEach((error: string) => {
            $toast.error(error);
          });
        }
        return;
      }
    } else {
      console.log('No current input component or validate function not found');
    }
  }

  // 验证通过，继续生成流程

  emit('generate', {
    ...currentParams.value,
    prompt: prompt.value,
    imageFile: imageFile.value,
  });
}

const selectAspectRatio = (value: string) => {
  selectedAspectRatio.value = value
  showAspectRatioDropdown.value = false
}

// Click outside to close dropdown
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.aspect-ratio-dropdown')) {
    showAspectRatioDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Expose methods to parent component
defineExpose({
  getParams: () => currentParams.value,
  setParams: (params: any) => {
    if (params.mode) selectedMode.value = params.mode
    if (params.aspectRatio) selectedAspectRatio.value = params.aspectRatio
    if (params.speed) selectedSpeed.value = params.speed
    if (params.stylization !== undefined) stylizationValue.value = params.stylization
    if (params.weirdness !== undefined) weirdnessValue.value = params.weirdness
  }
})
</script>

<style scoped>
.parameter-settings {
  @apply w-full max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-6;
}

.mode-switcher {
  @apply flex justify-center gap-3 bg-gray-50 rounded-2xl p-2 mb-6 shadow-sm border border-gray-100;
}

.mode-btn {
  @apply flex-1 py-1.5 px-3 rounded-xl bg-transparent border-none font-semibold text-gray-600 cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-sm;
}

.mode-btn.active {
  @apply bg-white text-blue-600 shadow-md transform scale-105;
}

.parameters-panel {
  @apply grid grid-cols-1 gap-6 pb-4 mt-6;
}

.param-group {
  @apply text-left;
}

.param-group label {
  @apply block font-semibold mb-3 text-gray-700 text-base;
}

.aspect-ratio-dropdown {
  @apply relative;
}

.aspect-ratio-trigger {
  @apply w-full bg-white border-2 border-gray-200 rounded-xl p-3 cursor-pointer transition-all duration-300 flex items-center justify-between hover:border-gray-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm;
}

.selected-ratio-display {
  @apply flex items-center gap-4;
}

.dropdown-icon {
  @apply text-gray-400 transition-transform duration-300 text-base;
}

.dropdown-icon.rotate-180 {
  transform: rotate(180deg);
}

.aspect-ratio-dropdown-menu {
  @apply absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-xl mt-2 shadow-2xl z-10 max-h-60 overflow-y-auto opacity-0 pointer-events-none transition-all duration-300 transform translate-y-3 origin-top backdrop-blur-sm;
}

.aspect-ratio-dropdown-menu.show {
  @apply opacity-100 pointer-events-auto transform translate-y-0;
}

.aspect-ratio-grid {
  @apply grid grid-cols-1 gap-1 p-4;
}

.ar-grid-item {
  @apply flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-gray-50 border-2 border-transparent gap-3 hover:shadow-sm;
}

.ar-grid-item.active {
  @apply bg-blue-50 text-blue-600 border-blue-600 shadow-md;
}

.ar-grid-item.active .ar-label {
  @apply text-blue-600 font-semibold;
}

.ar-grid-item:hover {
  @apply bg-gray-50 border-gray-300;
}

.ar-shape {
  @apply bg-gray-400 rounded-md flex-shrink-0 shadow-sm;
}

.ar-label {
  @apply text-sm font-medium text-gray-600 flex-shrink-0;
}

.speed-selector {
  @apply grid grid-cols-3 gap-3;
}

.speed-btn {
  @apply bg-gray-100 border-2 border-transparent rounded-xl py-1.5 px-2 cursor-pointer transition-all duration-300 text-center font-semibold text-gray-600 flex items-center justify-center gap-1 hover:shadow-md hover:border-gray-300;
}

.speed-btn:hover {
  @apply border-gray-300 transform scale-105;
}

.speed-btn.active {
  @apply bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105;
}

.slider-group {
  @apply flex items-center gap-4 bg-gray-50 rounded-xl p-2;
}

.slider-group input[type="range"] {
  @apply flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
}

.slider-group input[type="range"]::-webkit-slider-thumb {
  @apply appearance-none w-5 h-5 bg-blue-600 rounded-full cursor-pointer shadow-lg;
}

.slider-group input[type="range"]::-moz-range-thumb {
  @apply w-5 h-5 bg-blue-600 rounded-full cursor-pointer border-0 shadow-lg;
}

.slider-group input[type="number"] {
  @apply w-20 p-2 border-2 border-gray-200 rounded-lg text-center font-semibold text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.generate-button-container {
  @apply mt-8;
}

.generate-btn {
  @apply w-full py-4 px-6 bg-blue-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-blue-buttonhover hover:transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg;
}

.generate-btn:disabled {
  @apply transform-none shadow-lg;
}

.credit-info {
  @apply flex justify-between items-center mb-4 text-gray-600 text-sm;
}

.credit-label {
  @apply font-semibold;
}

.credit-amount {
  @apply font-bold text-blue-600;
}

.credit-icon {
  @apply w-4 h-4 mr-1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mode-switcher {
    @apply gap-2 p-2 mb-5;
  }
  
  .mode-btn {
    @apply py-1 px-3 text-sm;
  }
  
  .parameters-panel {
    @apply gap-5 pb-3;
  }
  
  .param-group label {
    @apply mb-2 text-sm;
  }
  
  .aspect-ratio-dropdown-menu {
    @apply max-h-48;
  }
  
  .aspect-ratio-trigger {
    @apply p-3;
  }
  
  .aspect-ratio-grid {
    @apply gap-1 p-3;
  }
  
  .ar-grid-item {
    @apply p-2 gap-2;
  }
  
  .ar-label {
    @apply text-xs;
  }
  
  .speed-selector {
    @apply grid-cols-3 gap-2;
  }
  
  .speed-btn {
    @apply py-1 px-2;
  }
  
  .slider-group {
    @apply flex-col gap-2 p-2;
  }
  
  .slider-group input[type="number"] {
    @apply w-full;
  }
  
  .generate-button-container {
    @apply mt-6;
  }
  
  .generate-btn {
    @apply py-3 px-5 text-base;
  }
}

@media (max-width: 480px) {
  .mode-switcher {
    @apply flex-col;
  }
  
  .mode-btn {
    @apply w-full;
  }
  
  .speed-selector {
    @apply grid-cols-3;
  }
  
  .slider-group {
    @apply p-1;
  }
}


</style> 