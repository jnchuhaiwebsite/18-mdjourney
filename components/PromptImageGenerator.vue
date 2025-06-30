<template>
  <div class="relative w-full flex flex-col items-center justify-start overflow-x-hidden">
    <!-- 标题区 -->
    <div class="mt-[64px] mb-10 flex flex-col items-center relative z-10">
      <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-[#f49d25] via-[#ffb347] to-[#ff8c42] bg-clip-text text-transparent drop-shadow-2xl tracking-tight animate-gradient-x">
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
            class="w-full rounded-lg bg-[#111111] border border-gray-700 text-gray-200 px-3 py-2 focus:ring-2 focus:ring-[#f49d25] focus:border-transparent transition placeholder-gray-500 text-sm lg:text-base resize-none"
            placeholder="Describe the image you want to generate..."
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <p class="text-xs text-gray-400">Please provide a detailed description of what you want to see in the image.</p>
            <span class="text-xs text-gray-400">{{ prompt.length }}/480</span>
          </div>
        </div>

        <!-- 高宽比例选择 -->
        <div>
          <label class="block text-sm lg:text-base font-semibold text-gray-300 mb-2">Image Size</label>
          <div class="flex flex-wrap gap-2">
            <div v-for="(size, ratio) in aspectRatios" :key="ratio" class="relative">
              <button
                type="button"
                @click="selectedRatio = ratio"
                class="h-8 px-3 text-sm border rounded-md transition-colors flex items-center gap-1"
                :class="selectedRatio === ratio ? 'border-[#f49d25] bg-[#f49d25]/10 text-[#f49d25]' : 'border-gray-700 text-gray-300 hover:border-gray-600'"
              >
                <span class="text-center">{{ ratio }}</span>
                <span class="text-xs text-gray-500">({{ size }})</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 生成按钮 -->
        <button
          type="submit"
          @click="generateImage"
          class="w-full flex items-center justify-center gap-1.5 px-3 mt-3 lg:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-[#f49d25] to-[#ff8c42] hover:from-[#f49d25]/90 hover:to-[#ff8c42]/80 text-black rounded-lg font-extrabold text-base sm:text-lg lg:text-xl shadow-xl transition"
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
        <div class="flex flex-col justify-center items-center w-full h-full bg-gradient-to-br from-[#1a1a1a]/10 via-[#ffb347]/8 to-[#ff8c42]/10 rounded-[16px]">
          <div class="relative w-full h-[480px] flex items-center justify-center">
            <div v-if="generatedImage" class="w-full h-full">
              <img :src="generatedImage" alt="Generated Image" class="w-full h-full object-contain rounded-lg">
            </div>
            <div v-else class="text-[#f49d25] text-center">
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
const isGenerating = ref(false)
const generatedImage = ref('')

const aspectRatios = {
  '1:1': '1024 x 1024',
  '3:4': '896 x 1280',
  '4:3': '1280 x 896',
  '9:16': '768 x 1408',
  '16:9': '1408 x 768'
}

const generateImage = async () => {
  if (!prompt.value.trim()) return
  
  isGenerating.value = true
  try {
    // 这里添加实际的图片生成逻辑
    // 示例：
    await new Promise(resolve => setTimeout(resolve, 2000))
    // generatedImage.value = '生成的图片URL'
  } catch (error) {
    console.error('图片生成失败:', error)
  } finally {
    isGenerating.value = false
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