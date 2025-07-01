<template>
  <section id="faq" class="py-20 bg-blue-pale">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="faq-heading" class="text-3xl font-bold text-center mb-12 text-[#ec2657]">Frequently Asked Questions - Imagen 4 Ultra</h2>
      
      <div class="space-y-4">
        <div 
          v-for="(faq, index) in faqItems" 
          :key="index"
          class="border-b border-[#ec2657]/20 py-6 hover:bg-[#ec2657]/5 transition-colors duration-200 rounded-lg px-4"
        >
          <button
            @click="toggleFaq(index)"
            class="flex justify-between items-center w-full text-left focus:outline-none"
          >
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2 text-[#ec2657]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
              <h3 class="text-lg font-semibold text-white">{{ faq.question }}</h3>
            </div>
            <svg 
              :class="[
                'w-5 h-5 text-[#ec2657] transform transition-transform duration-200',
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
          class="bg-[#ec2657]/80 hover:bg-[#ec2657] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer inline-block"
        >
          Show More
        </button>
        <button
          v-if="!hasMoreItems && faqs.length > initialVisibleCount"
          @click="showLess"
          class="bg-[#ec2657]/80 hover:bg-[#ec2657] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer inline-block"
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
    question: "What aspect ratios are supported?",
    answer: "Imagen supports five aspect ratios: 1:1 (square, default), 3:4 (portrait), 4:3 (landscape), 9:16 (vertical), and 16:9 (horizontal). You can specify your preferred ratio using the aspectRatio parameter."
  },
  {
    question: "What language support is available?",
    answer: "Currently, Imagen 4 Ultra only supports English prompts. All text descriptions for image generation must be provided in English for optimal results."
  },
  {
    question: "How do I write effective prompts for the main subject?",
    answer: "When writing prompts, start by clearly describing your main subject - whether it's an object, person, animal, or scene. Be specific and use meaningful descriptive words. For example, instead of just saying 'a cat', try 'a fluffy orange tabby cat sitting alertly'."
  },
  {
    question: "How should I describe the background and setting?",
    answer: "The background is crucial for context. Specify the environment clearly - whether it's a studio setting with a white background, an outdoor scene with natural lighting, or an indoor environment. For instance: 'in a sun-drenched meadow with wildflowers', or 'in a minimalist studio with soft diffused lighting'."
  },
  {
    question: "What's the best way to specify the artistic style?",
    answer: "Layer your desired artistic style onto your prompt. You can use general terms like 'digital art', 'photograph', or 'sketch', or be more specific like 'pastel drawing', 'charcoal illustration', or 'isometric 3D rendering'. You can also combine styles, such as 'watercolor and ink illustration with digital enhancement'."
  }
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
.bg-\[\#ec2657\] {
  box-shadow: 0 0 15px rgba(244, 157, 37, 0.3);
}

.bg-\[\#ec2657\]:hover {
  box-shadow: 0 0 20px rgba(244, 157, 37, 0.5);
}
</style> 