import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import { getCurrentUser } from '~/api/index'

// 标记是否有正在进行的请求
let pendingFetch: Promise<any> | null = null
// 标记是否正在处理401错误
let isHandling401 = false

// 检查是否有有效的token
const isLoggedIn = (): boolean => {
  // 如果是服务器端，则认为未登录
  if (typeof window === 'undefined') return false
  
  // 检查cookie中是否有auth_token
  const cookieStr = document.cookie
  return cookieStr.includes('auth_token=')
}
// 用户信息
export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<any>(null)
  // 加载状态
  const isLoading = ref(false)
  // 错误信息
  const error = ref<string | null>(null)
  // 是否已经获取过用户信息
  const hasFetched = ref(false)

  // 获取用户信息
  const fetchUserInfo = async (force = false) => {
    // 检查是否已登录，未登录则不发送请求
    if (!isLoggedIn()) {
      return null
    }
    
    // 如果有正在进行的请求，复用该请求
    if (pendingFetch) {
      return pendingFetch
    }
    
    // 如果已经在加载中，防止重复请求
    if (isLoading.value) {
      // 等待当前请求完成
      return new Promise((resolve) => {
        const checkResult = setInterval(() => {
          if (!isLoading.value) {
            clearInterval(checkResult)
            resolve(userInfo.value)
          }
        }, 100)
      })
    }
    
    try {
      isLoading.value = true
      error.value = null
      
      // 创建请求并保存引用
      pendingFetch = (async () => {
        try {
          const response = await getCurrentUser() as { data: any, code: number, msg: string }
          
          // 根据API响应处理
          if (response && response.code === 200 && response.data) {
            userInfo.value = response.data
            hasFetched.value = true
            return response.data
          } else {
            // 记录错误信息
            error.value = response?.msg || '获取用户信息失败'
            return null
          }
        } catch (err: any) {
          // 如果错误请求并且有缓存，则清除缓存
          if (!isHandling401 && document.cookie.includes('auth_token=')) {
            // 检查是否已经处理过401错误
            if (localStorage.getItem('hasHandled401') == 'true') {
              localStorage.removeItem('hasHandled401')
              return
            }
            
            // 处理401错误
            isHandling401 = true
            // 清除cookie中的token
            document.cookie = 'auth_token=; expires=; path=/;'
            // 清除用户信息
            clearUserInfo()
            
            // 设置标记，表示已经处理过401错误
            localStorage.setItem('hasHandled401', 'true')
            
            window.location.reload()
            isHandling401 = false
          }
          // 记录错误信息
          error.value = err.msg || '获取用户信息失败'
          return null
        } finally {
          isLoading.value = false
          // 短暂延迟清除引用，防止极短时间内的重复请求
          setTimeout(() => {
            pendingFetch = null
          }, 300)
        }
      })()
      
      return pendingFetch
    } catch (err: any) {
      isLoading.value = false
      console.log('err',err)
      error.value = err.msg || '获取用户信息失败'
      return null
    }
  }

  // 清除用户信息
  const clearUserInfo = () => {
    console.log('🗂️ [userStore] clearUserInfo函数开始执行')
    userInfo.value = null
    error.value = null
    hasFetched.value = false
    pendingFetch = null
    console.log('✅ [userStore] clearUserInfo函数执行完成')
  }

  // 监听 cookie 变化
  const checkLoginStatus = () => {
    if (!isLoggedIn()) {
      clearUserInfo()
    }
  }

  // 在组件挂载时添加监听
  onMounted(() => {
    document.addEventListener('cookiechange', checkLoginStatus)
  })

  const fetchUserInfoWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await fetchUserInfo()
        if (result) return result
      } catch (err) {
        if (i === retries - 1) throw err
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  return {
    userInfo,
    isLoading,
    error,
    fetchUserInfo,
    clearUserInfo,
    fetchUserInfoWithRetry
  }
}) 