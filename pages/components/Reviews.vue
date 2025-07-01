<template>
  <div class="py-24 bg-blue-pale">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          Imagen 4 Ultra Configuration
        </h2>
        <p class="mt-4 text-lg text-gray-300">
          Experience the power of Imagen 4 Ultra with English prompts, customizable aspect ratios (1:1, 3:4, 4:3, 9:16, 16:9), and flexible person generation settings. Create stunning AI-generated images with precise control.
        </p>
      </div>

      <div class="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="review in reviews" :key="review.author" class="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-white">{{ review.author }} - {{ review.title }}</h3>
            <p class="text-gray-400">{{ review.location }}</p>
            <div class="flex items-center mt-2">
              <span class="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <p class="text-gray-300">{{ review.content }}</p>
        </div>
      </div>

      <!-- 添加开始创建按钮 -->
      <div class="text-center mt-16">
        <button
          @click="scrollToHero"
          class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#ec2657] to-[#333333] hover:from-[#ec2657]/90 hover:to-[#333333]/80 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200"
        >
          Start Creating Now
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 跳转到首页
const scrollToHero = () => {
  const heroSection = document.getElementById('prompt-image-generator');
  if (heroSection) {
    heroSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const reviews = [
  {
    author: "Emily Anderson",
    title: "Digital Artist",
    location: "California",
    content: "The aspect ratio options in Imagen 4 Ultra are fantastic! Being able to switch between 1:1 for social media and 16:9 for web banners has streamlined my workflow significantly. The image quality is consistently impressive.",
    rating: 5
  },
  {
    author: "James Miller",
    title: "Professional Photographer",
    location: "New York",
    content: "The person generation controls in Imagen 4 Ultra are exactly what I needed. The 'allow_adult' setting ensures I get appropriate content for my commercial projects, and the English prompts are intuitive and precise.",
    rating: 5
  },
  {
    author: "Sophie Chen",
    title: "Marketing Director",
    location: "Seattle",
    content: "Imagen 4 Ultra's English prompt system is remarkably accurate. I can generate exactly what I envision, and the customizable aspect ratios make it perfect for our multi-platform marketing campaigns.",
    rating: 5
  }
];
</script> 