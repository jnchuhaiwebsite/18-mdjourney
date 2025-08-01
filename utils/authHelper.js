import { useUser, useClerk, useAuth as useClerkAuthImport } from '#imports'
import { ref, computed, watchEffect } from 'vue'
import { logoutCookie } from '~/api/index'
import { useUserStore } from '~/stores/user'

// 创建认证事件总线
const authEventBus = {
  events: {},
  
  // 注册事件监听器
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
    return () => this.off(event, callback) // 返回解绑函数
  },
  
  // 移除事件监听器
  off(event, callback) {
    if (!this.events[event]) return
    this.events[event] = this.events[event].filter(cb => cb !== callback)
  },
  
  // 触发事件
  emit(event, data) {
    if (!this.events[event]) return
    this.events[event].forEach(callback => callback(data))
  }
}

// 导出事件总线，以便其他组件可以监听认证事件
export const useAuthEvents = () => authEventBus

/**
 * Clerk认证工具函数
 * 提供认证状态管理和用户信息访问
 */
export function useClerkAuth() {
  // 获取Clerk API提供的基础数据
  const { user, isSignedIn, isLoaded } = useUser()
  const clerk = useClerk()  
  const { userId, sessionId, getToken } = useClerkAuthImport()

  // 认证状态 - 统一响应式管理
  const authState = ref({
    // Clerk状态
    isInitializing: true,
    isLoading: true,
    isLoaded: false,
    isLoadFailed: false,
    isLoadTimedOut: false,
    
    // 用户状态
    isLoggedIn: false,
    isCheckingAuth: true,
    
    // 状态文本
    clerkStatus: 'Waiting for initialization',
    loginStatus: 'unknown',
    authStatus: 'Checking login status...',
    
    // 错误信息
    error: null
  })

  // 计算属性 - 便于使用
  const isAuthenticated = computed(() => authState.value.isLoggedIn)
  
  // 防止退出登录重复调用
  let isHandlingSignOut = false
  
  // 用于区分是否是用户主动触发的操作
  let isUserInitiatedAction = false

  /**
   * 监听用户登录状态变化
   */
  function watchLoginStatus() {
    console.log('👁️ [authHelper] watchLoginStatus函数开始设置监听')
    watchEffect(() => {
      console.log('🔄 [authHelper] watchEffect触发，检查登录状态变化')
      console.log('🔍 [authHelper] isLoaded.value:', isLoaded.value, 'isSignedIn.value:', isSignedIn.value)
      if (isLoaded.value) {
        console.log('📋 [authHelper] Clerk已加载完成，开始处理登录状态')
        authState.value.isLoaded = true
        authState.value.isLoading = false
        authState.value.isInitializing = false
        
        if (isSignedIn.value) {
          // 如果之前未登录，现在登录了，视为有效的登录状态变化
          console.log('✅ [authHelper] watchLoginStatus检测到用户已登录')
          const wasLoggedIn = authState.value.isLoggedIn
          
          authState.value.isLoggedIn = true//已登录
          authState.value.loginStatus = 'Logged in'//登录状态文本
          authState.value.authStatus = `Logged in, user ID: ${userId.value}`//认证状态文本
          
          // 如果状态从未登录变为已登录，触发登录事件
          if (!wasLoggedIn) {
            authEventBus.emit('login', user.value)
          }
          
          // 重置退出处理标记
          isHandlingSignOut = false
        } else {
          // 用户已退出登录
          console.log('🔍 [authHelper] watchLoginStatus检测到用户已退出登录')
          const wasLoggedIn = authState.value.isLoggedIn
          console.log('🔍 [authHelper] wasLoggedIn:', wasLoggedIn)
          authState.value.isLoggedIn = false
          authState.value.loginStatus = 'Logged out'
          authState.value.authStatus = 'Logged out'
          
          // 如果状态从已登录变为未登录，触发登出事件
          if (wasLoggedIn) {
            console.log('🔥 [authHelper] 触发logout事件')
            authEventBus.emit('logout')
          } else {
            console.log('⚠️ [authHelper] 跳过logout事件，因为wasLoggedIn为false')
          }
        }
      } else {
        authState.value.isLoaded = false
        authState.value.isLoading = true
        authState.value.isInitializing = true
        authState.value.loginStatus = 'unknown'
        authState.value.authStatus = 'Checking login status...'
      }
    })
  }

  /**
   * 处理用户退出登录
   */
  function handleSignOut() {
    console.log('🎯 [authHelper] handleSignOut函数开始执行')
    // 清除本地用户信息
    const userStore = useUserStore()
    console.log('🗂️ [authHelper] 清除用户store信息')
    userStore.clearUserInfo()
    // 清除后端cookie
    console.log('🍪 [authHelper] 调用logoutCookie清除后端cookie')
    logoutCookie()
    // 触发登出事件
    console.log('📢 [authHelper] handleSignOut触发logout事件')
    authEventBus.emit('logout')
    console.log('✅ [authHelper] handleSignOut函数执行完成')
  }

  /**
   * 监听Clerk加载状态
   */
  function watchClerkStatus() {
    // 这里只是示例，实际可根据需要扩展
    // 例如监听加载超时、失败等
    let checkInterval = setInterval(() => {
      if (authState.value.isLoaded) {
        clearInterval(checkInterval)
      } else if (authState.value.isLoadTimedOut) {
        // 触发加载超时事件
        authEventBus.emit('error', { type: 'timeout', message: 'Clerk加载超时' })
        clearInterval(checkInterval)
      }
    }, 10000)
    
    // 使用try-catch捕获可能的错误
    try {
      // 其他可能的初始化代码
    } catch (error) {
      authState.value.isInitializing = false//Clerk初始化中
      authState.value.isLoading = false//Clerk正在加载中
      authState.value.isLoadFailed = true//Clerk加载失败
      authState.value.clerkStatus = 'Load failed'//Clerk状态文本
      authState.value.error = error//Clerk错误信息
      console.log('Clerk 状态: 加载失败', error)
      // 触发错误事件
      authEventBus.emit('error', { type: 'loadFailed', error })
      clearInterval(checkInterval)
    }
  }

  /**
   * 主动触发登录操作
   */
  function login() {
    // 标记为用户主动操作
    isUserInitiatedAction = true
    clerk.openSignIn()
  }

  /**
   * 主动触发退出登录操作
   */
  async function logout() {
    console.log('🚀 [authHelper] logout函数开始执行')
    document.cookie = `auth_token=; Path=/; max-age=0;`;
    document.cookie = `auth_token_expiry=; Path=/; max-age=0;`;
    console.log('🍪 [authHelper] logout函数中直接清除cookie成功')
    
    // 如果已经在处理退出流程，则不重复执行
    if (isHandlingSignOut) {
      console.log('⚠️ [authHelper] 已经在处理退出流程，跳过')
      return
    }
    
    try {
      console.log('🔄 [authHelper] 设置退出处理标记')
      // 设置标记，避免重复处理
      isHandlingSignOut = true
      console.log('🏃 [authHelper] 调用clerk.signOut()')
      await clerk.signOut()
      console.log('✅ [authHelper] clerk.signOut()执行完成')
      // 用户主动触发的退出
      console.log('🎯 [authHelper] 调用handleSignOut()')
      handleSignOut()
    } catch (error) {
      console.error('❌ [authHelper] 退出登录失败:', error)
      authState.value.error = error
      authEventBus.emit('error', { type: 'logoutFailed', error })
      // 退出失败，重置标记
      isHandlingSignOut = false
    }
  }

  /**
   * 初始化认证，自动监听状态变化
   */
  function initAuth() {
    console.log('🚀 [authHelper] initAuth函数开始执行，初始化认证系统')
    watchLoginStatus()//监听用户登录状态变化
    console.log('👁️ [authHelper] watchLoginStatus监听器已启动')
    watchClerkStatus()//监听Clerk加载状态
    console.log('📡 [authHelper] watchClerkStatus监听器已启动')
    console.log('✅ [authHelper] 认证系统初始化完成')
  }

  // 返回必要的状态和方法
  return {
    // 统一状态对象
    authState,//认证状态对象
    
    // 便捷访问计算属性
    isAuthenticated,//是否已认证
    
    // Clerk原始数据
    user,//用户信息
    isSignedIn,//是否已登录
    isLoaded,//是否已加载
    clerk,//Clerk实例
    userId,//用户ID
    sessionId,//会话ID
    getToken,//获取Token方法
    
    // 方法
    initAuth,//初始化认证
    handleSignOut,//处理用户退出登录
    login,//主动触发登录
    logout,//主动触发退出登录
    
    // 事件相关
    on: authEventBus.on.bind(authEventBus),//注册事件监听
    off: authEventBus.off.bind(authEventBus),//移除事件监听
    emit: authEventBus.emit.bind(authEventBus)//手动触发事件
  }
}

// 导出 useLocalAuth 供其他组件使用
export { useClerkAuth as useLocalAuth } 