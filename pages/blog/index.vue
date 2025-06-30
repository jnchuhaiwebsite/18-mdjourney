<template>
  <div class="min-h-screen bg-blue-pale pb-10">
    <!-- Page title -->
    <div class="pt-32 pb-12 text-center">
      <h1 class="text-3xl md:text-4xl font-bold mb-2 text-[#ffb347]">veo3 Blog</h1>
      <p class="text-gray-400">Tips, tutorials, and inspiration for creating professional-quality videos with AI image animator technology</p>
    </div>
    
    <div class="flex flex-col md:flex-row gap-4 md:gap-8 mb-16 mx-auto w-11/12 max-w-7xl">
      <!-- Categories on the left -->
      <div class="w-full md:w-64">
        <div class="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          <div 
            class="px-3 md:px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap text-sm md:text-base"
            :class="currentCategory === 'all' ? 'bg-[#ffb347] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
            @click="handleCategoryChange('all')"
          >
            All
          </div>
          <div 
            v-for="category in allCategories" 
            :key="category.id"
            class="px-3 md:px-4 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer text-sm md:text-base"
            :class="currentCategory === category.id.toString() ? 'bg-[#ffb347] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
            @click="handleCategoryChange(category.id.toString())"
          >
            {{ category.name }}
          </div>
        </div>
      </div>

      <!-- Blog list on the right -->
      <div class="flex-1">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffb347]"></div>
        </div>

        <!-- Blog posts and empty state - only show when data is loaded -->
        <div v-else>
          <div class="space-y-4 md:space-y-6">
            <div 
              v-for="post in blogData?.blogList || []" 
              :key="post.id"
              class="block bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all border border-gray-700 hover:border-[#ffb347] hover:translate-y-[-2px] cursor-pointer"
              @click="navigateToBlog(post)"
            >
              <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-4 mb-3 md:mb-4">
                <div class="flex-1 min-w-0">
                  <h2 class="text-lg md:text-xl font-bold mb-1 md:mb-2 text-gray-200 truncate">{{ post.title }}</h2>
                  <p class="text-sm md:text-base text-gray-400 line-clamp-2">{{ post.abstract }}</p>
                </div>
                <span class="px-2 md:px-3 py-1 bg-[#ffb347] text-white text-xs md:text-sm rounded-full whitespace-nowrap inline-block w-fit">
                  {{ getCategoryLabel(post.class_id) }}
                </span>
              </div>
              <div class="text-gray-500 text-xs md:text-sm">
                {{ formatDate(post.created_time) }}
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="(blogData?.blogList || []).length === 0" class="text-center py-20">
            <h2 class="text-2xl font-bold text-white mb-4">No Blog Posts Found</h2>
            <p class="text-gray-400">No blog posts found in the current category.</p>
          </div>

          <!-- Pagination -->
          <div v-if="(blogData?.blogList || []).length > 0" class="mt-8 flex justify-end">
            <div class="flex items-center space-x-2">
              <!-- Previous page button -->
              <button 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :class="currentPage <= 1 ? 'bg-gray-700 text-gray-500' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <!-- Page numbers -->
              <div class="flex items-center space-x-1">
                <template v-for="page in visiblePages" :key="page">
                  <button 
                    v-if="page !== '...'"
                    @click="goToPage(page)"
                    class="px-3 py-2 rounded-lg transition-colors text-sm"
                    :class="page === currentPage ? 'bg-[#ffb347] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="px-2 text-gray-500">...</span>
                </template>
              </div>

              <!-- Next page button -->
              <button 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= computedTotalPages"
                class="px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :class="currentPage >= computedTotalPages ? 'bg-gray-700 text-gray-500' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Page info -->
          <div v-if="(blogData?.blogList || []).length > 0" class="mt-4 text-right text-sm text-gray-400">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, blogData?.total || 0) }} of {{ blogData?.total || 0 }} posts
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, type Ref, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useSeo } from '~/composables/useSeo'
import { getBlogCategoryList, getBlogList } from '~/api'

// 声明 Nuxt 3 内置函数类型
declare const useAsyncData: <T>(key: string, handler: () => Promise<T>) => Promise<{
  data: Ref<T | null>;
  error: Ref<any>;
  pending: Ref<boolean>;
  refresh: () => Promise<void>;
}>;

const router = useRouter()

useSeo({
  title: "veo3 Blog: AI Image Animator Tips & Updates",
  description: "Discover the latest updates on veo3, a top - tier AI image animator. Leverage advanced AI tech for stunning animations and get expert tips for better results.",
  ogTitle: "veo3 Blog: AI Image Animator Tips & Updates",
  ogDescription: "Stay updated on veo3, the leading AI - powered image animator. Uncover new features, tips, and how it revolutionizes video generation with advanced technology.",
  twitterTitle: "veo3 Blog: AI Image Animator Tips & Updates",
  twitterDescription: "Get the latest on veo3, an advanced AI image animator. Explore new features, expert tips, and stay ahead in AI - driven video creation."
});

// 使用 useAsyncData 获取数据
const { data: initialData, refresh } = await useAsyncData(
  'blog-list',
  async () => {
    try {
      const [categoryResponse, listResponse] = await Promise.all([
        getBlogCategoryList(),
        getBlogList({
          page: 1,
          page_size: 10
        })
      ]);

      return {
        categoryList: categoryResponse.code === 200 ? categoryResponse.data : [],
        blogList: listResponse.code === 200 ? listResponse.data.list : [],
        total: listResponse.code === 200 ? listResponse.data.total : 0
      };
    } catch (err) {
      console.error('Failed to fetch initial blog data:', err);
      return {
        categoryList: [],
        blogList: [],
        total: 0
      };
    }
  },
  {
    server: true,
    lazy: false,
    // 设置缓存时间为1小时
    default: () => ({
      categoryList: [],
      blogList: [],
      total: 0
    }),
  }
);

// 响应式变量
const currentCategory = ref('all')
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const blogData = ref(initialData.value)

// 获取博客数据的函数
const fetchBlogData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // 构建API参数，支持分类筛选
    const apiParams: any = {
      page: currentPage.value,
      page_size: pageSize.value
    }
    
    // 如果选择了特定分类，添加分类参数
    if (currentCategory.value !== 'all') {
      apiParams.class_id = currentCategory.value
    }
    
    // 获取博客列表
    const getList = await getBlogList(apiParams) as any;
    if (getList.code === 200) {
      blogData.value = {
        ...blogData.value,
        blogList: getList.data.list || [],
        total: getList.data.total || 0
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load blog data'
    console.error('获取博客数据失败:', err)
  } finally {
    loading.value = false
  }
}

// 监听分页和分类变化，重新获取数据
watch([currentPage, currentCategory], async () => {
  if (process.client) {
    await fetchBlogData()
  }
})

// 计算属性
const allCategories = computed(() => {
  if (!blogData.value?.categoryList) return []
  return blogData.value.categoryList
})

// 计算总页数
const computedTotalPages = computed(() => {
  if (!blogData.value?.total) return 0
  return Math.ceil(blogData.value.total / pageSize.value)
})

// 计算可见的页码
const visiblePages = computed(() => {
  const pages: (number | string)[] = []
  const maxVisible = 5
  const current = currentPage.value
  const total = computedTotalPages.value

  if (total <= maxVisible) {
    // 如果总页数小于等于最大可见页数，显示所有页码
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 否则显示部分页码
    if (current <= 3) {
      // 当前页在前3页
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      // 当前页在后3页
      pages.push(1)
      pages.push('...')
      for (let i = total - 3; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})

// 获取分类标签显示文本
const getCategoryLabel = (classId: number) => {
  if (!blogData.value?.categoryList) return 'Uncategorized'
  
  const category = blogData.value.categoryList.find((cat: any) => cat.id === classId)
  return category ? category.name : 'Uncategorized'
}

// 格式化日期
const formatDate = (timestamp: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 处理分类变化
const handleCategoryChange = (categoryId: string) => {
  currentCategory.value = categoryId
  currentPage.value = 1 // 重置到第一页
}

// 跳转到指定页面
const goToPage = (page: number | string) => {
  const pageNum = typeof page === 'string' ? parseInt(page) : page
  if (pageNum >= 1 && pageNum <= computedTotalPages.value) {
    currentPage.value = pageNum
  }
}

// Navigate to blog detail page
const navigateToBlog = (post: any) => {
  const url = post.url.split('/')
  router.push(`/blog/${url[url.length - 1]}`)
}

// Set canonical URL when mounted
onMounted(() => {
  
  // Add structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "veo3 Blog",
    description: "Expert tutorials and insights on AI image animator technology",
    url: "https://www.veo3.com/blog",
    publisher: {
      "@type": "Organization",
      name: "veo3",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png"
      }
    }
  };

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
});
</script>

<style>

</style>