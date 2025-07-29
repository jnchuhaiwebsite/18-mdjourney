<template>
  <div class="parameter-settings">
    <!-- Mode Switcher -->
    <div class="mode-switcher">
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
    <div class="input-panels">
      <div 
        v-if="selectedMode === 'text-to-image'"
        class="input-group"
      >
        <TextToImageInput />
      </div>
      <div 
        v-if="selectedMode === 'image-to-image'"
        class="input-group"
      >
        <ImageToImageInput />
      </div>
      <div 
        v-if="selectedMode === 'ai-video'"
        class="input-group"
      >
        <AiVideoInput />
      </div>
    </div>

    <!-- Advanced Parameters Toggle Button -->
    <button 
      class="parameters-toggle-btn"
      :class="{ 'is-open': showAdvancedParams }"
      @click="showAdvancedParams = !showAdvancedParams"
    >
      Advanced Parameters
      <span class="icon">
        <i class="fa-solid fa-chevron-down"></i>
      </span>
    </button>

    <!-- Advanced Parameters Panel -->
    <div 
      class="parameters-panel"
      :class="{ hidden: !showAdvancedParams }"
    >
      <!-- Aspect Ratio Selector -->
      <div class="param-group text-blue-parameters">
        <label>Aspect Ratio</label>
        <div class="aspect-ratio-selector">
          <button 
            v-for="ratio in aspectRatios" 
            :key="ratio.value"
            :class="['ar-btn', { active: selectedAspectRatio === ratio.value }]"
            @click="selectedAspectRatio = ratio.value"
          >
            <div 
              class="ar-shape" 
              :style="{ 
                width: ratio.width + 'px', 
                height: ratio.height + 'px' 
              }"
            ></div>
            <span class="ar-label">{{ ratio.value }}</span>
          </button>
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
      <div class="param-group text-blue-parameters">
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
      <div class="param-group text-blue-parameters">
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
    <button 
      class="generate-btn "
      @click="handleGenerate"
      :disabled="isGenerating"
    >
      <i class="fa-solid fa-wand-magic-sparkles"></i> 
      {{ isGenerating ? 'Generating...' : 'Generate' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineAsyncComponent } from 'vue'

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

// Props
interface Props {
  modelValue?: any
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: any]
  'generate': [params: any]
}>()

// Reactive data
const selectedMode = ref('text-to-image')
const showAdvancedParams = ref(true)
const selectedAspectRatio = ref('16:9')
const selectedSpeed = ref('fast')
const stylizationValue = ref(250)
const weirdnessValue = ref(0)
const isGenerating = ref(false)

// Mode configuration
const modes: Mode[] = [
  { value: 'text-to-image', label: 'Text to Image', component: 'TextToImageInput' },
  { value: 'image-to-image', label: 'Image to Image', component: 'ImageToImageInput' },
  { value: 'ai-video', label: 'AI Video Generation', component: 'AiVideoInput' }
]

// Dynamically import input components
const TextToImageInput = defineAsyncComponent(() => import('./inputs/TextToImageInput.vue'))
const ImageToImageInput = defineAsyncComponent(() => import('./inputs/ImageToImageInput.vue'))
const AiVideoInput = defineAsyncComponent(() => import('./inputs/AiVideoInput.vue'))

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
  { value: 'fast', label: 'Fast', icon: 'fa-solid fa-bolt' },
  { value: 'relax', label: 'Standard', icon: 'fa-solid fa-mug-hot' },
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
  isGenerating.value = true
  try {
    emit('generate', currentParams.value)
  } catch (error) {
    console.error('Generation failed:', error)
  } finally {
    isGenerating.value = false
  }
}

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
  @apply w-full max-w-4xl mx-auto;
}

.mode-switcher {
  @apply flex justify-center gap-2 bg-gray-100 rounded-xl p-2 mb-6;
}

.mode-btn {
  @apply flex-1 py-3 px-4 rounded-lg bg-transparent border-none font-semibold text-gray-600 cursor-pointer transition-all duration-300;
}

.mode-btn.active {
  @apply bg-white text-blue-600 shadow-md;
}

.input-panels {
  @apply mb-6;
}

.input-group {
  @apply flex flex-col gap-4;
}

.input-group.hidden {
  display: none;
}

.parameters-toggle-btn {
  @apply font-semibold text-blue-600 cursor-pointer my-6 bg-none border-none p-0 flex items-center gap-2;
}

.parameters-toggle-btn .icon {
  @apply transition-transform duration-300;
}

.parameters-toggle-btn.is-open .icon {
  @apply rotate-180;
}

.parameters-panel {
  @apply grid grid-cols-1 gap-8;
}

.parameters-panel.hidden {
  display: none;
}

.param-group {
  @apply text-left;
}

.param-group label {
  @apply block font-semibold mb-3;
}

.aspect-ratio-selector {
  @apply grid grid-cols-5 gap-2;
}

.ar-btn {
  @apply bg-gray-100 border-2 border-transparent rounded-lg p-2 cursor-pointer transition-all duration-200 text-center flex flex-col items-center justify-center h-16;
}

.ar-btn:hover {
  @apply border-gray-300;
}

.ar-btn.active {
  @apply border-blue-600 bg-blue-50;
}

.ar-shape {
  @apply bg-gray-400 rounded-sm mb-1;
}

.ar-label {
  @apply text-xs font-medium text-gray-600;
}

.speed-selector {
  @apply grid grid-cols-3 gap-3;
}

.speed-btn {
  @apply bg-gray-100 border-2 border-transparent rounded-lg py-3 px-4 cursor-pointer transition-all duration-200 text-center font-semibold text-gray-600 flex items-center justify-center gap-2;
}

.speed-btn:hover {
  @apply border-gray-300;
}

.speed-btn.active {
  @apply bg-blue-600 text-white border-blue-600;
}

.slider-group {
  @apply flex items-center gap-4;
}

.slider-group input[type="range"] {
  @apply flex-grow;
}

.slider-group input[type="number"] {
  @apply w-20 p-2 border border-gray-300 rounded-lg text-center;
}

.generate-btn {
  @apply w-full py-4 px-6 bg-blue-600 text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-blue-700 hover:transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed;
}

.generate-btn:disabled {
  @apply transform-none shadow-none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .aspect-ratio-selector {
    @apply grid-cols-3;
  }
  
  .speed-selector {
    @apply grid-cols-1;
  }
  
  .slider-group {
    @apply flex-col gap-2;
  }
  
  .slider-group input[type="number"] {
    @apply w-full;
  }
}
</style> 