<template>
  <div class="generation-preview">
    <!-- 预览头部 -->
    <div class="preview-header">
      <h3 class="preview-title">{{ title }}</h3>
      <div v-if="generatedResults.length > 0" class="preview-stats">
        <span class="stat-item">
          <i class="fa-solid fa-image"></i>
          {{ generatedResults.length }} 个结果
        </span>
      </div>
    </div>

    <!-- 预览内容 -->
    <div class="preview-content">
      <!-- 生成状态 -->
      <div v-if="isGenerating" class="generating-state">
        <div class="generation-animation">
          <div class="spinner"></div>
        </div>
        <h4 class="generating-title">{{ generatingTitle }}</h4>
        <p class="generating-subtitle">{{ generatingSubtitle }}</p>
        
        <!-- 简化进度条 -->
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-info">
            <span class="progress-text">{{ Math.round(progress) }}%</span>
            <span class="progress-time">{{ estimatedTime }}</span>
          </div>
        </div>
      </div>

      <!-- 生成结果 -->
      <div v-else-if="generatedResults.length > 0" class="results-container">
        <div class="results-grid">
          <div 
            v-for="(result, index) in generatedResults" 
            :key="result.id"
            class="result-item"
          >
            <div class="result-preview">
              <!-- 比例容器 -->
              <div 
                class="aspect-ratio-container"
                :style="getContainerStyle(result.size)"
              >
                              <!-- 视频预览 -->
              <video 
                v-if="result.type === 'video'"
                :src="result.url" 
                class="result-media"
                muted
                loop
                @error="handleMediaError"
              ></video>
              <!-- 图片预览 -->
              <img 
                v-else
                :src="result.url" 
                :alt="result.name"
                class="result-media"
                @error="handleMediaError"
              />
              
              <!-- 占位符内容 -->
              <div v-if="result.loadError" class="placeholder-content">
                <i class="fa-solid fa-image text-4xl text-gray-400 mb-2"></i>
                <p class="text-sm text-gray-500">{{ result.type === 'video' ? '视频预览' : '图片预览' }}</p>
              </div>
                
                <!-- 尺寸标签 -->
                <div class="size-label">
                  {{ result.size }}
                </div>
              </div>
              
              <!-- 下载按钮 -->
              <button 
                class="download-btn" 
                @click="downloadMedia(result)"
                title="Download"
              >
                <i class="fa-solid fa-download"></i>
              </button>
            </div>

            <!-- 结果信息 -->
            <div class="result-info">
              <h4 class="result-name">{{ result.name }}</h4>
              <div class="result-meta">
                <span class="meta-item">{{ result.quality }}</span>
                <span class="meta-item">{{ result.model }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-animation">
          <div class="floating-icon">🎨</div>
          <div class="floating-icon delay-1">✨</div>
          <div class="floating-icon delay-2">🚀</div>
        </div>
        <h3 class="empty-title">{{ emptyTitle }}</h3>
        <p class="empty-subtitle">{{ emptySubtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// Props
interface Props {
  mode?: 'image' | 'video'
  isGenerating?: boolean
  progress?: number
  generatedResults?: any[]
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'image',
  isGenerating: false,
  progress: 0,
  generatedResults: () => [],
  title: 'Generation Results'
})

// Emits
const emit = defineEmits<{
  'download-media': [result: any]
}>()

// Reactive data
const estimatedTime = ref('About 10 seconds')

// Computed properties
const generatingTitle = computed(() => {
  return props.mode === 'video' ? 'Generating Video...' : 'Generating Image...'
})

const generatingSubtitle = computed(() => {
  return props.mode === 'video' 
    ? 'AI is processing your video request, this may take a few minutes' 
    : 'AI is processing your image request, please wait'
})

const emptyTitle = computed(() => {
  return props.mode === 'video' ? 'Video Preview Area' : 'Image Preview Area'
})

const emptySubtitle = computed(() => {
  return props.mode === 'video' 
    ? 'Set parameters and click the generate button to start creating video' 
    : 'Set parameters and click the generate button to start creating image'
})

// 根据尺寸计算容器样式
const getContainerStyle = (size: string) => {
  const [width, height] = size.split('x').map(Number)
  const aspectRatio = width / height
  
  // 设置最大宽度和高度，确保纵向内容不会撑开布局
  const maxWidth = 280
  const maxHeight = 200  // 降低最大高度，避免纵向内容撑开
  
  let containerWidth, containerHeight
  
  if (aspectRatio >= 1) {
    // 横向或正方形
    containerWidth = Math.min(maxWidth, width)
    containerHeight = containerWidth / aspectRatio
  } else {
    // 纵向 - 限制最大高度
    containerHeight = Math.min(maxHeight, height)
    containerWidth = containerHeight * aspectRatio
  }
  
  console.log(`尺寸: ${size}, 宽: ${containerWidth}px, 高: ${containerHeight}px, 比例: ${aspectRatio.toFixed(2)}`)
  
  return {
    width: `${containerWidth}px`,
    height: `${containerHeight}px`,
    aspectRatio: `${width} / ${height}`,
    maxHeight: `${maxHeight}px`  // 添加最大高度限制
  }
}

// Methods
const downloadMedia = (result: any) => {
  emit('download-media', result)
}

const handleMediaError = (event: Event) => {
  const target = event.target as HTMLImageElement | HTMLVideoElement
  const resultItem = target.closest('.result-item')
  if (resultItem) {
    const resultIndex = Array.from(resultItem.parentElement?.children || []).indexOf(resultItem)
    if (resultIndex >= 0 && props.generatedResults[resultIndex]) {
      props.generatedResults[resultIndex].loadError = true
    }
  }
}

// Expose methods
defineExpose({
  downloadMedia
})
</script>

<style scoped>
.generation-preview {
  @apply bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col;
}

.preview-header {
  @apply flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50;
}

.preview-title {
  @apply text-xl font-semibold text-gray-800;
}

.preview-stats {
  @apply flex gap-4 text-sm text-gray-600;
}

.stat-item {
  @apply flex items-center gap-1;
}

.preview-content {
  @apply p-6 h-full flex flex-col;
}

/* 生成状态样式 */
.generating-state {
  @apply flex flex-col items-center justify-center py-12 flex-1;
}

.generation-animation {
  @apply relative w-24 h-24 mb-6;
}

.spinner {
  @apply w-full h-full border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin;
}

.generating-title {
  @apply text-xl font-semibold text-gray-800 mb-2;
}

.generating-subtitle {
  @apply text-gray-600 mb-6 text-center max-w-md;
}

.progress-container {
  @apply w-full max-w-md mb-6;
}

.progress-bar {
  @apply w-full bg-gray-200 rounded-full h-3 mb-2;
}

.progress-fill {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300;
}

.progress-info {
  @apply flex justify-between text-sm text-gray-600;
}

/* 结果容器样式 */
.results-container {
  @apply space-y-4 flex-1;
}

.results-grid {
  @apply grid grid-cols-2 gap-6;
  align-items: start;  /* 确保项目从顶部对齐 */
}

.result-item {
  @apply bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200;
  height: fit-content;  /* 适应内容高度 */
  max-height: 300px;    /* 限制最大高度 */
}

.result-preview {
  @apply relative bg-gray-100 flex justify-center items-center p-4;
  min-height: 220px;  /* 固定最小高度 */
  max-height: 220px;  /* 固定最大高度 */
}

.result-preview::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200;
}

.result-item:hover .result-preview::before {
  @apply opacity-100;
}

.aspect-ratio-container {
  @apply relative bg-gray-200 rounded-lg overflow-hidden shadow-sm flex items-center justify-center;
  border: 2px dashed #d1d5db;
  min-width: 100px;
  min-height: 100px;
  max-height: 200px;  /* 固定最大高度 */
  object-fit: contain;  /* 确保内容适应容器 */
}

.result-media {
  @apply w-full h-full object-cover;
  max-height: 200px;  /* 限制媒体元素最大高度 */
  object-fit: contain;  /* 确保内容完整显示 */
}

.size-label {
  @apply absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded;
}

.placeholder-content {
  @apply flex flex-col items-center justify-center text-center p-4;
}

.download-btn {
  @apply absolute top-2 right-2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg;
}

.result-info {
  @apply p-4;
}

.result-name {
  @apply text-sm font-medium text-gray-800 mb-2;
}

.result-meta {
  @apply flex gap-3 text-xs text-gray-600;
}

.meta-item {
  @apply flex items-center gap-1;
}

/* 空状态样式 */
.empty-state {
  @apply flex flex-col items-center justify-center py-12 flex-1;
}

.empty-animation {
  @apply relative w-32 h-32 mb-6;
}

.floating-icon {
  @apply absolute text-4xl animate-bounce;
}

.floating-icon.delay-1 {
  animation-delay: 0.5s;
}

.floating-icon.delay-2 {
  animation-delay: 1s;
}

.empty-title {
  @apply text-xl font-semibold text-gray-800 mb-2;
}

.empty-subtitle {
  @apply text-gray-600 mb-6 text-center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-header {
    @apply p-4;
  }
  
  .preview-content {
    @apply p-4;
  }
  
  .results-grid {
    @apply grid-cols-1;
  }
  
  .generation-steps {
    @apply flex-wrap justify-center;
  }
}

@media (max-width: 480px) {
  .preview-stats {
    @apply flex-col gap-1;
  }
}
</style> 