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
import { ref, onMounted, computed, watch } from 'vue'
import ParameterSettings from './ParameterSettings.vue'
import GenerationPreview from './GenerationPreview.vue'
import { downloadFileWithFetch, generateDownloadFilename, getFileExtension } from '~/utils/downloadHelper'
import { useGeneration } from '~/composables/useGeneration'
import { useVideoTaskStore } from '~/stores/videoTask'
import { storeToRefs } from 'pinia'

// Reactive data
const parameterSettings = ref<any>(null)
const parameters = ref({
  mode: 'ai-video',
  aspectRatio: '16:9',
  speed: 'fast',
  stylization: 250,
  weirdness: 0
})

const { generate } = useGeneration();
const videoTaskStore = useVideoTaskStore();
const { currentTask, progress } = storeToRefs(videoTaskStore);

const isGenerating = computed(() => !!currentTask.value?.isGenerating);
const generatedResults = ref<any[]>([])

// Methods
const handleGenerate = async (params: any) => {
  await generate(params);
}

watch(currentTask, (newTask, oldTask) => {
  if (oldTask?.isGenerating && !newTask?.isGenerating && newTask?.resultUrl) {
    const size = parameters.value.aspectRatio === '1:1' ? '512x512' : '512x288';
    generatedResults.value = [
      {
        id: newTask.taskId,
        name: 'AI Generated Video',
        url: newTask.resultUrl,
        type: newTask.type,
        size: size,
        quality: 'High Quality',
        model: 'Runway Gen-3',
        createdAt: Date.now(),
        parameters: { ...parameters.value }
      }
    ];
  } else if (!newTask) {
    generatedResults.value = [];
  }
}, { deep: true });

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