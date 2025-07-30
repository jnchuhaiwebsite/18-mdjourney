<template>
  <div class="min-h-screen bg-blue-pale">
    <main class="w-full mx-auto p-6 bg-blue-pale rounded-lg max-w-7xl min-h-screen">
    <!-- 页面标题 -->
    <PageHero 
      title="AI Image Generator"
      subtitle="Create stunning images with our advanced AI technology. Choose between text-to-image or image-to-image generation."
    />

    <!-- 生成器区域 -->
    <section class="generator-container">
      <!-- 左侧设置区域 -->
      <div class="settings-section">
        <ParameterSettings 
          ref="parameterSettings"
          v-model="parameters"
          @generate="handleGenerate"
          :available-modes="['text-to-image', 'image-to-image']"
          :default-mode="'text-to-image'"
        />
      </div>

      <!-- 右侧预览区域 -->
      <div class="preview-section">
        <GenerationPreview
          mode="image"
          :is-generating="isGenerating"
          :progress="progress"
          :generated-results="generatedResults"
          title="Image Generation Results"
          @download-media="downloadMedia"
        />
      </div>
    </section>
      </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useSeo } from '~/composables/useSeo'
import PageHero from '~/components/PageHero.vue'
import ParameterSettings from '~/components/ParameterSettings.vue'
import GenerationPreview from '~/components/GenerationPreview.vue'
import { uploadImage, validateImageFile } from '~/utils/uploadAPI'
import { downloadFileWithFetch, generateDownloadFilename, getFileExtension } from '~/utils/downloadHelper'

// 使用默认的 SEO 配置
useSeo()

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

// 处理生成事件
const handleGenerate = async (params: any) => {
  console.log('Generation event triggered:', params)
  
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
  
  const size = sizeMap[aspectRatio as keyof typeof sizeMap] || '512x512'
  
  // 生成4个结果
  generatedResults.value = [
    {
      id: 1,
      name: 'AI Generated Image_001',
      url: `https://picsum.photos/${size.split('x')[0]}/${size.split('x')[1]}?random=1`,
      type: 'image',
      size: size,
      quality: '高质量',
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
      quality: '超高质量',
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
      quality: '高质量',
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
      quality: '高质量',
      model: 'Stable Diffusion XL',
      generationTime: 58,
      createdAt: Date.now(),
      parameters: formData
    }
  ]
}

// 下载媒体文件
const downloadMedia = async (result: any) => {
  try {
    const extension = getFileExtension(result.url)
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

// 暴露方法给子组件
defineExpose({
  handleImageUpload
})
</script>

<style scoped>
.generator-container {
  @apply flex gap-8;
}

/* 左侧设置区域 */
.settings-section {
  @apply w-96 flex-shrink-0 flex flex-col;
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
    @apply gap-4;
  }
}
</style> 