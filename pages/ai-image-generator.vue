<template>
  <div class="min-h-screen bg-blue-pale">
    <main class="w-full mx-auto p-6 bg-blue-pale rounded-lg max-w-7xl min-h-screen">
    <!-- 页面标题 -->
    <PageHero 
      title="The Midjourney Image Generator, Perfected."
      subtitle="Ditch Discord. Transform text and images into stunning, high-quality visuals with our seamless workflow, built to harness the full power of Midjourney V7."
    />

    <!-- 生成器区域 -->
    <section class="generator-container">
      <!-- 左侧设置区域 -->
      <div class="settings-section">
        <ParameterSettings 
          ref="parameterSettingsRef"
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
import { ref, computed, watch } from 'vue'
import { useSeo } from '~/composables/useSeo'
import PageHero from '~/components/PageHero.vue'
import ParameterSettings from '~/components/ParameterSettings.vue'
import GenerationPreview from '~/components/GenerationPreview.vue'
import { upload, createTasks } from '~/api/index'
import { useNuxtApp } from 'nuxt/app'
import { downloadFileWithFetch, generateDownloadFilename, getFileExtension } from '~/utils/downloadHelper'
import { useVideoTaskStore } from '~/stores/videoTask'
import { storeToRefs } from 'pinia'

import { useGeneration } from '~/composables/useGeneration';

// 使用默认的 SEO 配置
  useSeo(
    {
      title: 'Genesis Engine: The Ultimate Midjourney Image Generator',
      description: 'The ultimate Midjourney image generator, no Discord required. Genesis Engine offers intuitive text-to-image & image-to-image creation with V7. Start for free!'
    }
  )

const { generate } = useGeneration();
const videoTaskStore = useVideoTaskStore();
const { currentTask, progress } = storeToRefs(videoTaskStore);

const isGenerating = computed(() => !!currentTask.value?.isGenerating);

// 参数状态
const parameters = ref({
  mode: 'text-to-image',
  aspectRatio: '16:9',
  speed: 'fast',
  stylization: 250,
  weirdness: 0
})

const generatedResults = ref<any[]>([])
const uploadedImages = ref<string[]>([])

const { $toast } = useNuxtApp() as any;

// 处理生成事件
const handleGenerate = async (params: any) => {
  await generate(params);
}

watch(currentTask, (newTask, oldTask) => {
  // 当任务从“生成中”变为“非生成中”时，处理结果
  if (oldTask?.isGenerating && !newTask?.isGenerating && newTask?.resultUrl) {
    // 假设 resultUrl 就是图片/视频的地址
    // 这里我们可以创建一个或多个结果对象
    const size = parameters.value.aspectRatio === '1:1' ? '512x512' : '512x288'; // 示例尺寸
    generatedResults.value = [
      {
        id: newTask.taskId,
        name: 'AI Generated Content',
        url: newTask.resultUrl,
        type: newTask.type, // 'image' or 'video'
        size: size,
        quality: 'High Quality',
        model: 'Midjourney V7',
        createdAt: Date.now(),
        parameters: { ...parameters.value }
      }
    ];
  } else if (!newTask) {
    // 如果任务被清空，也清空结果
    generatedResults.value = [];
  }
}, { deep: true });

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