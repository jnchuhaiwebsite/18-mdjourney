<template>
  <div class="min-h-screen bg-blue-pale">
    <div class="pt-32 py-10 mx-auto w-11/12 max-w-4xl">
      <button
        @click="handleBack"
        class="inline-flex items-center text-blue-navtext hover:text-blue-dark transition-colors mb-8 group font-medium"
      >
        <div class="w-3 h-3 border-l-2 border-b-2 border-blue-navtext group-hover:border-blue-dark transform rotate-45 mr-2 transition-colors"></div>
        Back to Blog
      </button>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-dark"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-20">
        <h2 class="text-2xl font-bold text-blue-h1 mb-4">Loading Failed</h2>
        <p class="text-blue-navtext mb-8">{{ error }}</p>
        <button 
          @click="loadBlogData"
          class="inline-flex items-center px-8 py-4 bg-blue-button hover:bg-blue-buttonhover text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200"
        >
          Retry
        </button>
      </div>

      <!-- Blog content -->
      <article v-else-if="post" class="prose prose-lg max-w-none bg-white p-6 md:p-8 rounded-xl shadow-lg border border-blue-pricingborder">
        <h1 class="text-3xl md:text-4xl font-bold mb-6 text-blue-h1 border-l-4 border-blue-dark pl-4">{{ post.title }}</h1>
        
        <div class="flex items-center gap-4 mb-8">
          <span class="px-3 py-1 bg-blue-dark text-white text-sm rounded-full font-medium">
            {{ getCategoryLabel(post.class_id) }}
          </span>
          <span class="text-blue-footertext text-sm">{{ formatDate(post.created_time) }}</span>
        </div>

        <!-- Rich text content -->
        <div class="text-blue-navtext space-y-6 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-blue-h1 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-blue-h1 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-blue-h1 [&>p]:text-blue-navtext [&>p]:leading-relaxed [&>a]:text-blue-dark [&>a]:hover:text-blue-medium [&>strong]:text-blue-h1 [&>code]:text-blue-h1 [&>code]:bg-blue-light [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>blockquote]:border-l-4 [&>blockquote]:border-blue-dark [&>blockquote]:pl-4 [&>blockquote]:text-blue-navtext [&>blockquote]:bg-blue-light [&>blockquote]:py-2 [&>hr]:border-blue-pricingborder [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:marker:text-blue-footertext [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:marker:text-blue-footertext [&>img]:max-w-full [&>img]:h-auto [&>img]:rounded-lg [&>img]:shadow-md [&>img]:my-4 [&>img]:mx-auto [&>img]:block [&>img]:border [&>img]:border-gray-200 [&>img]:hover:shadow-lg [&>img]:transition-shadow [&>img]:duration-300" v-html="processedContent"></div>

        <!-- Related articles section -->
        <div class="mt-12 pt-8 border-t border-blue-pricingborder" v-if="relatedPosts.length > 0">
          <h3 class="text-xl font-bold text-blue-h1 mb-6">Related Articles</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <NuxtLink 
              v-for="relatedPost in relatedPosts" 
              :key="relatedPost.id"
              :to="`/blog/${relatedPost.url}`"
              class="p-4 border border-blue-pricingborder rounded-lg hover:bg-blue-light hover:border-blue-dark transition-all group"
            >
              <h2 class="font-medium mb-2 text-lg text-blue-h1 group-hover:text-blue-dark transition-colors">{{ relatedPost.title }}</h2>
              <p class="text-sm text-blue-navtext line-clamp-2">{{ relatedPost.abstract }}</p>
            </NuxtLink>
          </div>
        </div>

        <!-- Action button -->
        <div class="text-center mt-12">
          <button
            @click="handleBackHome"
            class="inline-flex items-center px-8 py-4 bg-blue-button hover:bg-blue-buttonhover text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200"
          >
            <span class="mr-2">🏠</span>
            Back to home
          </button>
        </div>
      </article>
      
      <!-- Not found state -->
      <div v-else-if="!post && !isNavigating" class="text-center py-20">
        <h2 class="text-2xl font-bold text-blue-h1 mb-4">Blog Post Not Found</h2>
        <p class="text-blue-navtext mb-8">The blog post you are looking for does not exist or has been deleted.</p>
        <NuxtLink 
          to="/blog" 
          class="inline-flex items-center px-8 py-4 bg-blue-button hover:bg-blue-buttonhover text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200"
        >
          Back to Blog List
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, type Ref, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSeo } from '~/composables/useSeo';
import { getBlogCategoryList, getBlogList, type BlogCategory, type BlogPost } from '~/api';

// 定义类型
interface BlogData {
  categoryList: BlogCategory[];
  blogList: BlogPost[];
}

interface SeoOptions {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  type?: string;
  other?: Array<{ property: string; content: string }>;
}

// 声明 Nuxt 3 内置函数类型
declare const useAsyncData: <T>(
  key: string, 
  handler: () => Promise<T>,
  options?: {
    server?: boolean;
    lazy?: boolean;
    default?: () => T;
  }
) => Promise<{
  data: Ref<T | null>;
  error: Ref<any>;
  pending: Ref<boolean>;
  refresh: () => Promise<void>;
}>;

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const error = ref<string | null>(null);
const isNavigating = ref(false);
const isUnmounted = ref(false);

// 使用 useAsyncData 获取数据
const { data: blogData, refresh: refreshBlogData } = await useAsyncData<BlogData>(
  `blog-detail-${route.params.id}`,
  async () => {
    if (isUnmounted.value) return { categoryList: [], blogList: [] };
    try {
      const [categoryResponse, listResponse] = await Promise.all([
        getBlogCategoryList(),
        getBlogList({ page: 1, page_size: 100 })
      ]);

      return {
        categoryList: categoryResponse.code === 200 ? categoryResponse.data : [],
        blogList: listResponse.code === 200 ? listResponse.data.list : []
      };
    } catch (err) {
      console.error('Failed to fetch blog data:', err);
      return {
        categoryList: [],
        blogList: []
      };
    }
  },
  {
    server: true,
    lazy: false,
    // 设置缓存时间为1小时
    default: () => ({
      categoryList: [],
      blogList: []
    }),
  }
);

// Get blog post content
const post = computed(() => {
  //如果有携带post参数，则直接返回
  if(route.query.post){
    const options_post = JSON.parse(route.query.post as any);
    //深克隆下
    let data = JSON.parse(JSON.stringify(options_post));
    //js清空参数
    if (process.client) {
      history.replaceState({}, '', window.location.pathname);
    }
    return data;
  }

  // 截取路径最后的id
  const postId = route.params.id as string;
  if(!postId || !blogData.value?.blogList) {
    return null;
  }
  try {
    const foundPost = blogData.value.blogList.find((p: any) => p.url.includes(postId));
    if (!foundPost) {
      return null;
    }
    return foundPost;
  } catch (error) {
    console.error('Error finding post:', error);
    return null;
  }
});

// 处理Markdown内容为HTML
const processedContent = computed(() => {
  if (!post.value?.content) return '';
  
  // 确保content是字符串类型
  let content = String(post.value.content);
  
  // 处理标题
  content = content.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  content = content.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  content = content.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // 处理粗体和斜体
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 处理图片
  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg shadow-md my-4 mx-auto" loading="lazy">');
  
  // 处理链接
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // 处理代码块
  content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // 处理分割线
  content = content.replace(/^---$/gim, '<hr>');
  
  // 处理列表
  content = content.replace(/^- \[([^\]]*)\] (.*$)/gim, '<li><input type="checkbox" $1> $2</li>');
  content = content.replace(/^- (.*$)/gim, '<li>$1</li>');
  
  // 改进的换行符处理
  // 1. 先处理连续的换行符为临时标记
  content = content.replace(/\n\n+/g, '###PARAGRAPH###');
  // 2. 处理单个换行符为 <br>
  content = content.replace(/\n/g, '<br>');
  // 3. 将临时标记转换为段落分隔
  content = content.replace(/###PARAGRAPH###/g, '</p><p>');
  
  // 包装整个内容到段落标签中
  content = '<p>' + content + '</p>';
  
  // 清理可能产生的空段落
  content = content.replace(/<p>\s*<\/p>/g, '');
  
  return content;
});

// Get related posts
const relatedPosts = computed(() => {
  // 如果有携带post参数，不显示相关文章
  if(route.query.post) {
    return [];
  }
  
  if (!post.value || !blogData.value?.blogList) return [];
  return blogData.value.blogList
    .filter((p: any) => p.class_id === post.value?.class_id && p.id !== post.value?.id)
    .slice(0, 2); // Just show maximum 2 related posts
});

// 获取分类标签显示文本
const getCategoryLabel = (classId: number) => {
  if (!blogData.value?.categoryList) return 'Uncategorized'
  
  const category = blogData.value.categoryList.find((cat: any) => cat.id === classId)
  return category ? category.name : 'Uncategorized'
}

// Format date function
const formatDate = (timestamp: number) => {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
};

// Get post description for meta
const metaDescription = computed(() => {
  if (!post.value) return '';
  return post.value.abstract && post.value.abstract.length > 155 
    ? post.value.abstract.substring(0, 155) + '...'
    : post.value.abstract || '';
});

// Get post title for meta
const title = computed(() => {
  if (!post.value) return '';
  return post.value.title && post.value.title.length > 55 
    ? post.value.title.substring(0, 55) + '...' 
    : post.value.title || '';
});

// Set page metadata
useSeo({
  title: `${title.value}`,
  description: metaDescription.value
});

// Load data when page mounts
const loadBlogData = async () => {
  if (isUnmounted.value) return;
  try {
    loading.value = true;
    error.value = null;
    // 重新加载数据
    await refreshBlogData();
  } catch (err: any) {
    if (!isUnmounted.value) {
      error.value = err.message || 'Failed to load blog data';
    }
  } finally {
    if (!isUnmounted.value) {
      loading.value = false;
    }
  }
};

onMounted(() => {
  if (error.value) {
    error.value = error.value || 'Loading failed';
  }
});

// Implement handleBack function
const handleBack = () => {
  if (isUnmounted.value) return;
  // 设置导航状态，防止显示错误信息
  isNavigating.value = true;
  
  // 检查是否有上一级页面可以返回
  if (window.history.length > 1) {
    // 如果有历史记录，直接使用浏览器返回，避免路由变化
    window.history.back();
  } else {
    // 如果没有历史记录，跳转到博客列表
    router.push('/blog');
  }
};

const handleBackHome = () => {
  if (isUnmounted.value) return;
  // 设置导航状态，防止显示错误信息
  isNavigating.value = true;
  
  router.push('/');
};

// 添加组件卸载时的处理
onBeforeUnmount(() => {
  isUnmounted.value = true;
});
</script>