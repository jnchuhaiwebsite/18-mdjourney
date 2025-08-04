<template>
  <div class="min-h-screen bg-blue-pale">
    <main class="w-full mx-auto p-6 bg-blue-pale rounded-lg max-w-7xl min-h-screen">
    <!-- 页面标题 -->
    <PageHero 
      title="Midjourney 7 Image Generator"
      subtitle="
Experience the future of digital art. Transform your text and images into stunning, high-quality visuals with our intuitive midjourney image generator, built to harness the full power of Midjourney V7"
    />

    <!-- 生成器区域 -->
    <section class="generator-container">
      <!-- 左侧设置区域 -->
      <div class="settings-section">
        <ParameterSettings 
          ref="parameterSettingsRef"
          v-model="parameters"
          @generate="handleGenerate"
          :available-modes="['text-to-image', 'image-to-image']"
          :default-mode="'text-to-image'"
        />
      </div>

      <!-- 右侧预览区域 -->
      <div class="preview-section">
        <GenerationPreview
          mode="image"
          :is-generating="isGenerating"
          :progress="progress"
          :generated-results="generatedResults"
          title="Image Generation Results"
          @download-media="downloadMedia"
        />
      </div>
    </section>
    <!-- <FreeCta /> -->
      </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useSeo } from '~/composables/useSeo'
import PageHero from '~/components/PageHero.vue'
import ParameterSettings from '~/components/ParameterSettings.vue'
import GenerationPreview from '~/components/GenerationPreview.vue'
import { upload, createTasks } from '~/api/index'
import { useNuxtApp } from 'nuxt/app'
import { useRouter } from 'vue-router'
import { downloadFileWithFetch, generateDownloadFilename, getFileExtension } from '~/utils/downloadHelper'
import { useVideoTaskStore } from '~/stores/videoTask'
import { useUserStore } from '~/stores/user'
import { useClerkAuth } from '~/utils/authHelper'
import { storeToRefs } from 'pinia'

import { useGeneration } from '~/composables/useGeneration';

// 使用默认的 SEO 配置
  useSeo(
    {
      title: 'Midjourney 7: AI Image Generator for Text & Image Conversion',
      description: 'Experience the future of digital art. Transform your text and images into stunning, high-quality visuals with our intuitive midjourney image generator, built to harness the full power of Midjourney V7'
    }
  )

const { generate } = useGeneration();
const videoTaskStore = useVideoTaskStore();
const userStore = useUserStore();
const { isSignedIn } = useClerkAuth();
const router = useRouter();
const { $toast } = useNuxtApp() as any;
const { currentTask, progress, generatedResults } = storeToRefs(videoTaskStore);

const isGenerating = computed(() => !!currentTask.value?.isGenerating);

// 用户状态管理
const userInfo = computed(() => userStore.userInfo);
const userCredits = computed(() => {
  const userInfo = userStore.userInfo
  if (!userInfo) return 0
  return (userInfo.free_limit || 0) + (userInfo.remaining_limit || 0)
});

// 登录状态检查 - 与ParameterSettings保持一致
const checkLoginStatus = async () => {
  // 每次都重新获取最新的用户信息
  await userStore.fetchUserInfo()
  
  // 检查用户是否已登录
  if (!userStore.userInfo) {
    const loginButton = document.getElementById('bindLogin')
    if (loginButton) {
      loginButton.click()
    }
    return false
  }
  return true
}

// 统一的登录和积分检查方法
const withLoginAndCreditCheck = async (callback: () => void | Promise<void>, requiredCredits: number = 1) => {
  // 检查Clerk登录状态
  if (!isSignedIn.value) {
    $toast.error('Please log in to continue');
    return;
  }

  // 检查用户信息和积分
  await userStore.fetchUserInfo();
  if (!userStore.userInfo) {
    $toast.error('Unable to get user information, please try again');
    return;
  }

  // 检查积分是否足够
  if (userCredits.value < requiredCredits) {
    $toast.error(`Insufficient credits. This operation requires ${requiredCredits} credits, but you only have ${userCredits.value} credits`);
    router.push('/pricing');
    return;
  }

  await callback();
}

// 简化的登录检查方法（不检查积分）
const withLoginCheck = async (callback: () => void | Promise<void>) => {
  if (!isSignedIn.value) {
    $toast.error('Please log in to continue');
    return;
  }
  await callback();
}

// 参数状态
const parameters = ref({
  mode: 'text-to-image',
  aspectRatio: '16:9',
  speed: 'fast',
  stylization: 250,
  weirdness: 0
})
const uploadedImages = ref<string[]>([]);

// 处理生成事件
const handleGenerate = async (params: any) => {
  console.log('ai-image-generator handleGenerate 被调用，参数:', params);
  
  // 注意：由于ParameterSettings已经有完整的登录和积分检查，这里作为双重保险
  // 实际的检查主要在ParameterSettings.vue的handleGenerate中进行
  await withLoginCheck(async () => {
    try {
      await generate(params);
      console.log('ai-image-generator generate 调用完成');
    } catch (error) {
      console.error('ai-image-generator generate 调用失败:', error);
      $toast.error(error instanceof Error ? error.message : 'Generation failed, please try again');
    }
  });
}

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
  // 默认返回图片类型
  return 'image';
}

// 简化的监听逻辑 - 只在任务被清空时清空结果
// watch(currentTask, (newTask, oldTask) => {
//   if (!newTask && oldTask) {
//     console.log('ai-image-generator 任务被清空，清空结果');
//     videoTaskStore.clearResults();
//   }
// }, { deep: true });

// 下载媒体文件
const downloadMedia = async (result: any) => {
  await withLoginCheck(async () => {
    try {
      const extension = getFileExtension(result.url)
      const filename = generateDownloadFilename(result.name, extension)
      
      console.log('Starting download:', result.name, 'filename:', filename)
      
      await downloadFileWithFetch(result.url, filename)
      
      console.log('Download successful:', filename)
      $toast.success('Download successful');
    } catch (error) {
      console.error('Download failed:', error)
      $toast.error('Download failed, please try again');
    }
  });
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

// 处理图片上传
const handleImageUpload = async (files: FileList) => {
  // 使用登录检查包装上传逻辑
  await withLoginCheck(async () => {
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
      $toast.success('Image upload successful');
    } catch (error) {
      console.error('Image upload failed:', error)
      $toast.error(error instanceof Error ? error.message : 'Image upload failed')
    }
  });
}

// 组件挂载时初始化
onMounted(() => {
  // 获取用户信息
  userStore.fetchUserInfo()
})

// 包装的提示词输入处理（为子组件提供）
const handlePromptInput = async () => {
  await withLoginCheck(() => {
    // 提示词输入逻辑可以在这里添加
    // 目前只做登录检查
    console.log('Prompt input - login check passed');
  });
}

// 包装的参数设置处理（为子组件提供）
const handleParameterChange = async (callback: () => void) => {
  await withLoginCheck(callback);
}

// 暴露方法给子组件
defineExpose({
  handleImageUpload,
  handlePromptInput,
  handleParameterChange,
  withLoginCheck,
  withLoginAndCreditCheck,
  checkLoginStatus,
  userCredits: userCredits.value,
  isSignedIn: isSignedIn.value
})
</script>

<style scoped>
.generator-container {
  @apply flex gap-8;
}

/* 左侧设置区域 */
.settings-section {
  @apply w-96 flex-shrink-0 flex flex-col;
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
    @apply gap-4;
  }
}
</style> 