<template>
  <div class="parameter-demo">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8">Parameter Settings Component Demo</h1>
      
      <!-- 参数设置组件 -->
      <ParameterSettings 
        v-model="parameters"
        @generate="handleGenerate"
      />
      
      <!-- 参数显示区域 -->
      <div class="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 class="text-xl font-semibold mb-4">Current Parameters</h2>
        <pre class="bg-white p-4 rounded border overflow-auto">{{ JSON.stringify(parameters, null, 2) }}</pre>
      </div>
      
      <!-- 生成结果区域 -->
      <div v-if="generationResult" class="mt-8 p-6 bg-green-50 rounded-lg">
        <h2 class="text-xl font-semibold mb-4 text-green-800">Generation Result</h2>
        <pre class="bg-white p-4 rounded border overflow-auto">{{ JSON.stringify(generationResult, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ParameterSettings from '~/components/ParameterSettings.vue'

// 参数状态
const parameters = ref({
  mode: 'text-to-image',
  aspectRatio: '16:9',
  speed: 'fast',
  stylization: 250,
  weirdness: 0
})

// 生成结果
const generationResult = ref(null)

// 处理生成事件
const handleGenerate = (params: any) => {
  console.log('Generation parameters:', params)
  generationResult.value = {
    timestamp: new Date().toISOString(),
    params: params,
    status: 'success',
    message: 'Generation request sent'
  }
  
  // 这里可以调用实际的生成API
  // 例如：await generateImage(params)
}
</script>

<style scoped>
.parameter-demo {
  @apply min-h-screen bg-gray-100;
}

.container {
  @apply max-w-6xl;
}
</style> 