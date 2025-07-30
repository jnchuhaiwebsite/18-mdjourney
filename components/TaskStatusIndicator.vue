<template>
  <div v-if="activeTaskCount > 0" class="fixed top-4 left-4 z-50">
    <div class="bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50 shadow-xl">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-2 h-2 bg-[#ec2657] rounded-full animate-pulse"></div>
        <span class="text-white text-sm font-medium">Active Tasks</span>
        <span class="text-gray-400 text-xs">({{ activeTaskCount }})</span>
      </div>
      
      <!-- 当前任务 -->
      <div v-if="currentTask" class="mb-2">
        <div class="flex items-center justify-between">
          <span class="text-white text-xs truncate max-w-32">{{ currentTask.prompt }}</span>
          <span class="text-[#ec2657] text-xs font-medium">Processing</span>
        </div>
      </div>
      
      <!-- 队列中的任务 -->
      <div v-if="taskQueue.length > 0" class="space-y-1">
        <div class="text-gray-400 text-xs">Queued:</div>
        <div 
          v-for="task in taskQueue.slice(0, 2)" 
          :key="task.taskId"
          class="flex items-center justify-between"
        >
          <span class="text-white text-xs truncate max-w-32">{{ task.prompt }}</span>
          <span class="text-gray-500 text-xs">Queued</span>
        </div>
        <div v-if="taskQueue.length > 2" class="text-gray-500 text-xs">
          +{{ taskQueue.length - 2 }} more
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useVideoTaskStore } from '~/stores/videoTask'
import { storeToRefs } from 'pinia'

const videoTaskStore = useVideoTaskStore()
const { currentTask, taskQueue, activeTaskCount } = storeToRefs(videoTaskStore)
</script>