<template>
  <div
    class="w-full max-w-[1200px] mx-auto bg-[#19171C] rounded-2xl overflow-hidden shadow-lg"
    style="
      box-shadow: 0 0 15px -3px rgb(0 0 0 / 0.15),
        0 4px 6px -4px rgb(0 0 0 / 0.15);
    "
  >
    <!-- Tab section -->
    <div class="flex w-fit ml-6 mt-6">
      <h2
        class="w-30 p-3 text-center font-medium text-[#ec2657] cursor-pointer transition-all relative text-base border-transparent hover:text-[#8B5CF6]"
      >
        Pencil Drawing Converter
      </h2>
    </div>

    <!-- Main content area -->
    <div class="flex flex-col lg:flex-row p-4 lg:p-6 gap-4 lg:gap-6" style="padding-top: 0px;">
      <!-- Left section - upload and style list -->
      <div class="w-full lg:w-1/2 flex flex-col gap-4">
        <!-- Upload area -->
        <div class="w-full border border-dashed border-gray-600 rounded-lg p-4 flex flex-col items-center justify-center h-[150px] bg-[#1E1C21] relative">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            accept="image/*"
            class="hidden"
          />
          
          <!-- Display uploaded image -->
          <div v-if="selectedImage" class="w-full h-full relative flex items-center justify-center">
            <img 
              :src="selectedImage.url" 
              alt="uploaded image" 
              class="max-w-full max-h-full object-contain rounded-lg"
            />
            <!-- Close button -->
            <button 
              @click.stop="clearUploadedImage"
              class="absolute top-1 right-1 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-1 text-white transition-all"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
          
          <!-- Upload button area -->
          <div v-else class="w-full h-full flex flex-col items-center justify-center">
            <button
              @click="triggerFileInput"
              :class="[
                'px-4 py-2 rounded-lg transition-all flex items-center gap-2',
                isAuthenticated 
                  ? 'bg-[#ec2657] text-white hover:bg-[#8B5CF6]' 
                  : 'bg-gray-600 text-gray-300 cursor-not-allowed'
              ]"
              :disabled="!isAuthenticated"
            >
              <ArrowUpTrayIcon class="w-5 h-5" />
              {{ isAuthenticated ? 'Upload Photos' : '请先登录' }}
            </button>
            <p class="text-gray-400 text-sm mt-2">
              {{ isAuthenticated 
                ? 'Upload photos, one-click convert to exquisite pencil drawings' 
                : '登录后即可上传图片并生成精美的铅笔画' 
              }}
            </p>
            <button 
              v-if="!isAuthenticated"
              @click="login"
              class="mt-2 px-3 py-1 bg-[#ec2657] text-white text-sm rounded hover:bg-[#8B5CF6] transition-all"
            >
              点击登录
            </button>
          </div>
        </div>

        <!-- Style list area -->
        <div class="w-full border border-gray-700 rounded-lg bg-[#1E1C21]" style="height: 280px; overflow-y: auto;">
          <div class="p-3">
            <h3 class="text-[#ec2657] font-medium mb-2">Select Pencil Drawing Style</h3>
            <div v-if="styleList.length === 0" class="flex items-center justify-center h-40">
              <div class="text-gray-400">loading...</div>
            </div>
            <div v-else class="grid grid-cols-4 gap-3">
              <div
                v-for="(style, index) in styleList"
                :key="index"
                :class="['aspect-[2/3] rounded-lg overflow-hidden cursor-pointer border-2 relative', 
                  selectedStyleIndex === index ? 'border-[#ec2657]' : 'border-transparent']"
                @click="selectStyle(index)"
              >
                <div class="relative w-full h-full">
                  <img
                    :src="style.Image"
                    :alt="style.Name"
                    class="w-full h-full object-cover"
                    @error="handleImageError(index)"
                    @load="handleImageLoad(index)"
                  />
                  <div v-if="!style.imageLoaded" class="absolute inset-0 flex items-center justify-center bg-[#1E1C21]">
                    <div class="animate-spin rounded-full h-6 w-6 border-2 border-[#ec2657] border-t-transparent"></div>
                  </div>
                </div>
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2 text-center">
                  {{ style.Name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right preview area -->
      <div class="w-full lg:w-1/2 flex flex-col gap-4">
        <div class="mx-auto border border-gray-700 rounded-xl overflow-hidden bg-[#1E1C21] flex items-center justify-center relative" style="width: 300px; height: 450px;">
          <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJkMmQyZCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
          
          <!-- Regular loading state (not for generation) -->
          <div v-if="isImageLoading" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec2657]"></div>
          </div>

          <!-- Display images -->
          <img
            v-if="generatedImage"
            :src="generatedImage"
            alt="Generation AI"
            class="w-full h-full object-contain relative z-10"
            @load="isImageLoading = false"
          />
          <img
            v-else-if="selectedImage"
            :src="selectedImage.url"
            alt="Uploaded Image"
            class="w-full h-full object-contain relative z-10"
            @load="isImageLoading = false"
          />
          <img
            v-else-if="selectedStyleIndex !== null && styleList[selectedStyleIndex]"
            :src="styleList[selectedStyleIndex].Image"
            alt="Style Preview"
            class="w-full h-full object-contain relative z-10"
            @load="isImageLoading = false"
          />
        </div>
      </div>
    </div>
    
    <!-- Action buttons -->
    <div class="flex justify-center gap-4 px-6 pb-6 mt-2">
      <!-- AI generation button -->
      <button
        @click="generateAIImage"
        class="py-2.5 px-6 rounded-xl bg-[#ec2657] text-white hover:bg-[#8B5CF6] transition-colors text-base flex items-center justify-center gap-2"
        :disabled="isLoading"
        :class="{'opacity-50 cursor-not-allowed': isLoading}"
      >
        <EyeIcon v-if="!isLoading" class="w-5 h-5" />
        <div v-else class="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
        {{ isLoading ? 'Processing...' : 'Generate' }}
      </button>
      
      <!-- Download button -->
      <button
        @click="downloadImage"
        class="py-2.5 px-6 rounded-xl bg-[#1E1C21] text-gray-300 hover:bg-[#2d2d2d] transition-colors text-base flex items-center justify-center gap-2"
        :disabled="!generatedImage"
        :class="{'opacity-50 cursor-not-allowed': !generatedImage}"
      >
        <ArrowDownTrayIcon class="w-5 h-5" />
        Download
      </button>
    </div>

    <!-- Image preview modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="showPreviewModal && selectedImage" 
          class="fixed inset-0 z-[999999] flex items-center justify-center bg-black bg-opacity-80 overflow-hidden transition-opacity duration-300"
          @click="showPreviewModal = false"
          style="position: fixed !important; z-index: 999999 !important;"
        >
          <div class="relative w-full h-full flex items-center justify-center">
            <!-- Close button -->
            <button
              class="absolute top-8 right-8 z-10 p-3 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
              @click="showPreviewModal = false"
            >
              <XMarkIcon class="w-6 h-6" />
            </button>
            
            <!-- Image container -->
            <div class="relative w-full h-full flex items-center justify-center overflow-hidden">
              <div class="w-full h-full flex items-center justify-center">
                <img
                  :src="selectedImage.url"
                  alt="Preview Image"
    
                  class="max-w-full max-h-full object-contain transition-transform duration-300"
                  :style="{ transform: `scale(${previewScale})` }"
                  @wheel.prevent="handleWheel"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
  <Toast
    v-if="toast.show"
    :title="toast.title"
    :message="toast.message"
    :type="toast.type"
    :duration="3000"
  />
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, watch, computed } from "vue";
import { useUserStore } from "~/stores/user";
import { useClerkAuth } from "~/utils/authHelper";
import { useNuxtApp } from 'nuxt/app';
// import { createTask, getStyleList, getTaskInfo } from '~/api'; // Import getTaskInfo - 暂时注释API导入
// Import icons used in the page
import { 
  ArrowDownTrayIcon, 
  ArrowUpTrayIcon,
  EyeIcon, 
  XMarkIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline';

// Use user info store and auth
const userStore = useUserStore();
const { isAuthenticated, login } = useClerkAuth();
const { $toast } = useNuxtApp() as any;

// 防抖标记
let isCheckingLogin = false

// 声明 checkLoginStatus 函数
const checkLoginStatus = async () => {
  // 防止频繁调用登录弹窗
  if (isCheckingLogin) {
    $toast.warning('Please complete the login process first')
    return false
  }
  
  // 每次都重新获取最新的用户信息
  await userStore.fetchUserInfo()
  
  // 检查用户是否已登录
  if (!userStore.userInfo) {
    $toast.info('Please log in to continue')
    isCheckingLogin = true
    
    const loginButton = document.getElementById('bindLogin')
    if (loginButton) {
      loginButton.click()
    }
    
    // 3秒后重置防抖标记
    setTimeout(() => {
      isCheckingLogin = false
    }, 3000)
    
    return false
  }
  
  return true
}

const fileInput = ref<HTMLInputElement | null>(null);
const isImageLoading = ref(false);
const isLoading = ref(false);
const statusMessage = ref('');
const generatedImage = ref<string | null>(null);
const currentRatio = ref<string>('2:3'); // Default ratio is 2:3

// Task response interface definition
interface TaskResponse {
  status: number;  // Changed from string to number
  status_msg?: string;  // Changed from message
  progress?: string;
  image_url?: string;  // Changed from imageUrl array
  task_id?: string;
}

// Uploaded image list
interface UploadedImage {
  url: string;  // URL for preview
  name: string;
  size: number;
  file?: File;  // Original file object
}

// Style list data structure - Modified to match API response format
interface StyleItem {
  Name: string;
  Image: string;
  Description: string;
  imageLoaded: boolean;
}

// Style list
const styleList = ref<StyleItem[]>([]);

const uploadedImages = ref<UploadedImage[]>([]);
const selectedImageIndex = ref<number | null>(null);
const selectedImage = ref<UploadedImage | null>(null);
const selectedStyleIndex = ref<number | null>(null);
const selectedStyle = ref<StyleItem | null>(null);

// Select image
const selectImage = (index: number) => {
  selectedImageIndex.value = index;
  selectedImage.value = uploadedImages.value[index];
  isImageLoading.value = true;
};

// Select style
const selectStyle = (index: number) => {
  selectedStyleIndex.value = index;
  selectedStyle.value = styleList.value[index];
  console.log(styleList.value[index]);
  // Show the selected style image in the preview area
  if (!generatedImage.value && styleList.value[index]) {
    // Only show the style preview image when there is no generated image
    isImageLoading.value = true;
    
    // Create image object for preloading
    const img = new Image();
    img.onload = () => {
      isImageLoading.value = false;
    };
    img.onerror = () => {
      isImageLoading.value = false;
    };
    img.src = styleList.value[index].Image;
  }
};

// Add image load status
const imageLoadStatus = ref<{[key: number]: boolean}>({});

// Handle image load error
const handleImageError = (index: number) => {
  console.error(`Image load failed: ${styleList.value[index].Image}`);
  imageLoadStatus.value[index] = false;
  showToast(`Image load failed: ${styleList.value[index].Name}`, "error");
};

// Handle image load success
const handleImageLoad = (index: number) => {
  console.log(`Image load success: ${styleList.value[index].Image}`);
  imageLoadStatus.value[index] = true;
};

// 添加模拟的样式列表数据
const mockStyles = [
  {
    Name: "素描风格1",
    Image: "https://picsum.photos/200/300?random=1",
    Description: "经典素描风格",
    imageLoaded: true
  },
  {
    Name: "素描风格2",
    Image: "https://picsum.photos/200/300?random=2",
    Description: "现代素描风格",
    imageLoaded: true
  },
  {
    Name: "素描风格3",
    Image: "https://picsum.photos/200/300?random=3",
    Description: "写实素描风格",
    imageLoaded: true
  },
  {
    Name: "素描风格4",
    Image: "https://picsum.photos/200/300?random=4",
    Description: "抽象素描风格",
    imageLoaded: true
  }
];

// 修改 fetchStyleList 函数为使用模拟数据
const fetchStyleList = async () => {
  try {
    // 使用模拟数据
    styleList.value = mockStyles;
    if (styleList.value.length > 0) {
      selectStyle(0);
    }
  } catch (error) {
    console.error('Get style list failed:', error);
    showToast("Get style list failed", "error");
  }
};

// Trigger file selection
const triggerFileInput = () => {
  // Check if user is logged in
  if (!isAuthenticated.value) {
    showToast("请先登录后再上传图片", "error");
    login(); // Trigger login modal
    return;
  }
  
  if (fileInput.value) {
    fileInput.value.click();
  }
};

// Clear uploaded image
const clearUploadedImage = () => {
  // Only clear the currently selected image, not other content
  selectedImageIndex.value = null;
  selectedImage.value = null;
  
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Fetch style list when component is mounted
onMounted(async () => {
  await fetchStyleList();
});

// Handle file selection
const handleFileChange = async (event: Event) => {
  // 只验证登录状态，不做任何额外操作
  await checkLoginStatus()
  
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    
    // Check file size (5MB = 5 * 1024 * 1024)
    if (file.size > 5 * 1024 * 1024) {
      showToast("File size cannot exceed 5MB", "error");
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      showToast("Only JPG, PNG, and GIF formats are supported", "error");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        // Add to image list - keep original file object
        uploadedImages.value.push({
          url: e.target.result,  // base64 for preview only
          name: file.name,
          size: file.size,
          file: file  // Save original file object
        });
        
        // Automatically select the newly uploaded image
        selectImage(uploadedImages.value.length - 1);
        
        // If no style is selected, default to the first style
        if (selectedStyleIndex.value === null && styleList.value.length > 0) {
          selectStyle(0);
        }
        
        // Clear file input so the same file can be selected again
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      }
    };
    reader.readAsDataURL(file);
  }
};

const toast = reactive({
  show: false,
  title: "",
  message: "",
  type: "info" as "success" | "error" | "info",
});

const showToast = (
  message: string,
  type: "success" | "error" | "info" = "info",
  title?: string
) => {
  // First close the previous toast
  toast.show = false;
  // Use nextTick to ensure the new toast is shown in the next DOM update cycle
  nextTick(() => {
    toast.show = true;
    toast.message = message;
    toast.type = type;
    toast.title = title || "";
  });
};


// Add preview modal state
const showPreviewModal = ref(false);
const previewScale = ref(1);

// Handle mouse wheel zoom
const handleWheel = (e: WheelEvent) => {
  const delta = e.deltaY;
  const scaleChange = delta > 0 ? 0.9 : 1.1;
  previewScale.value = Math.max(0.1, Math.min(5, previewScale.value * scaleChange));
};

// Watch modal display state, control page scroll
watch(showPreviewModal, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    previewScale.value = 1;
  }
});

// Process image
const processImage = () => {
  if (!selectedImage.value || !selectedStyle.value) {
    showToast("Please upload an image and select a style", "error");
    return;
  }
  
  // Add image processing logic here, such as API calls
  showToast("Processing image...", "info");
  
  // Simulate processing
  isImageLoading.value = true;
  setTimeout(() => {
    isImageLoading.value = false;
    showToast("Image processing complete", "success");
  }, 2000);
};

// Handle image aspect ratio determination
const getImageRatio = (width: number, height: number): string => {
  const ratio = width / height;
  
  // Determine which preset the ratio is closest to
  if (Math.abs(ratio - 3/2) < 0.2) {
    return '3:2';
  } else if (Math.abs(ratio - 2/3) < 0.2) {
    return '2:3';
  } else {
    return '1:1';
  }
};

// Get uploaded image dimensions
const getImageDimensions = (imageUrl: string): Promise<{width: number, height: number}> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

// Get preview image based on ratio
const getPreviewImageByRatio = (): string => {
  switch(currentRatio.value) {
    case '3:2':
      return '/img/32.jpg';
    case '1:1':
      return '/img/11.jpg';
    case '2:3':
    default:
      return '/img/23.jpg';
  }
};

// Update download image method
const downloadImage = async () => {
  if (!generatedImage.value) return;
  
  try {
    showToast("Downloading image...", "info");
    
    // Show downloading state
    const downloadButton = document.querySelector('button:last-child') as HTMLButtonElement;
    if (downloadButton) {
      const originalText = downloadButton.innerHTML;
      downloadButton.innerHTML = `<svg class="animate-spin w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full" viewBox="0 0 24 24"></svg> Downloading...`;
      
      setTimeout(() => {
        downloadButton.innerHTML = originalText;
      }, 2000);
    }
    
    // Get image from URL and convert to Blob, ensuring cross-origin images can be downloaded
    const response = await fetch(generatedImage.value);
    const blob = await response.blob();
    
    // Create temporary URL
    const blobUrl = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `AI_pencil_drawing_${Date.now()}.jpg`;
    link.style.display = 'none';
    
    // Add to DOM, trigger download, then remove
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl); // Release Blob URL
      showToast("Download complete!", "success");
    }, 1000);
  } catch (error) {
    console.error('Download failed:', error);
    showToast("Download failed, please try again", "error");
  }
};

// 添加计算属性来实时获取剩余次数
const remainingTimes = computed(() => {
  const userInfo = userStore.userInfo;
  if (!userInfo) return 0;
  return (userInfo.free_limit || 0) + (userInfo.remaining_limit || 0);
});

// 修改生成图片函数为使用模拟数据
const generateAIImage = async () => {
  // Check if user is logged in
  if (!isAuthenticated.value) {
    showToast("请先登录后再生成图片", "error");
    login(); // Trigger login modal
    return;
  }

  if (!selectedImage.value) {
    showToast("Please upload an image first", "error");
    return;
  }

  // 重置生成图片状态
  generatedImage.value = null;
  
  // 显示处理状态
  isLoading.value = true;

  try {
    showToast("AI image generation in progress...", "info");

    // Mockup: Use the uploaded image as the result after a delay
    setTimeout(() => {
      isLoading.value = false;
      generatedImage.value = selectedImage.value!.url;
      showToast("Image generated successfully!", "success");
    }, 2000);

  } catch (error) {
    showToast("Image generation failed", "error");
    isLoading.value = false;
  }
};

</script>

<style scoped>
/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #1E1C21;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #2d2d2d;
  border-radius: 3px;
  transition: all 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #3d3d3d;
}

/* Ensure left and right containers have the same height */
@media (min-width: 1024px) {
  .lg\:flex-row {
    min-height: 500px;
  }
}

/* Ensure image list area is scrollable */
.overflow-auto {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #2d2d2d #1E1C21;
}

.hover-theme:hover {
  background-color: #8B5CF6 !important;
}

/* Preview area background */
.w-full.h-full.border.border-gray-200.rounded-xl {
  background-color: #1E1C21;
}

/* Set main container background */
.w-full.max-w-\[900px\].mx-auto.bg-white.rounded-2xl {
  background-color: #19171C;
}
</style>