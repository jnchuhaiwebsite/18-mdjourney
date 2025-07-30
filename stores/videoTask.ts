import { defineStore } from 'pinia'
import { checkTask } from '~/api'

interface VideoTask {
  taskId: string
  startTime: number
  isGenerating: boolean
  prompt: string
  type: 'text-to-image' | 'image-to-image' | 'ai-video'
  imageUrl?: string
  imageUrls?: string[]
  resolution: string
  duration: string
  isShow: boolean
  speed: 'relaxed' | 'fast' | 'turbo'
  resultUrl?: string
}

const durationConfig = {
  'text-to-image': {
    relaxed: 10 * 1000,
    fast: 5 * 1000,
    turbo: 2 * 1000,
  },
  'image-to-image': {
    relaxed: 15 * 1000,
    fast: 8 * 1000,
    turbo: 4 * 1000,
  },
  'ai-video': {
    relaxed: 120 * 1000,
    fast: 60 * 1000,
    turbo: 30 * 1000,
  }
};

export const useVideoTaskStore = defineStore('videoTask', {
  state: () => ({
    currentTask: null as VideoTask | null,
    taskQueue: [] as VideoTask[],
    completedTasks: [] as VideoTask[],
    progress: 0,
    progressInterval: null as NodeJS.Timeout | null,
    pollingInterval: null as NodeJS.Timeout | null,
  }),
  
  getters: {
    latestTask(): VideoTask | null {
      if (this.currentTask) return this.currentTask
      if (this.taskQueue.length > 0) return this.taskQueue[this.taskQueue.length - 1]
      if (this.completedTasks.length > 0) return this.completedTasks[this.completedTasks.length - 1]
      return null
    },
    
    activeTaskCount(): number {
      return this.taskQueue.length + (this.currentTask ? 1 : 0)
    },
  },
  
  actions: {
    startTask(taskId: string | null, speed: 'relaxed' | 'fast' | 'turbo', mode: 'text-to-image' | 'image-to-image' | 'ai-video') {
      const totalDuration = durationConfig[mode][speed];

      const task: VideoTask = {
        taskId: taskId || '',
        speed,
        type: mode,
        startTime: Date.now(),
        isGenerating: true,
        prompt: '',
        resolution: '',
        duration: '',
        isShow: false,
      };

      this.addTask(task);
      this.startProgressAnimation(totalDuration);

      if (taskId) {
        this.startPolling(taskId);
      }
    },

    setTaskId(newTaskId: string) {
      if (this.currentTask) {
        this.currentTask.taskId = newTaskId;
        this.startPolling(newTaskId);
      }
    },

    startProgressAnimation(duration: number) {
      this.stopProgressAnimation();
      this.progress = 0;
      const startTime = Date.now();

      this.progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(99, (elapsedTime / duration) * 100); // Stop at 99%
        this.progress = progress;
        if (progress >= 99) {
          this.stopProgressAnimation(false); // Don't reset progress to 0
        }
      }, 100);
    },

    stopProgressAnimation(reset = true) {
      if (this.progressInterval) {
        clearInterval(this.progressInterval);
        this.progressInterval = null;
      }
      if (reset) {
        this.progress = 0;
      }
    },

    startPolling(taskId: string) {
      this.stopPolling();

      this.pollingInterval = setInterval(async () => {
        try {
          const response = await checkTask(taskId);
          if (response.code === 200 && response.data) {
            if (response.data.status === 1 || response.data.status === -1) {
              this.stopPolling();
              this.progress = 100; // Mark as complete
              if (this.currentTask) {
                this.currentTask.isGenerating = false;
                this.currentTask.resultUrl = response.data.url || '';
                this.completeTask(this.currentTask.taskId);
              }
              // Hide progress bar after a short delay
              setTimeout(() => this.stopProgressAnimation(), 2000);
            }
          }
        } catch (error) {
          console.error('Error checking task status:', error);
          this.stopPolling();
          this.stopProgressAnimation();
        }
      }, 2000);
    },

    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },

    addTask(task: VideoTask) {
      if (!this.currentTask) {
        this.currentTask = task;
      } else {
        this.taskQueue.push(task);
      }
    },
    
    completeTask(taskId: string) {
      if (this.currentTask?.taskId === taskId) {
        this.completedTasks.push(this.currentTask);
        this.currentTask = null;
        
        if (this.taskQueue.length > 0) {
          this.currentTask = this.taskQueue.shift()!;
        }
      }
    },

    clearCurrentTask() {
      this.stopPolling();
      this.stopProgressAnimation();
      this.currentTask = null;
    },
  }
})
