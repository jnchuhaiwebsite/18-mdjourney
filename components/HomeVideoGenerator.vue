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
        <!-- 测试按钮 -->
        <!-- <div style="padding: 10px; background: #f0f0f0; margin-bottom: 10px;">
          <button @click="testResults" style="padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; margin-right: 10px;">
            测试显示结果
          </button>
          <button @click="clearResults" style="padding: 5px 10px; background: #dc3545; color: white; border: none; border-radius: 4px;">
            清空结果
          </button>
        </div>
         -->
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
const { currentTask, progress, generatedResults } = storeToRefs(videoTaskStore);

const isGenerating = computed(() => !!currentTask.value?.isGenerating);
const uploadedImages = ref<string[]>([]);

// 根据URL检测文件类型
const detectFileType = (url: string): 'image' | 'video' => {
  const extension = url.split('.').pop()?.toLowerCase();
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  
  if (videoExtensions.includes(extension || '')) {
    return 'video';
  } else if (imageExtensions.includes(extension || '')) {
    return 'image';
  }
  // 默认返回视频类型（因为这是视频生成器）
  return 'video';
}

// 验证图片文件
const validateImageFile = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
  }

  if (file.size > maxSize) {
    throw new Error('File size must be less than 10MB');
  }
}

// 上传图片
const uploadImage = async (file: File) => {
  // 这里应该调用实际的上传API，暂时返回模拟结果
  try {
    // TODO: 实现实际的图片上传逻辑
    // const result = await upload({ file });
    // return { success: true, url: result.data };
    
    // 临时模拟上传成功
    return {
      success: true,
      url: URL.createObjectURL(file), // 临时使用本地URL
      message: 'Upload successful'
    };
  } catch (error) {
    return {
      success: false,
      url: '',
      message: error instanceof Error ? error.message : 'Upload failed'
    };
  }
}

// 测试函数
const testResults = () => {
  console.log('🧪 测试显示结果');
  const testUrls = [
    'https://resp.midjourneyai.net/midjourney/202507/31/86f48305-d820-4e7f-91e2-c5f32017bdef.mp4',
    'https://resp.midjourneyai.net/midjourney/202507/31/e12fd1e4-948d-4671-bfbd-42c2427ae8ec.mp4',
    'https://resp.midjourneyai.net/midjourney/202507/31/c487dfcd-7fc3-4489-b525-d66ad09f8ef7.mp4',
    'https://resp.midjourneyai.net/midjourney/202507/31/c483754a-cfdd-4694-83ed-49096682765d.mp4'
  ];
  videoTaskStore.displayResults(testUrls, 'test-task-id');
}

const clearResults = () => {
  console.log('🧹 清空结果');
  videoTaskStore.clearResults();
}

// Methods
const handleGenerate = async (params: any) => {
  console.log('HomeVideoGenerator handleGenerate 被调用，参数:', params);
  try {
    await generate(params);
    console.log('HomeVideoGenerator generate 调用完成');
  } catch (error) {
    console.error('HomeVideoGenerator generate 调用失败:', error);
  }
}

// 简化的监听逻辑 - 只在任务被清空时清空结果
// watch(currentTask, (newTask, oldTask) => {
//   if (!newTask && oldTask) {
//     console.log('HomeVideoGenerator 任务被清空，清空结果');
//     videoTaskStore.clearResults();
//   }
// }, { deep: true });

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