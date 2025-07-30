<template>
  <div class="home-video-generator">
    <div class="generator-container">
      <!-- 左侧设置区域 -->
      <div class="settings-section">
        <ParameterSettings 
          ref="parameterSettings"
          v-model="parameters"
          @generate="handleGenerate"
          :hide-mode-switcher="true"
          :default-mode="'ai-video'"
        />
      </div>

      <!-- 右侧预览区域 -->
      <div class="preview-section">
        <GenerationPreview
          mode="video"
          :is-generating="isGenerating"
          :progress="progress"
          :generated-results="generatedResults"
          title="Video Generation Results"
          @download-media="downloadMedia"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ParameterSettings from './ParameterSettings.vue'
import GenerationPreview from './GenerationPreview.vue'
import { uploadImage, validateImageFile } from '~/utils/uploadAPI'
import { downloadFileWithFetch, generateDownloadFilename, getFileExtension } from '~/utils/downloadHelper'

// Reactive data
const parameterSettings = ref<any>(null)
const parameters = ref({
  mode: 'ai-video',
  aspectRatio: '16:9',
  speed: 'fast',
  stylization: 250,
  weirdness: 0
})

const isGenerating = ref(false)
const progress = ref(0)
const generatedResults = ref<any[]>([])
const uploadedImages = ref<string[]>([])

// Methods
const handleGenerate = async (params: any) => {
  console.log('Starting video generation:', params)
  
  // 获取表单数据
  const formData = {
    mode: params.mode,
    aspectRatio: params.aspectRatio,
    speed: params.speed,
    stylization: params.stylization,
    weirdness: params.weirdness,
    uploadedImages: uploadedImages.value
  }
  
  console.log('Form data:', formData)
  
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
        generateResults(formData)
      }, 500)
    }
  }, interval)
}

// 生成结果
const generateResults = (formData: any) => {
  // 根据选择的尺寸生成4个结果
  const aspectRatio = formData.aspectRatio
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
  
  const size = sizeMap[aspectRatio] || '512x288'
  
  // 生成4个结果
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
}

// 下载媒体文件
const downloadMedia = async (result: any) => {
  try {
    const extension = result.type === 'video' ? 'mp4' : getFileExtension(result.url)
    const filename = generateDownloadFilename(result.name, extension)
    
    console.log('Starting download:', result.name, 'filename:', filename)
    
    await downloadFileWithFetch(result.url, filename)
    
    console.log('Download successful:', filename)
  } catch (error) {
    console.error('Download failed:', error)
    alert('Download failed, please try again')
  }
}

// 处理图片上传
const handleImageUpload = async (files: FileList) => {
  try {
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
    
    console.log('Image upload successful:', uploadedUrls)
  } catch (error) {
    console.error('Image upload failed:', error)
    alert(error instanceof Error ? error.message : 'Image upload failed')
  }
}

// Set default mode on mount
onMounted(() => {
  if (parameterSettings.value) {
    parameterSettings.value.setParams({ mode: 'ai-video' })
  }
})

// Expose methods to parent component
defineExpose({
  getParams: () => parameters.value,
  setParams: (params: any) => {
    parameters.value = { ...parameters.value, ...params }
  },
  handleImageUpload
})
</script>

<style scoped>
.home-video-generator {
  @apply w-full;
}

.generator-container {
  @apply max-w-7xl mx-auto flex gap-8 p-6;
}

/* 左侧设置区域 */
.settings-section {
  @apply w-96 flex-shrink-0;
}

/* 右侧预览区域 */
.preview-section {
  @apply flex-1 min-h-[600px];
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
    @apply p-4;
  }
}
</style> 