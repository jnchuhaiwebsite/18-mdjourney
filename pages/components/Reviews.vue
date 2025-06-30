<template>
  <div class="py-24 bg-blue-pale">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl">
          User Reviews
        </h2>
        <p class="mt-4 text-lg text-gray-300">
          Discover how Veo3 AI is revolutionizing video creation with Veo3 technology and exceptional cost-effectiveness
        </p>
      </div>

      <div class="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <!-- Testimonial 1 -->
        <div class="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div class="mb-6">
            <h3 class="text-lg font-bold text-white">David Chen - Video Producer</h3>
            <p class="text-gray-400">New York</p>
            <div class="flex items-center mt-2">
              <span class="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <p class="text-gray-300">
            "It's crazy how #Veo3 delivers insane results in text-to-video 🤯🎬 And every time, the voice quality blows me away — smooth, natural, just wow 🔊🔥" - #Veo3
          </p>
        </div>

        <!-- Testimonial 2 -->
        <div class="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div class="mb-6">
            <h4 class="text-lg font-bold text-white">Sarah Lee - Content Creator</h4>
            <p class="text-gray-400">San Francisco</p>
            <div class="flex items-center mt-2">
              <span class="text-yellow-400">★★★★★</span>
            </div>
          </div>
          <p class="text-gray-300">
            Veo3, prompt: "a person walks inside of an incredible futuristic city. The person comments out loud on what he sees, and what surprises him the most" #veo3
          </p>
        </div>

        <!-- Testimonial 3 -->
        <div class="bg-gray-800 rounded-lg p-8 shadow-xl">
          <div class="mb-6">
            <h4 class="text-lg font-bold text-white">Michael Wang - Post-Production Specialist</h4>
            <p class="text-gray-400">Los Angeles</p>
            <div class="flex items-center mt-2">
              <span class="text-yellow-400">★★★★☆</span>
            </div>
          </div>
          <p class="text-gray-300">
            #Veo3 further blurs the lines between reality and imagination with audio, stronger text adherence, and richer visual details.
          </p>
        </div>
      </div>

      <!-- 添加开始创建按钮 -->
      <div class="text-center mt-16">
        <button
          @click="scrollToHero"
          class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#f49d25] to-[#ff8c42] hover:from-[#f49d25]/90 hover:to-[#ff8c42]/80 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200"
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
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.scrollIntoView({ behavior: 'smooth' });
  }
};

const reviews = [
  {
    content: "Veo3 AI transformed my static product photos into engaging videos for our e-commerce site. The Veo3 technology delivers amazing quality in just minutes!",
    author: "Sarah Chen",
    title: "E-commerce Manager",
    rating: 5
  },
  {
    content: "As a digital artist, I love how Veo3 AI brings my illustrations to life. The text-to-video feature is incredible for creating unique content for social media.",
    author: "Michael Rodriguez",
    title: "Digital Artist",
    rating: 5
  },
  {
    content: "The dual generation modes are fantastic - I can create videos from text or images. The batch processing with up to 3 images saves me so much time. Highly recommended!",
    author: "Emma Thompson",
    title: "Marketing Director",
    rating: 5
  },
  {
    content: "We use Veo3 AI for our educational content. It's amazing how the Veo3 technology can turn simple descriptions into dynamic animations that help students understand concepts better.",
    author: "Dr. James Wilson",
    title: "Educational Content Creator",
    rating: 5
  }
];
</script> 