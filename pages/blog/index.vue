<template>
  <main class="w-full mx-auto p-6 bg-blue-pale rounded-lg max-w-24xl min-h-screen">
    <!-- Hero Section -->
    <section 
      id="blog-hero"
      class="relative"
    >
      <PageHero 
        title="Midjourney Video Generator Blog"
        subtitle="Tips, tutorials, and inspiration for creating professional-quality videos with Midjourney Video Generator AI video generation technology"
      />
    </section>
    
    <!-- Categories filter - moved to top center -->
    <div class="mx-auto w-11/12 max-w-4xl mb-8">
      <div class="flex flex-wrap justify-center gap-2 md:gap-3">
        <div 
          v-for="category in allCategories" 
          :key="category.id"
          class="px-4 py-2 rounded-lg transition-all cursor-pointer text-sm md:text-base font-medium"
          :class="currentCategory === category.id.toString() ? 'bg-blue-dark text-white shadow-md' : 'bg-white text-blue-navtext hover:bg-blue-light hover:text-blue-dark border border-blue-pricingborder'"
          @click="handleCategoryChange(category.id.toString())"
        >
          {{ category.name }}
        </div>
      </div>
    </div>
    
    <!-- Blog list - centered -->
    <div class="mx-auto w-11/12 max-w-4xl">
      <div class="mb-16">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-dark"></div>
        </div>

        <!-- Blog posts and empty state - only show when data is loaded -->
        <div v-else>
          <div class="space-y-4 md:space-y-6">
            <div 
              v-for="post in blogData?.blogList || []" 
              :key="post.id"
              class="block bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all border border-blue-pricingborder hover:border-blue-dark hover:translate-y-[-2px] cursor-pointer group"
              @click="navigateToBlog(post)"
            >
              <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-2 md:gap-4 mb-3 md:mb-4">
                <div class="flex-1 min-w-0">
                  <h2 class="text-lg md:text-xl font-bold mb-1 md:mb-2 text-blue-h1 group-hover:text-blue-dark transition-colors truncate">{{ post.title }}</h2>
                  <p class="text-sm md:text-base text-blue-navtext line-clamp-2">{{ post.abstract }}</p>
                </div>
                <span class="px-3 py-1 bg-blue-dark text-white text-xs md:text-sm rounded-full whitespace-nowrap inline-block w-fit font-medium">
                  {{ getCategoryLabel(post.class_id) }}
                </span>
              </div>
              <div class="text-blue-footertext text-xs md:text-sm">
                {{ formatDate(post.created_time) }}
              </div>
            </div>
          </div>
          
          <!-- Empty state -->
          <div v-if="(blogData?.blogList || []).length === 0" class="text-center py-20">
            <h2 class="text-2xl font-bold text-blue-h1 mb-4">No Blog Posts Found</h2>
            <p class="text-blue-navtext">No blog posts found in the current category.</p>
          </div>

          <!-- Pagination - only show when total > 20 -->
          <div v-if="(blogData?.blogList || []).length > 0 && (blogData?.total || 0) > 20" class="mt-8 flex justify-center">
            <div class="flex items-center space-x-2">
              <!-- Previous page button -->
              <button 
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                class="px-3 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="currentPage <= 1 ? 'bg-blue-light text-blue-footertext' : 'bg-white border border-blue-pricingborder text-blue-navtext hover:bg-blue-light hover:border-blue-dark'"
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
                    class="px-3 py-2 rounded-lg transition-all text-sm font-medium"
                    :class="page === currentPage ? 'bg-blue-dark text-white shadow-md' : 'bg-white border border-blue-pricingborder text-blue-navtext hover:bg-blue-light hover:border-blue-dark'"
                  >
                    {{ page }}
                  </button>
                  <span v-else class="px-2 text-blue-footertext">...</span>
                </template>
              </div>

              <!-- Next page button -->
              <button 
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= computedTotalPages"
                class="px-3 py-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                :class="currentPage >= computedTotalPages ? 'bg-blue-light text-blue-footertext' : 'bg-white border border-blue-pricingborder text-blue-navtext hover:bg-blue-light hover:border-blue-dark'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Page info - only show when total > 20 -->
          <div v-if="(blogData?.blogList || []).length > 0 && (blogData?.total || 0) > 20" class="mt-4 text-center text-sm text-blue-footertext">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, blogData?.total || 0) }} of {{ blogData?.total || 0 }} posts
          </div>
        </div>
      </div>
    </div>
  </main>
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
    title: "Blog | Midjourney model  Image & Video Generation",
    description: "Discover Midjourney model's AI technology for creating professional videos and animations. Get tips and updates to enhance your visual content.",
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
          page_size: 20
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
  }
);

// 响应式变量
const currentCategory = ref('')
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const blogData = ref(initialData.value)

// 获取博客数据的函数
const fetchBlogData = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Build API parameters, supporting category filtering
    const apiParams: any = {
      page: currentPage.value,
      page_size: pageSize.value
    }
    
    // Add category parameter
    if (currentCategory.value) {
      apiParams.class_id = currentCategory.value
    }
    
    // Get blog list
    const getList = await getBlogList(apiParams) as any;
    if (getList.code === 200) {
      const newBlogData = {
        categoryList: blogData.value?.categoryList || [],
        blogList: getList.data.list || [],
        total: getList.data.total || 0
      }
      blogData.value = newBlogData
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
  // Set default category to first available category
  if (allCategories.value.length > 0 && !currentCategory.value) {
    currentCategory.value = allCategories.value[0].id.toString()
  }
  
  // Add structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
          name: "Midjourney Video Generator Blog",
    description: "Professional AI image generation and animation technology tutorials and insights",
    url: "https://www.midjourneyai.net/blog",
    publisher: {
      "@type": "Organization",
      name: "Midjourney Video Generator",
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