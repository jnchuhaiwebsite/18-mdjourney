<template>
  <div class="generation-with-params">
    <!-- 页面标题 -->
    <PageHero 
      title="AI图像生成 - 高级参数设置"
      subtitle="使用我们的高级参数设置组件，精确控制您的AI图像生成过程"
    />

    <!-- 主要内容区域 -->
    <div class="w-full max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 左侧：参数设置 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">参数设置</h2>
          <ParameterSettings 
            ref="paramSettings"
            v-model="parameters"
            @generate="handleGenerate"
          />
        </div>

        <!-- 右侧：预览和结果 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6 text-gray-800">生成结果</h2>
          
          <!-- 生成状态 -->
          <div v-if="isGenerating" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-600">正在生成中，请稍候...</p>
          </div>

          <!-- 生成结果 -->
          <div v-else-if="generatedImage" class="space-y-4">
            <div class="relative">
              <img 
                :src="generatedImage" 
                alt="生成的图片" 
                class="w-full rounded-lg shadow-md"
              />
              <button 
                @click="downloadImage"
                class="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                title="下载图片"
              >
                <i class="fa-solid fa-download"></i>
              </button>
            </div>
            <div class="text-sm text-gray-600">
              <p><strong>生成时间:</strong> {{ generationTime }}</p>
              <p><strong>使用参数:</strong></p>
              <pre class="bg-gray-100 p-2 rounded text-xs mt-2 overflow-auto">{{ JSON.stringify(usedParameters, null, 2) }}</pre>
            </div>
          </div>

          <!-- 默认状态 -->
          <div v-else class="text-center py-12 text-gray-500">
            <i class="fa-solid fa-image text-4xl mb-4"></i>
            <p>设置参数后点击生成按钮开始创建</p>
          </div>
        </div>
      </div>

      <!-- 参数历史记录 -->
      <div v-if="generationHistory.length > 0" class="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-xl font-bold mb-4 text-gray-800">生成历史</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="(item, index) in generationHistory" 
            :key="index"
            class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="loadHistoryItem(item)"
          >
            <img 
              :src="item.image" 
              alt="历史图片" 
              class="w-full h-32 object-cover rounded mb-2"
            />
            <p class="text-sm text-gray-600 truncate">{{ item.prompt }}</p>
            <p class="text-xs text-gray-400">{{ item.timestamp }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import ParameterSettings from '~/components/ParameterSettings.vue'

const PageHero = defineAsyncComponent(() => import('~/components/PageHero.vue'))

// 响应式数据
const paramSettings = ref(null)
const parameters = ref({
  mode: 'text-to-image',
  aspectRatio: '16:9',
  speed: 'fast',
  stylization: 250,
  weirdness: 0
})

const isGenerating = ref(false)
const generatedImage = ref('')
const generationTime = ref('')
const usedParameters = ref({})
const generationHistory = ref([])

// 处理生成事件
const handleGenerate = async (params: any) => {
  console.log('开始生成，参数:', params)
  
  isGenerating.value = true
  usedParameters.value = { ...params }
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 模拟生成结果
    generatedImage.value = 'https://via.placeholder.com/800x600/4A90E2/FFFFFF?text=Generated+Image'
    generationTime.value = new Date().toLocaleString()
    
    // 添加到历史记录
    generationHistory.value.unshift({
      image: generatedImage.value,
      prompt: params.prompt || '无提示词',
      timestamp: generationTime.value,
      parameters: params
    })
    
    // 限制历史记录数量
    if (generationHistory.value.length > 6) {
      generationHistory.value = generationHistory.value.slice(0, 6)
    }
    
  } catch (error) {
    console.error('生成失败:', error)
    // 这里可以显示错误提示
  } finally {
    isGenerating.value = false
  }
}

// 下载图片
const downloadImage = () => {
  if (generatedImage.value) {
    const link = document.createElement('a')
    link.href = generatedImage.value
    link.download = `generated-image-${Date.now()}.png`
    link.click()
  }
}

// 加载历史记录项
const loadHistoryItem = (item: any) => {
  if (paramSettings.value) {
    paramSettings.value.setParams(item.parameters)
  }
  generatedImage.value = item.image
  generationTime.value = item.timestamp
  usedParameters.value = item.parameters
}
</script>

<style scoped>
.generation-with-params {
  @apply min-h-screen bg-gray-50;
}
</style> 