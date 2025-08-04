<template>
  <div class="generation-preview">
    <!-- 预览头部 -->
    <div class="preview-header">
      <span class="preview-title">{{ title }}</span>
      <div v-if="generatedResults.length > 0" class="preview-stats">
        <span class="stat-item">
          <i class="fa-solid fa-image"></i>
          {{ generatedResults.length }} results
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
            @mouseenter="result.type === 'video' ? playVideo($event) : null"
            @mouseleave="result.type === 'video' ? pauseVideo($event) : null"
            @click="result.type === 'video' ? togglePlay($event) : null"
          >
            <!-- 视频预览 -->
            <video 
              v-if="result.type === 'video'"
              ref="videoElement"
              :src="result.url" 
              class="result-media video-media"
              muted
              loop
              preload="metadata"
              @error="handleMediaError"
              @play="updatePlayState(result.id, true)"
              @pause="updatePlayState(result.id, false)"
            ></video>
            
            <!-- 图片预览 -->
            <img 
              v-else
              :src="result.url" 
              :alt="result.name"
              class="result-media image-media"
              @error="handleMediaError"
            />
            
            <!-- 播放状态指示器 -->
            <div 
              v-if="result.type === 'video' && !getPlayState(result.id)" 
              class="play-indicator"
            >
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            
            <!-- 占位符内容 -->
            <div v-if="result.loadError" class="placeholder-content">
              <i class="fa-solid fa-image text-4xl text-gray-400 mb-2"></i>
              <p class="text-sm text-gray-500">{{ result.type === 'video' ? 'video preview' : 'image preview' }}</p>
            </div>
              
              <!-- 尺寸标签 -->
              <!-- <div class="size-label">
                {{ result.size }}
              </div> -->
            
                          <!-- 下载按钮 -->
            <button 
              class="download-btn" 
              @click="downloadMedia(result)"
              title="Download"
            >
              <svg class="w-5 h-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M512 741.877551c-11.493878 0-20.897959-9.404082-20.897959-20.897959V303.020408c0-11.493878 9.404082-20.897959 20.897959-20.897959s20.897959 9.404082 20.897959 20.897959v417.959184c0 11.493878-9.404082 20.897959-20.897959 20.897959z" fill="currentColor"></path>
                <path d="M512 741.877551c-5.22449 0-10.44898-2.089796-14.628571-6.269388-8.359184-8.359184-8.359184-21.420408 0-29.779592l169.273469-169.273469c8.359184-8.359184 21.420408-8.359184 29.779592 0 8.359184 8.359184 8.359184 21.420408 0 29.779592l-169.27347 169.273469c-4.702041 4.179592-9.926531 6.269388-15.15102 6.269388z" fill="currentColor"></path>
                <path d="M512 741.877551c-5.22449 0-10.44898-2.089796-14.628571-6.269388l-169.27347-169.273469c-8.359184-8.359184-8.359184-21.420408 0-29.779592 8.359184-8.359184 21.420408-8.359184 29.779592 0l169.273469 169.273469c8.359184 8.359184 8.359184 21.420408 0 29.779592-4.702041 4.179592-9.926531 6.269388-15.15102 6.269388z" fill="currentColor"></path>
                <path d="M512 929.959184c-230.4 0-417.959184-187.559184-417.959184-417.959184s187.559184-417.959184 417.959184-417.959184 417.959184 187.559184 417.959184 417.959184-187.559184 417.959184-417.959184 417.959184z m0-794.122449c-207.412245 0-376.163265 168.75102-376.163265 376.163265s168.75102 376.163265 376.163265 376.163265 376.163265-168.75102 376.163265-376.163265-168.75102-376.163265-376.163265-376.163265z" fill="currentColor"></path>
              </svg>
            </button>

            <!-- 结果信息 -->
            <!-- <div class="result-info">
              <h4 class="result-name">{{ result.name }}</h4>
              <div class="result-meta">
                <span class="meta-item">{{ result.quality }}</span>
                <span class="meta-item">{{ result.model }}</span>
              </div>
            </div> -->
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-animation">
          <div class="floating-icon">🎨</div>
          <div class="floating-icon">✨</div>
          <div class="floating-icon">🚀</div>
        </div>
        <span class="empty-title">{{ emptyTitle }}</span>
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
const estimatedTime = ref()
const playStates = ref<Record<string, boolean>>({})

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

// 根据尺寸计算媒体元素样式
const getMediaStyle = (size: string) => {
  const [width, height] = size.split('x').map(Number)
  const aspectRatio = width / height
  
  // 设置最大宽度和高度，让媒体元素更好地填充容器
  const maxWidth = 320
  const maxHeight = 280  // 增加最大高度，更好地利用容器空间
  
  let mediaWidth, mediaHeight
  
  if (aspectRatio >= 1) {
    // 横向或正方形
    mediaWidth = Math.min(maxWidth, width)
    mediaHeight = mediaWidth / aspectRatio
  } else {
    // 纵向 - 限制最大高度
    mediaHeight = Math.min(maxHeight, height)
    mediaWidth = mediaHeight * aspectRatio
  }
  
  console.log(`尺寸: ${size}, 宽: ${mediaWidth}px, 高: ${mediaHeight}px, 比例: ${aspectRatio.toFixed(2)}`)
  
  return {
    width: `${mediaWidth}px`,
    height: `${mediaHeight}px`,
    aspectRatio: `${width} / ${height}`,
    maxHeight: `${maxHeight}px`  // 最大高度限制
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

// 视频播放控制
const playVideo = (event: Event) => {
  const container = event.currentTarget as HTMLElement
  const video = container.querySelector('video') as HTMLVideoElement
  if (video) {
    video.play().catch(err => {
      console.warn('Video play failed:', err)
    })
  }
}

const pauseVideo = (event: Event) => {
  const container = event.currentTarget as HTMLElement
  const video = container.querySelector('video') as HTMLVideoElement
  if (video) {
    video.pause()
  }
}

const togglePlay = (event: Event) => {
  const container = event.currentTarget as HTMLElement
  const video = container.querySelector('video') as HTMLVideoElement
  if (video) {
    if (video.paused) {
      video.play().catch(err => {
        console.warn('Video play failed:', err)
      })
    } else {
      video.pause()
    }
  }
}

// 播放状态管理
const updatePlayState = (resultId: string, isPlaying: boolean) => {
  playStates.value[resultId] = isPlaying
}

const getPlayState = (resultId: string) => {
  return playStates.value[resultId] || false
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
  @apply h-full flex flex-col;
  padding: 1.5rem;
}

.preview-content .empty-state {
  padding-left: 0 !important;
  padding-right: 0 !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  flex-direction: column !important;
  width: 100% !important;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
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
  @apply relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300;
  @apply bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center;
  width: 100%;
  height: 280px;  /* 固定高度 */
}

.result-item::before {
  content: '';
  @apply absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-200;
}

.result-item:hover::before {
  @apply opacity-100;
}

.result-media {
  @apply max-w-full max-h-full object-contain rounded-lg transition-all duration-300;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.result-media:hover {
  @apply shadow-lg;
  transform: scale(1.02);
}

.video-media {
  @apply cursor-pointer;
}

.image-media {
  @apply cursor-default;
}

.play-indicator {
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
  @apply flex items-center justify-center text-white opacity-80 hover:opacity-100 transition-all duration-200 cursor-pointer;
  @apply w-16 h-16 rounded-full;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 10;
}

.play-indicator:hover {
  background: rgba(0, 0, 0, 0.6);
  @apply scale-110;
}

.size-label {
  @apply absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded;
}

.placeholder-content {
  @apply flex flex-col items-center justify-center text-center p-4;
}

.download-btn {
  @apply absolute top-2 right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all duration-200 shadow-lg;
}

.download-btn:hover {
  @apply shadow-xl;
}

.download-btn i {
  @apply text-sm;
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
  @apply flex flex-col items-center justify-center py-12 flex-1 w-full;
}

.empty-animation {
  @apply relative w-32 h-32 mb-6;
  margin: 0 auto;
}

.floating-icon {
  @apply absolute text-4xl animate-bounce;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
}

.floating-icon:nth-child(1) {
  animation-delay: 0s;
  left: 50%;
  top: 50%;
}

.floating-icon:nth-child(2) {
  animation-delay: 0.33s;
  left: 30%;
  top: 35%;
  transform: translate(-50%, -50%) scale(0.8);
}

.floating-icon:nth-child(3) {
  animation-delay: 0.66s;
  left: 70%;
  top: 65%;
  transform: translate(-50%, -50%) scale(0.9);
}

.empty-title {
  @apply text-xl font-semibold text-gray-800 mb-2 text-center w-full;
  margin: 0 auto;
}

.empty-subtitle {
  @apply text-gray-600 mb-6 text-center w-full;
  margin: 0 auto;
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