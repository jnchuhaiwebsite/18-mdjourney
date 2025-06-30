import { defineStore } from 'pinia'
import { checkTask } from '~/api'

interface Notification {
  taskId: string
  status: 'success' | 'error'
  message: string
  videoUrl?: string
  prompt?: string
  origin?: string
  autoHideTimer?: number
  timestamp: number
}

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as Notification[],
    checkingTasks: new Set<string>(),
    checkIntervals: new Map<string, number>()
  }),
  
  getters: {
    // 获取最新的通知
    latestNotification(): Notification | null {
      return this.notifications.length > 0 ? this.notifications[this.notifications.length - 1] : null
    }
  },
  
  actions: {
    startCheckingTask(taskId: string) {
      if (this.checkingTasks.has(taskId)) {
        console.log(`任务 ${taskId} 已在检查中，跳过`)
        return
      }
      
      console.log(`开始检查任务 ${taskId}`)
      this.checkingTasks.add(taskId)
      
      // 不添加进度通知，只检查任务状态
      
      // 开始轮询检查任务状态
      const interval = window.setInterval(async () => {
        console.log(`正在检查任务 ${taskId}...`)
        try {
          const response = await checkTask(taskId) as any
          if (response.code === 200) {
            // 检查任务状态
            const status = response.data.status
            console.log(`任务 ${taskId} 状态:`, status, '类型:', typeof status, '视频URL:', response.data.video_url)
            console.log(`任务 ${taskId} 完整返回数据:`, response.data)
            console.log(`任务 ${taskId} prompt字段:`, response.data.prompt)
            
            if (status == 1 && response.data.video_url) {
              // 任务完成 - 只有status==1且video_url存在才认为完成
              console.log(`任务 ${taskId} 成功完成，获得视频URL`)
              
              // 尝试从videoTaskStore获取提示词作为备选
              let taskPrompt = response.data.prompt
              if (!taskPrompt) {
                const { useVideoTaskStore } = await import('~/stores/videoTask')
                const videoTaskStore = useVideoTaskStore()
                const task = videoTaskStore.allActiveTasks.find(t => t.taskId === taskId) || 
                           videoTaskStore.completedTasks.find(t => t.taskId === taskId)
                if (task) {
                  taskPrompt = task.prompt
                  console.log(`从videoTaskStore获取到提示词:`, taskPrompt)
                }
              }
              
              this.addNotification({
                taskId,
                status: 'success',
                message: 'Video generation completed!',
                videoUrl: response.data.video_url,
                prompt: taskPrompt,
                origin: response.data.origin,
                timestamp: Date.now()
              })
              
              // 调用videoTask store完成任务
              const { useVideoTaskStore } = await import('~/stores/videoTask')
              const videoTaskStore = useVideoTaskStore()
              videoTaskStore.completeTask(taskId)
              
              // 触发任务完成事件，传递视频URL
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('taskCompleted', {
                  detail: {
                    taskId,
                    videoUrl: response.data.video_url,
                    prompt: response.data.prompt,
                    origin: response.data.origin
                  }
                }))
              }
              
              this.stopCheckingTask(taskId)
              return
            } else if (status == -1) {
              // 任务失败 - status为-1代表创建任务失败
              console.log(`任务 ${taskId} 创建失败`)
              
              // 尝试从videoTaskStore获取提示词
              let taskPrompt: string | undefined
              try {
                const { useVideoTaskStore } = await import('~/stores/videoTask')
                const videoTaskStore = useVideoTaskStore()
                const task = videoTaskStore.allActiveTasks.find(t => t.taskId === taskId) || 
                           videoTaskStore.completedTasks.find(t => t.taskId === taskId)
                if (task) {
                  taskPrompt = task.prompt
                  console.log(`失败通知从videoTaskStore获取到提示词:`, taskPrompt)
                }
              } catch (error) {
                console.error('获取提示词失败:', error)
              }
              
              this.addNotification({
                taskId,
                status: 'error',
                message: response.msg || 'Video generation failed',
                prompt: taskPrompt,
                timestamp: Date.now()
              })
              
              // 调用videoTask store移除失败任务
              const { useVideoTaskStore } = await import('~/stores/videoTask')
              const videoTaskStore = useVideoTaskStore()
              videoTaskStore.removeTask(taskId)
              
              this.stopCheckingTask(taskId)
              return
            }
          } else {
            // API返回错误
            console.error(`任务 ${taskId} API错误:`, response)
            
            // 尝试从videoTaskStore获取提示词
            let taskPrompt: string | undefined
            try {
              const { useVideoTaskStore } = await import('~/stores/videoTask')
              const videoTaskStore = useVideoTaskStore()
              const task = videoTaskStore.allActiveTasks.find(t => t.taskId === taskId) || 
                         videoTaskStore.completedTasks.find(t => t.taskId === taskId)
              if (task) {
                taskPrompt = task.prompt
                console.log(`错误通知从videoTaskStore获取到提示词:`, taskPrompt)
              }
            } catch (error) {
              console.error('获取提示词失败:', error)
            }
            
            this.addNotification({
              taskId,
              status: 'error',
              message: response.msg || 'Video generation failed',
              prompt: taskPrompt,
              timestamp: Date.now()
            })
            
            // 调用videoTask store移除失败任务
            const { useVideoTaskStore } = await import('~/stores/videoTask')
            const videoTaskStore = useVideoTaskStore()
            videoTaskStore.removeTask(taskId)
            
            this.stopCheckingTask(taskId)
            return
          }
        } catch (error) {
          console.error(`任务 ${taskId} 检查错误:`, error)
          
          // 尝试从videoTaskStore获取提示词
          let taskPrompt: string | undefined
          try {
            const { useVideoTaskStore } = await import('~/stores/videoTask')
            const videoTaskStore = useVideoTaskStore()
            const task = videoTaskStore.allActiveTasks.find(t => t.taskId === taskId) || 
                       videoTaskStore.completedTasks.find(t => t.taskId === taskId)
            if (task) {
              taskPrompt = task.prompt
              console.log(`网络错误通知从videoTaskStore获取到提示词:`, taskPrompt)
            }
          } catch (storeError) {
            console.error('获取提示词失败:', storeError)
          }
          
          this.addNotification({
            taskId,
            status: 'error',
            message: 'Failed to check task status',
            prompt: taskPrompt,
            timestamp: Date.now()
          })
          
          // 调用videoTask store移除失败任务
          const { useVideoTaskStore } = await import('~/stores/videoTask')
          const videoTaskStore = useVideoTaskStore()
          videoTaskStore.removeTask(taskId)
          
          this.stopCheckingTask(taskId)
          return
        }
      }, 5000) // 每几秒检查一次
      
      this.checkIntervals.set(taskId, interval)
      console.log(`为任务 ${taskId} 设置定时器，总定时器数:`, this.checkIntervals.size)
    },
    
    stopCheckingTask(taskId: string) {
      console.log(`停止检查任务 ${taskId}`)
      const interval = this.checkIntervals.get(taskId)
      if (interval) {
        console.log(`清除任务 ${taskId} 的定时器`)
        clearInterval(interval)
        this.checkIntervals.delete(taskId)
      } else {
        console.log(`未找到任务 ${taskId} 的定时器`)
      }
      this.checkingTasks.delete(taskId)
      console.log(`剩余检查任务数:`, this.checkingTasks.size)
      
      // 清除请求缓存
      localStorage.removeItem('formCache')
      
      // 如果所有任务都完成了，清除所有相关缓存
      if (this.checkingTasks.size === 0) {
        console.log('所有任务完成，清除缓存并触发事件')
        localStorage.removeItem('videoTask')
        localStorage.removeItem('videoTaskQueue')
        localStorage.removeItem('videoTaskCompleted')
        
        // 触发所有任务完成的事件
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('allTasksCompleted'))
        }
      }
    },
    
    addNotification(notification: Notification) {
      // 移除同任务ID的旧通知
      this.removeNotification(notification.taskId)
      
      // 只添加成功和错误通知
      if (notification.status === 'success' || notification.status === 'error') {
        console.log('添加通知:', notification)
        console.log('通知的prompt字段:', notification.prompt)
        
        this.notifications.push(notification)
        
        // 设置自动隐藏
        notification.autoHideTimer = window.setTimeout(() => {
          this.removeNotification(notification.taskId)
        }, 5000) // 5秒后自动隐藏
        
        // 限制通知数量，保留最新的10个
        if (this.notifications.length > 10) {
          const removedNotification = this.notifications.shift()
          if (removedNotification?.autoHideTimer) {
            clearTimeout(removedNotification.autoHideTimer)
          }
        }
      }
    },
    
    updateNotification(taskId: string, updates: Partial<Notification>) {
      const notification = this.notifications.find(n => n.taskId === taskId)
      if (notification) {
        // 清除旧的自动隐藏定时器
        if (notification.autoHideTimer) {
          clearTimeout(notification.autoHideTimer)
          notification.autoHideTimer = undefined
        }
        
        Object.assign(notification, updates)
        
        // 只对成功和错误状态设置自动隐藏
        if (updates.status && (updates.status === 'success' || updates.status === 'error')) {
          notification.autoHideTimer = window.setTimeout(() => {
            this.removeNotification(taskId)
          }, 5000) // 5秒后自动隐藏
        }
      }
    },
    
    removeNotification(taskId: string) {
      const notification = this.notifications.find(n => n.taskId === taskId)
      if (notification) {
        if (notification.autoHideTimer) {
          clearTimeout(notification.autoHideTimer)
        }
        this.notifications = this.notifications.filter(n => n.taskId !== taskId)
      }
    },

    // 暂停自动隐藏
    pauseAutoHide(taskId: string) {
      const notification = this.notifications.find(n => n.taskId === taskId)
      if (notification && notification.autoHideTimer) {
        clearTimeout(notification.autoHideTimer)
        notification.autoHideTimer = undefined
      }
    },

    // 恢复自动隐藏
    resumeAutoHide(taskId: string) {
      const notification = this.notifications.find(n => n.taskId === taskId)
      if (notification && !notification.autoHideTimer && (notification.status === 'success' || notification.status === 'error')) {
        notification.autoHideTimer = window.setTimeout(() => {
          this.removeNotification(taskId)
        }, 5000) // 5秒后自动隐藏
      }
    },
    
    // 清理旧通知（保留最近24小时的通知）
    cleanupOldNotifications() {
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
      this.notifications = this.notifications.filter(notification => {
        if (notification.timestamp < oneDayAgo) {
          if (notification.autoHideTimer) {
            clearTimeout(notification.autoHideTimer)
          }
          return false
        }
        return true
      })
    }
  }
}) 