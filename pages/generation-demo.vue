<template>
  <main class="w-full mx-auto mt-8 p-6 bg-blue-pale rounded-lg max-w-7xl min-h-screen">
    <!-- 页面标题 -->
    <section class="min-h-[200px] relative pt-[64px] mb-8">
      <div class="text-center">
        <h1 class="text-4xl lg:text-5xl font-bold text-blue-h1 mb-4">
          Generation Feature Demo
        </h1>
        <p class="text-xl text-blue-h1p max-w-3xl mx-auto">
          Demonstrates complete image/video generation functionality, including form data collection, image upload, progress bar display, and local download
        </p>
      </div>
    </section>

    <!-- 生成器区域 -->
    <section class="generator-container">
      <!-- 左侧设置区域 -->
      <div class="settings-section">
        <ParameterSettings 
          ref="parameterSettings"
          v-model="parameters"
          @generate="handleGenerate"
          :available-modes="['text-to-image', 'image-to-image', 'ai-video']"
          :default-mode="'text-to-image'"
        />
      </div>

      <!-- 右侧预览区域 -->
      <div class="preview-section">
        <GenerationPreview
          :mode="previewMode"
          :is-generating="isGenerating"
          :progress="progress"
          :generated-results="generatedResults"
          :title="previewTitle"
          @download-media="downloadMedia"
        />
      </div>
    </section>

    <!-- 调试信息 -->
    <section class="debug-info mt-8">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Debug Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="font-medium text-gray-700 mb-2">Form Data</h4>
            <pre class="bg-gray-100 p-3 rounded text-sm overflow-auto">{{ JSON.stringify(formData, null, 2) }}</pre>
          </div>
          <div>
            <h4 class="font-medium text-gray-700 mb-2">Uploaded Images</h4>
            <div class="space-y-2">
              <div v-for="(url, index) in uploadedImages" :key="index" class="flex items-center gap-2">
                <img :src="url" alt="Uploaded Image" class="w-8 h-8 rounded object-cover" />
                <span class="text-sm text-gray-600">{{ url }}</span>
              </div>
              <p v-if="uploadedImages.length === 0" class="text-sm text-gray-500">No uploaded images</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 测试按钮 -->
    <section class="test-buttons mt-8">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Test Features</h3>
        <div class="flex gap-4">
          <button 
            @click="loadTestData"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load Test Data
          </button>
          <button 
            @click="generatedResults = []"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Clear Results
          </button>
        </div>
      </div>
    </section>

    <!-- 操作日志 -->
    <section class="operation-log mt-8">
      <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Operation Log</h3>
        <div class="space-y-2 max-h-60 overflow-y-auto">
          <div 
            v-for="(log, index) in operationLogs" 
            :key="index"
            class="p-2 bg-gray-50 rounded text-sm"
          >
            <span class="text-gray-500">{{ log.time }}</span>
            <span class="ml-2">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ParameterSettings from '~/components/ParameterSettings.vue'
import GenerationPreview from '~/components/GenerationPreview.vue'
import { uploadImage, validateImageFile } from '~/utils/uploadAPI'
import { downloadFileWithFetch, generateDownloadFilename, getFileExtension } from '~/utils/downloadHelper'

// 参数状态
const parameters = ref({
  mode: 'text-to-image',
  aspectRatio: '16:9',
  speed: 'fast',
  stylization: 250,
  weirdness: 0
})

const isGenerating = ref(false)
const progress = ref(0)
const generatedResults = ref<any[]>([])
const uploadedImages = ref<string[]>([])
const formData = ref<any>({})
const operationLogs = ref<any[]>([])

// 计算属性
const previewMode = computed(() => {
  return parameters.value.mode === 'ai-video' ? 'video' : 'image'
})

const previewTitle = computed(() => {
  const mode = parameters.value.mode
  if (mode === 'ai-video') return 'Video Generation Results'
  if (mode === 'image-to-image') return 'Image to Image Results'
  return 'Text to Image Results'
})

// 监听参数变化
watch(parameters, (newParams) => {
  addLog(`Parameters updated: ${newParams.mode} - ${newParams.aspectRatio} - ${newParams.speed}`)
}, { deep: true })

// 处理生成事件
const handleGenerate = async (params: any) => {
  addLog('Starting generation...')
  
  // 获取表单数据
  formData.value = {
    mode: params.mode,
    aspectRatio: params.aspectRatio,
    speed: params.speed,
    stylization: params.stylization,
    weirdness: params.weirdness,
    uploadedImages: uploadedImages.value
  }
  
  addLog(`Form data: ${JSON.stringify(formData.value)}`)
  
  // 开始生成
  isGenerating.value = true
  progress.value = 0
  
  // 模拟10秒生成进度
  const totalTime = 10000 // 10秒
  const interval = 100 // 每100ms更新一次
  const step = (interval / totalTime) * 100
  
  const progressInterval = setInterval(() => {
    progress.value += step
    if (progress.value >= 100) {
      clearInterval(progressInterval)
      setTimeout(() => {
        isGenerating.value = false
        generateResults(formData.value)
        addLog('Generation completed')
      }, 500)
    }
  }, interval)
}

// 生成结果
const generateResults = (formData: any) => {
  const isVideo = formData.mode === 'ai-video'
  const aspectRatio = formData.aspectRatio
  
  // 根据选择的尺寸生成4个结果
  const sizeMap = {
    '1:1': '512x512',
    '4:3': '512x384',
    '3:2': '512x341',
    '16:9': '512x288',
    '2:1': '512x256',
    '3:4': '384x512',
    '2:3': '341x512',
    '9:16': '288x512'
  }
  
  const size = sizeMap[aspectRatio] || (isVideo ? '512x288' : '512x512')
  
  if (isVideo) {
    // 生成视频结果
    generatedResults.value = [
      {
        id: 1,
        name: 'AI Generated Video_001',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        type: 'video',
        size: size,
        quality: 'High Quality',
        model: 'Runway Gen-3',
        generationTime: 180,
        createdAt: Date.now(),
        parameters: formData
      },
      {
        id: 2,
        name: 'AI Generated Video_002',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        type: 'video',
        size: size,
        quality: 'Ultra High Quality',
        model: 'Pika Labs',
        generationTime: 240,
        createdAt: Date.now(),
        parameters: formData
      },
      {
        id: 3,
        name: 'AI Generated Video_003',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        type: 'video',
        size: size,
        quality: 'High Quality',
        model: 'Stable Video Diffusion',
        generationTime: 195,
        createdAt: Date.now(),
        parameters: formData
      },
      {
        id: 4,
        name: 'AI Generated Video_004',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
        type: 'video',
        size: size,
        quality: 'High Quality',
        model: 'Runway Gen-3',
        generationTime: 210,
        createdAt: Date.now(),
        parameters: formData
      }
    ]
  } else {
    // 生成图片结果
    generatedResults.value = [
      {
        id: 1,
        name: 'AI Generated Image_001',
        url: `https://picsum.photos/${size.split('x')[0]}/${size.split('x')[1]}?random=1`,
        type: 'image',
        size: size,
        quality: 'High Quality',
        model: 'Stable Diffusion XL',
        generationTime: 45,
        createdAt: Date.now(),
        parameters: formData
      },
      {
        id: 2,
        name: 'AI Generated Image_002',
        url: `https://picsum.photos/${size.split('x')[0]}/${size.split('x')[1]}?random=2`,
        type: 'image',
        size: size,
        quality: 'Ultra High Quality',
        model: 'Midjourney v6',
        generationTime: 67,
        createdAt: Date.now(),
        parameters: formData
      },
      {
        id: 3,
        name: 'AI Generated Image_003',
        url: `https://picsum.photos/${size.split('x')[0]}/${size.split('x')[1]}?random=3`,
        type: 'image',
        size: size,
        quality: 'High Quality',
        model: 'DALL-E 3',
        generationTime: 52,
        createdAt: Date.now(),
        parameters: formData
      },
      {
        id: 4,
        name: 'AI Generated Image_004',
        url: `https://picsum.photos/${size.split('x')[0]}/${size.split('x')[1]}?random=4`,
        type: 'image',
        size: size,
        quality: 'High Quality',
        model: 'Stable Diffusion XL',
        generationTime: 58,
        createdAt: Date.now(),
        parameters: formData
      }
    ]
  }
  
  addLog(`Generated ${generatedResults.value.length} results`)
}

// 下载媒体文件
const downloadMedia = async (result: any) => {
  try {
    const extension = result.type === 'video' ? 'mp4' : getFileExtension(result.url)
    const filename = generateDownloadFilename(result.name, extension)
    
    addLog(`Starting download: ${result.name}`)
    
    await downloadFileWithFetch(result.url, filename)
    
    addLog(`Download successful: ${filename}`)
  } catch (error) {
    console.error('Download failed:', error)
    addLog(`Download failed: ${error}`)
    alert('Download failed, please try again')
  }
}

// 处理图片上传
const handleImageUpload = async (files: FileList) => {
  try {
    addLog(`Starting upload of ${files.length} files`)
    
    const uploadPromises = Array.from(files).map(async (file) => {
      // 验证文件
      validateImageFile(file)
      
      // 上传文件
      const uploadResult = await uploadImage(file)
      
      if (uploadResult.success) {
        return uploadResult.url
      } else {
        throw new Error(uploadResult.message || 'Upload failed')
      }
    })
    
    const uploadedUrls = await Promise.all(uploadPromises)
    uploadedImages.value = uploadedUrls
    
    addLog(`Image upload successful: ${uploadedUrls.length} files`)
  } catch (error) {
    console.error('Image upload failed:', error)
    addLog(`Image upload failed: ${error}`)
    alert(error instanceof Error ? error.message : 'Image upload failed')
  }
}

// 添加日志
const addLog = (message: string) => {
  const time = new Date().toLocaleTimeString()
  operationLogs.value.unshift({ time, message })
  if (operationLogs.value.length > 50) {
    operationLogs.value = operationLogs.value.slice(0, 50)
  }
}

// 初始化
  addLog('Page loaded successfully')

// 添加测试数据
const testResults = [
  {
    id: 1,
    name: '测试图片_正方形',
    url: 'https://picsum.photos/512/512?random=1',
    type: 'image',
    size: '512x512',
    quality: '高质量',
    model: '测试模型',
    generationTime: 45,
    createdAt: Date.now()
  },
  {
    id: 2,
    name: '测试图片_横向',
    url: 'https://picsum.photos/512/288?random=2',
    type: 'image',
    size: '512x288',
    quality: '高质量',
    model: '测试模型',
    generationTime: 45,
    createdAt: Date.now()
  },
  {
    id: 3,
    name: '测试图片_纵向',
    url: 'https://picsum.photos/288/512?random=3',
    type: 'image',
    size: '288x512',
    quality: '高质量',
    model: '测试模型',
    generationTime: 45,
    createdAt: Date.now()
  },
  {
    id: 4,
    name: '测试视频_纵向',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    type: 'video',
    size: '288x512',
    quality: '高质量',
    model: '测试模型',
    generationTime: 180,
    createdAt: Date.now()
  },
  {
    id: 5,
    name: '测试图片_极纵向',
    url: 'https://picsum.photos/200/800?random=5',
    type: 'image',
    size: '200x800',
    quality: '高质量',
    model: '测试模型',
    generationTime: 45,
    createdAt: Date.now()
  },
  {
    id: 6,
    name: '测试视频_极纵向',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    type: 'video',
    size: '200x800',
    quality: '高质量',
    model: '测试模型',
    generationTime: 180,
    createdAt: Date.now()
  }
]

// 添加测试按钮
const loadTestData = () => {
  generatedResults.value = testResults
  addLog('加载测试数据')
}
</script>

<style scoped>
.generator-container {
  @apply flex gap-8;
}

/* 左侧设置区域 */
.settings-section {
  @apply w-96 flex-shrink-0;
}

/* 右侧预览区域 */
.preview-section {
  @apply flex-1 min-h-[600px];
}

.debug-info {
  @apply mt-8;
}

.operation-log {
  @apply mt-8;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .generator-container {
    @apply flex-col gap-6;
  }
  
  .settings-section {
    @apply w-full;
  }
}

@media (max-width: 768px) {
  .generator-container {
    @apply gap-4;
  }
}
</style> 