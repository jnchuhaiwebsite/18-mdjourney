<template>
  <section id="faq" class="py-20 bg-blue-pale">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="faq-heading" class="text-3xl font-bold text-center mb-12 text-[#f49d25]">Frequently Asked Questions</h2>
      
      <div class="space-y-4">
        <div 
          v-for="(faq, index) in faqItems" 
          :key="index"
          class="border-b border-[#f49d25]/20 py-6 hover:bg-[#f49d25]/5 transition-colors duration-200 rounded-lg px-4"
        >
          <button
            @click="toggleFaq(index)"
            class="flex justify-between items-center w-full text-left focus:outline-none"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#f49d25]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              <h3 class="text-lg font-semibold text-white">{{ faq.question }}</h3>
            </div>
            <svg 
              :class="[
                'w-5 h-5 text-[#f49d25] transform transition-transform duration-200',
                openFaqs[index] ? 'rotate-180' : ''
              ]"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <div 
            v-show="openFaqs[index]"
            class="mt-4 text-gray-300 leading-relaxed"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
      
      <!-- CTA Buttons -->
      <div class="text-center mt-12 space-x-4"> 
        <!-- 在这里添加显示更多/更少按钮 -->
        <button
          v-if="hasMoreItems && faqs.length > initialVisibleCount"
          @click="showMore"
          class="bg-[#f49d25]/80 hover:bg-[#f49d25] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer inline-block"
        >
          Show More
        </button>
        <button
          v-if="!hasMoreItems && faqs.length > initialVisibleCount"
          @click="showLess"
          class="bg-[#f49d25]/80 hover:bg-[#f49d25] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer inline-block"
        >
          Show Less
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

defineOptions({
  name: 'FaqSection'
})

// FAQ数据
const faqs = [
  {
    question: "What is Veo3 AI and how does it work?",
    answer: "Veo3 AI is an advanced video generation platform powered by Veo3 technology. It offers two main modes: text-to-video generation where you describe your vision, and image-to-video conversion where you upload images to create dynamic videos."
  },
  {
    question: "What image formats are supported for image-to-video?",
    answer: "Veo3 AI supports all major image formats including JPEG(JPG) and PNG. You can upload up to one images at once, each under 10MB, to create batch video content."
  },
  {
    question: "How long does it take to generate a video?",
    answer: "The generation process typically takes 20-60 seconds, depending on the complexity of your input and the desired video effect. Veo3 technology ensures fast and efficient processing."
  },
  {
    question: "What type of content works best for text-to-video?",
    answer: "Clear, detailed descriptions work best for text-to-video generation. Be specific about the scene, motion, style, and effects you want. The more detailed your prompt, the better the results."
  },
  {
    question: "Can I customize the video style and effects?",
    answer: "Yes, you can guide the video style through your prompt description. Specify the type of movement, speed, visual effects, and overall aesthetic you want to achieve. Veo3 AI understands context and creates accordingly."
  },
  // {
  //   question: "What video formats and quality are available?",
  //   answer: "Videos are generated in MP4 format with HD quality options (768P and 1080P). We maintain high visual fidelity while ensuring file sizes remain manageable for easy sharing and downloading."
  // },
  {
    question: "Are there any content restrictions?",
    answer: "Yes, we do not allow the upload of explicit, violent, or inappropriate content. All uploads must comply with our terms of service and content guidelines. We maintain a safe and professional platform."
  },
  {
    question: "Can I use the generated videos commercially?",
    answer: "Yes, you retain the rights to your generated videos, provided you had the necessary rights to the original content. Please review our terms of service for detailed usage rights and commercial licensing."
  },
  // {
  //   question: "How does the batch image processing work?",
  //   answer: "You can upload up to 3 images simultaneously for image-to-video generation. Each image will be processed individually, and you can download each generated video separately. This feature is perfect for creating multiple video variations."
  // }
];

// 初始显示的FAQ数量
const initialVisibleCount = 5;
const visibleCount = ref(initialVisibleCount);

// 跟踪每个FAQ项的展开状态
const openFaqs = ref(Array(faqs.length).fill(false));

// 当前显示的FAQ项目
const faqItems = computed(() => {
  return faqs.slice(0, visibleCount.value);
});

// 是否还有更多FAQ可显示
const hasMoreItems = computed(() => {
  return visibleCount.value < faqs.length;
});

// 切换FAQ项的展开/折叠状态
const toggleFaq = (index: number) => {
  openFaqs.value[index] = !openFaqs.value[index];
};

// 显示更多FAQ
const showMore = () => {
  visibleCount.value = faqs.length;
};

// 显示较少FAQ
const showLess = () => {
  visibleCount.value = initialVisibleCount;
  // 直接跳转到 FAQ 模块
  const faqSection = document.getElementById('faq');
  if (faqSection) {
    faqSection.scrollIntoView();
  }
};

// 滚动到顶部
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 滚动到底部
const scrollToContact = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
};
</script>

<style scoped>
/* 旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
}

/* 滑动过渡效果 */
.transition-all {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* 按钮悬浮效果 */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(244, 157, 37, 0.3), 0 4px 6px -2px rgba(244, 157, 37, 0.2);
}

/* 添加发光效果 */
.bg-\[\#f49d25\] {
  box-shadow: 0 0 15px rgba(244, 157, 37, 0.3);
}

.bg-\[\#f49d25\]:hover {
  box-shadow: 0 0 20px rgba(244, 157, 37, 0.5);
}
</style> 