<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.taskId"
        class="bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-lg p-4 min-w-[300px] max-w-[400px] border border-gray-700/50"
        :class="{
          'border-green-500/50': notification.status === 'success',
          'border-red-500/50': notification.status === 'error'
        }"
        @mouseenter="pauseAutoHide(notification.taskId)"
        @mouseleave="resumeAutoHide(notification.taskId)"
      >
        <div class="flex items-start gap-3 p-4 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-700/50 shadow-xl">
          <!-- 状态图标 -->
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="notification.status === 'success'" class="w-6 h-6 text-green-400" />
            <XCircleIcon v-else-if="notification.status === 'error'" class="w-6 h-6 text-red-400" />
          </div>
          
          <!-- 通知内容 -->
          <div class="flex-1 min-w-0">
            <p v-if="notification.prompt" class="text-gray-400 text-sm mt-1 truncate" :title="notification.prompt">
               {{ notification.prompt }}
            </p>
            <p v-else class="text-gray-500 text-sm mt-1 italic">
               No prompt available
            </p>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-400">{{ formatTime(notification.timestamp) }}</span>
            </div>
          </div>
          
          <!-- 关闭按钮 -->
          <button
            @click="removeNotification(notification.taskId)"
            class="flex-shrink-0 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
        
        <!-- 操作按钮 -->
        <div v-if="notification.videoUrl" class="mt-3 flex justify-end gap-2">
          <button
            @click="viewVideo(notification.videoUrl)"
            class="px-3 py-1.5 text-sm bg-[#00ffd1]/10 text-[#00ffd1] rounded-lg hover:bg-[#00ffd1]/20 transition-colors"
          >
            View video
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useNotificationStore } from '~/stores/notification'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useNuxtApp } from 'nuxt/app'
import { watch } from 'vue'

const router = useRouter()
const { $toast } = useNuxtApp() as any
const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)

// 监听通知变化，打印调试信息
watch(notifications, (newNotifications) => {
  console.log('通知列表变化:', newNotifications)
  newNotifications.forEach(notification => {
    console.log(`通知 ${notification.taskId} 的prompt:`, notification.prompt)
  })
}, { deep: true })

// 移除通知
const removeNotification = (taskId: string) => {
  notificationStore.removeNotification(taskId)
}

// 暂停自动隐藏
const pauseAutoHide = (taskId: string) => {
  notificationStore.pauseAutoHide(taskId)
}

// 恢复自动隐藏
const resumeAutoHide = (taskId: string) => {
  notificationStore.resumeAutoHide(taskId)
}

// 查看视频
const viewVideo = (videoUrl: string) => {
  // 跳转到个人作品页面
  router.push('/profile')
}

// 格式化时间
const formatTime = (timestamp: number) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) { // 1分钟内
    return 'Just now'
  } else if (diff < 3600000) { // 1小时内
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  } else if (diff < 86400000) { // 1天内
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diff / 86400000)
    return `${days}d ago`
  }
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style> 