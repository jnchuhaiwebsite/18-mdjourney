import { defineStore } from 'pinia'

interface VideoTask {
  taskId: string
  startTime: number
  isGenerating: boolean
  prompt: string
  type: 'text' | 'image'
  imageUrl?: string
  imageUrls?: string[]
  resolution: string
  duration: string
  isShow: boolean
}

export const useVideoTaskStore = defineStore('videoTask', {
  state: () => ({
    currentTask: null as VideoTask | null,
    taskQueue: [] as VideoTask[], // 任务队列
    completedTasks: [] as VideoTask[], // 已完成的任务
  }),
  
  getters: {
    // 获取最新的任务（用于首页展示）
    latestTask(): VideoTask | null {
      if (this.currentTask) return this.currentTask
      if (this.taskQueue.length > 0) return this.taskQueue[this.taskQueue.length - 1]
      if (this.completedTasks.length > 0) return this.completedTasks[this.completedTasks.length - 1]
      return null
    },
    
    // 获取正在进行的任务数量
    activeTaskCount(): number {
      return this.taskQueue.length + (this.currentTask ? 1 : 0)
    },
    
    // 获取所有任务（包括当前任务和队列中的任务）
    allActiveTasks(): VideoTask[] {
      const tasks = [...this.taskQueue]
      if (this.currentTask) {
        tasks.unshift(this.currentTask)
      }
      return tasks
    }
  },
  
  actions: {
    setTask(task: VideoTask | null) {
      this.currentTask = task
      if (task) {
        localStorage.setItem('videoTask', JSON.stringify(task))
      } else {
        localStorage.removeItem('videoTask')
      }
    },
    
    // 添加新任务到队列
    addTask(task: VideoTask) {
      // 如果没有当前任务，设置为当前任务
      if (!this.currentTask) {
        this.currentTask = task
        localStorage.setItem('videoTask', JSON.stringify(task))
      } else {
        // 否则添加到队列
        this.taskQueue.push(task)
        this.saveTaskQueue()
      }
    },
    
    // 完成任务
    completeTask(taskId: string) {
      // 从当前任务或队列中移除任务
      if (this.currentTask?.taskId === taskId) {
        // 标记任务为已完成
        this.currentTask.isGenerating = false
        this.completedTasks.push(this.currentTask)
        this.currentTask = null
        localStorage.removeItem('videoTask')
        
        // 如果队列中有任务，开始下一个
        if (this.taskQueue.length > 0) {
          this.currentTask = this.taskQueue.shift()!
          localStorage.setItem('videoTask', JSON.stringify(this.currentTask))
          this.saveTaskQueue()
        }
      } else {
        // 从队列中移除
        const taskIndex = this.taskQueue.findIndex(task => task.taskId === taskId)
        if (taskIndex !== -1) {
          const completedTask = this.taskQueue.splice(taskIndex, 1)[0]
          completedTask.isGenerating = false
          this.completedTasks.push(completedTask)
          this.saveTaskQueue()
        }
      }
      
      // 保存已完成的任务
      this.saveCompletedTasks()
    },
    
    // 移除任务（失败或取消）
    removeTask(taskId: string) {
      if (this.currentTask?.taskId === taskId) {
        this.currentTask = null
        localStorage.removeItem('videoTask')
        
        // 如果队列中有任务，开始下一个
        if (this.taskQueue.length > 0) {
          this.currentTask = this.taskQueue.shift()!
          localStorage.setItem('videoTask', JSON.stringify(this.currentTask))
          this.saveTaskQueue()
        }
      } else {
        const taskIndex = this.taskQueue.findIndex(task => task.taskId === taskId)
        if (taskIndex !== -1) {
          this.taskQueue.splice(taskIndex, 1)
          this.saveTaskQueue()
        }
      }
      
      // 如果所有任务都移除了，清除缓存
      if (this.activeTaskCount === 0) {
        this.clearTask()
      }
    },
    
    getStoredTask(): VideoTask | null {
      const stored = localStorage.getItem('videoTask')
      return stored ? JSON.parse(stored) : null
    },
    
    getStoredTaskQueue(): VideoTask[] {
      const stored = localStorage.getItem('videoTaskQueue')
      return stored ? JSON.parse(stored) : []
    },
    
    getStoredCompletedTasks(): VideoTask[] {
      const stored = localStorage.getItem('videoTaskCompleted')
      return stored ? JSON.parse(stored) : []
    },
    
    // 保存任务队列到localStorage
    saveTaskQueue() {
      localStorage.setItem('videoTaskQueue', JSON.stringify(this.taskQueue))
    },
    
    // 保存已完成任务到localStorage
    saveCompletedTasks() {
      localStorage.setItem('videoTaskCompleted', JSON.stringify(this.completedTasks))
    },
    
    // 初始化store（从localStorage恢复状态）
    initializeStore() {
      // 恢复当前任务
      const storedTask = this.getStoredTask()
      if (storedTask) {
        this.currentTask = storedTask
      }
      
      // 恢复任务队列
      this.taskQueue = this.getStoredTaskQueue()
      
      // 恢复已完成任务
      this.completedTasks = this.getStoredCompletedTasks()
    },
    
    clearTask() {
      this.currentTask = null
      this.taskQueue = []
      this.completedTasks = []
      localStorage.removeItem('videoTask')
      localStorage.removeItem('videoTaskQueue')
      localStorage.removeItem('videoTaskCompleted')
      localStorage.removeItem('formCache')
    },
    
    // 清理旧任务（保留最近10个已完成任务）
    cleanupOldTasks() {
      if (this.completedTasks.length > 10) {
        this.completedTasks = this.completedTasks.slice(-10)
        this.saveCompletedTasks()
      }
    }
  }
}) 