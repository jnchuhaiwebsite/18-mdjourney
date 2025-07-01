<template>
  <div class="relative w-full flex flex-col items-center justify-start overflow-x-hidden">
    <!-- 标题区 -->
    <div class="mt-[64px] mb-10 flex flex-col items-center relative z-10">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-[#ec2657] via-[#990066] to-[#333333] bg-clip-text text-transparent drop-shadow-2xl tracking-tight animate-gradient-x">
        AI Image Generation
      </h2>
      <p class="mt-4 text-base text-gray-200 text-center max-w-4xl font-medium">
        Create stunning images with our advanced AI image generation technology
      </p>
    </div>

    <!-- 主体区 -->
    <div class="w-full max-w-[1360px] flex flex-col lg:flex-row gap-3 lg:gap-4 justify-center items-stretch px-2 sm:px-3 lg:px-4 pb-12 lg:pb-20">
      <!-- 左侧表单 -->
      <div class="w-full mx-auto lg:mx-0 lg:w-[50%] max-w-[576px] lg:max-w-none bg-[#1a1a1a] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-[#8a8c90]/30 p-6 xl:p-8 flex flex-col gap-2 sm:gap-3 lg:gap-4 relative">
        <!-- 提示词输入 -->
        <div>
          <div class="flex items-center justify-between">
            <label class="block text-sm lg:text-base font-semibold text-gray-300 mb-1">
              Prompt
            </label>
          </div>
          <textarea
            v-model="prompt"
            :maxlength="480"
            rows="6"
            :class="{'border-red-500 focus:ring-red-500': promptError}"
            class="w-full rounded-lg bg-[#111111] border border-gray-700 text-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#ec2657] focus:border-transparent transition placeholder-gray-500 text-sm lg:text-base resize-none"
            placeholder="Describe the image you want to generate..."
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <div>
              <p class="text-xs text-gray-400">
                Enter a detailed description (Please enter English description)
              </p>
              <p v-if="promptError" class="text-xs text-red-500 mt-1">
                Please enter a prompt to generate an image
              </p>
            </div>
            <span class="text-xs text-gray-400">{{ prompt.length }}/480</span>
          </div>
        </div>

        <!-- 高宽比例选择 -->
        <div>
          <label class="block text-sm lg:text-base font-semibold text-gray-300 mb-2">Aspect Ratio</label>
          <div class="flex flex-nowrap overflow-x-auto gap-3 pb-2">
            <div v-for="(size, ratio) in aspectRatios" :key="ratio" class="relative flex-shrink-0" style="width: calc(20% - 10px);">
              <button
                type="button"
                @click="selectedRatio = ratio"
                class="w-full h-24 flex flex-col items-center justify-center rounded-xl transition-colors"
                :class="selectedRatio === ratio ? 'bg-[#ec2657]/20 border-2 border-[#ec2657]' : 'bg-[#2a2a2a] border border-[#3a3a3a] hover:border-gray-600'"
              >
                <div class="relative mb-2">
                  <svg
                    class="w-8 h-8 md:w-10 md:h-10"
                    viewBox="0 0 40 40"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    :class="selectedRatio === ratio ? 'text-[#ec2657]' : 'text-gray-400'"
                  >
                    <rect
                      v-if="ratio === '1:1'"
                      x="10" y="10" width="20" height="20"
                    />
                    <rect
                      v-if="ratio === '3:4'"
                      x="13" y="8" width="14" height="24"
                    />
                    <rect
                      v-if="ratio === '4:3'"
                      x="8" y="13" width="24" height="14"
                    />
                    <rect
                      v-if="ratio === '9:16'"
                      x="15" y="5" width="10" height="30"
                    />
                    <rect
                      v-if="ratio === '16:9'"
                      x="5" y="15" width="30" height="10"
                    />
                  </svg>
                  <div v-if="selectedRatio === ratio" class="absolute -top-1 -left-1 w-4 h-4 bg-[#ec2657] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="white">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <span class="text-sm text-center" :class="selectedRatio === ratio ? 'text-[#ec2657]' : 'text-gray-300'">
                  {{ getRatioLabel(ratio) }}
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- 模型选择 -->
        <div>
          <label class="block text-sm lg:text-base font-semibold text-gray-300 mb-2">Model</label>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              @click="selectedModel = 'ultra'"
              class="h-8 px-3 text-sm border rounded-md transition-colors flex items-center gap-1"
              :class="selectedModel === 'ultra' ? 'border-[#ec2657] bg-[#ec2657]/10 text-[#ec2657]' : 'border-gray-700 text-gray-300 hover:border-gray-600'"
            >
              Ultra
            </button>
            <button
              type="button"
              @click="selectedModel = 'normal'"
              class="h-8 px-3 text-sm border rounded-md transition-colors flex items-center gap-1"
              :class="selectedModel === 'normal' ? 'border-[#ec2657] bg-[#ec2657]/10 text-[#ec2657]' : 'border-gray-700 text-gray-300 hover:border-gray-600'"
            >
              Normal
            </button>
          </div>
        </div>

        <!-- 生成按钮 -->
        <button
          type="submit"
          @click="generateImage"
          class="w-full flex items-center justify-center gap-1.5 px-3 mt-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#ec2657] to-[#333333] hover:from-[#ec2657]/90 hover:to-[#333333]/80 text-white rounded-lg font-extrabold text-base sm:text-lg lg:text-xl shadow-xl transition"
          :disabled="isGenerating"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
          </svg>
          <span>{{ isGenerating ? 'Generating...' : 'Generate Image' }}</span>
        </button>
      </div>

      <!-- 右侧预览区域 -->
      <div class="w-full mx-auto lg:mx-0 lg:w-[50%] max-w-[576px] lg:max-w-none flex flex-col items-center p-2 sm:p-3 lg:p-4 xl:p-6 bg-[#1a1a1a] backdrop-blur-sm rounded-2xl shadow-2xl border border-[#8a8c90]/30">
        <div class="flex flex-col justify-center items-center w-full h-full bg-gradient-to-br from-[#1a1a1a]/10 via-[#990066]/8 to-[#333333]/10 rounded-[16px]">
          <div class="relative w-full h-[480px] flex items-center justify-center">
            <div v-if="generatedImage" class="w-full h-full">
              <img :src="generatedImage" alt="Generated Image" class="w-full h-full object-contain rounded-lg">
              <div class="absolute bottom-2 left-2 right-2 bg-black/60 p-2 rounded-lg text-xs text-gray-300">
                <p class="mb-1"><span class="font-semibold text-[#ec2657]">Prompt:</span> {{ displayedPrompt }}</p>
                <p class="mb-1"><span class="font-semibold text-[#ec2657]">Model:</span> {{ selectedModel }}</p>
                <p><span class="font-semibold text-[#ec2657]">Aspect Ratio:</span> {{ selectedRatio }}</p>
              </div>
            </div>
            <div v-else-if="isGenerating" class="text-center">
              <div class="w-16 h-16 border-4 border-[#ec2657] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p class="text-[#ec2657] font-medium">Generating your image...</p>
              <p class="text-gray-400 text-sm mt-2">This may take a few moments</p>
            </div>
            <div v-else class="text-[#ec2657] text-center">
              <svg class="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p class="text-gray-400">Preview Area</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const prompt = ref('')
const selectedRatio = ref('1:1')
const selectedModel = ref('ultra')
const isGenerating = ref(false)
const generatedImage = ref('')
const displayedPrompt = ref('')
const promptError = ref(false)

interface AspectRatios {
  [key: string]: string;
}

const aspectRatios: AspectRatios = {
  '1:1': '1024 x 1024',
  '3:4': '896 x 1280',
  '4:3': '1280 x 896',
  '9:16': '768 x 1408',
  '16:9': '1408 x 768'
}

// 模拟图片生成过程
const generateImage = async () => {
  // 验证提示词是否填写
  if (!prompt.value.trim()) {
    promptError.value = true
    return
  }
  
  // 清除错误状态
  promptError.value = false
  
  // 重置图片和设置生成状态
  isGenerating.value = true
  generatedImage.value = ''
  displayedPrompt.value = prompt.value
  
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 根据选择的比例和模型获取示例图片
    const demoImages = [
      '/img/demo/Imagen-4-Ultra-image1.webp',
      '/img/demo/Imagen-4-Ultra-image2.webp',
      '/img/demo/Imagen-4-Ultra-image3.webp',
      '/img/demo/Imagen-4-Ultra-image4.webp',
      '/img/demo/Imagen-4-Ultra-image5.webp'
    ]
    
    // 随机选择一张示例图片
    const randomIndex = Math.floor(Math.random() * demoImages.length)
    generatedImage.value = demoImages[randomIndex]
    
    // 记录生成的参数
    console.log('Image generated with:', {
      prompt: prompt.value,
      aspectRatio: selectedRatio.value,
      model: selectedModel.value,
      size: aspectRatios[selectedRatio.value as keyof typeof aspectRatios]
    })
  } catch (error) {
    console.error('图片生成失败:', error)
  } finally {
    isGenerating.value = false
  }
}

// 获取比例标签名称
const getRatioLabel = (ratio: string): string => {
  switch(ratio) {
    case '1:1': return 'Square (1:1)';
    case '3:4': return 'Portrait (3:4)';
    case '4:3': return 'Standard (4:3)';
    case '9:16': return 'Mobile (9:16)';
    case '16:9': return 'Landscape (16:9)';
    default: return ratio;
  }
}
</script>

<style scoped>
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 15s ease infinite;
}

@keyframes gradient-x {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style> 