<template>
  <section class="py-20 bg-blue-pale">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-extrabold text-[#f49d25] sm:text-5xl">
          Veo3 AI Core Features
        </h2>
        <p class="mt-4 text-xl text-gray-300">
          Revolutionary video generation capabilities powered by Veo3 technology
        </p>
      </div>

      <!-- Feature showcase list -->
      <div class="space-y-24 mb-24">
        <div v-for="(feature, index) in mainFeatures" :key="index" 
             class="flex flex-col md:flex-row gap-12 items-center"
             :class="{ 'md:flex-row-reverse': index % 2 !== 0 }">
          <!-- Text content -->
          <div class="w-full md:w-1/2 space-y-6">
            <div class="inline-block p-3 bg-gradient-to-r from-[#f49d25] to-[#ff8c42] rounded-lg">
              <component :is="feature.icon" class="w-6 h-6 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-[#f49d25]">{{ feature.title }}</h3>
            <p class="text-gray-300 text-lg">{{ feature.description }}</p>
            <ul class="space-y-3">
              <li v-for="(point, pIndex) in feature.points" :key="pIndex" 
                  class="flex items-center text-gray-300">
                <span class="mr-2 text-[#f49d25]">✓</span>
                {{ point }}
              </li>
            </ul>
          </div>

          <!-- Video showcase -->
          <div class="w-full md:w-1/2">
            <div class="relative bg-blue-pale/80 shadow-xl w-full max-w-md mx-auto rounded-xl overflow-hidden aspect-video">
              <div v-if="!showVideo[index]" class="absolute inset-0 w-full h-full flex items-center justify-center bg-blue-pale" :style="`background-image: url('${feature.poster}'); background-size: cover; background-position: center;`">
                <button 
                  class="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors focus:outline-none"
                  @click="playVideo(index)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-black" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <video
                v-if="showVideo[index]"
                :src="feature.video" 
                class="w-full h-full object-cover rounded-xl"
                :poster="feature.poster"
                autoplay
                preload="auto"
                @click="pauseAndShowCover(index, $event)"
                @playing="onVideoPlaying(index)"
                @ended="onVideoEnded(index)"
                playsinline
                webkit-playsinline
                x5-playsinline
                x5-video-player-type="h5"
                x5-video-player-fullscreen="false"
              ></video>
              <div v-if="videoLoading[index]" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10">
                <svg class="animate-spin h-12 w-12 text-[#f49d25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- CTA Section -->
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
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  SparklesIcon,
  VideoCameraIcon,
  CursorArrowRaysIcon,
  ArrowPathIcon,
  FilmIcon,
  CommandLineIcon,
  ArrowsPointingOutIcon,
  ClockIcon,
  BoltIcon,
  PhotoIcon
} from '@heroicons/vue/24/outline'

defineOptions({
  name: 'FeatureShowcase'
})

// Main feature data with video demonstrations - keeping only 3 features
const mainFeatures = [
  {
    title: "Advanced Veo3 AI Technology",
    description: "Veo3 AI leverages cutting-edge Veo3 technology to transform text descriptions and images into dynamic videos. Our AI understands context and creates natural, fluid animations with professional quality.",
    icon: BoltIcon,
    video: "https://img.xbgremove.com/veo3/veo3-Core-Features-video-01.mp4",
    poster: "https://img.xbgremove.com/veo3/veo3-Core-Features-video-01.jpg",
    points: [
      "Veo3-powered video generation",
      "Natural motion and transitions",
      "Context-aware processing",
      "Professional output quality"
    ]
  },
  {
    title: "Dual Generation Modes",
    description: "Choose between text-to-video or image-to-video generation.Upload one image (JPG/JPEG or PNG format, max 10MB), or create videos from text descriptions with unlimited creativity.",
    icon: CommandLineIcon,
    video: "https://img.xbgremove.com/veo3/veo3-Core-Features-video-02.mp4",
    poster: "https://img.xbgremove.com/veo3/veo3-Core-Features-video-03.jpg",
    points: [
      "Text-to-video generation",
      "Image-to-video conversion",
      // "Batch image processing",
      "Multiple format support"
    ]
  },
  {
    title: "High-Quality Video Output",
    description: "Generate professional videos with different quality settings using Veo3 AI's advanced technology. The AI maintains image details while creating smooth motion, delivering results suitable for commercial use.",
    icon: VideoCameraIcon,
    video: "https://img.xbgremove.com/veo3/veo3-Core-Features-video-03.mp4",
    poster: "https://img.xbgremove.com/veo3/veo3-Core-Features-video-02.jpg",
    points: [
      "HD video output",
      "Detail preservation",
      "Commercial quality",
      "Instant download"
    ]
  }
];

// Technical features grid - removed aspect ratio feature
const techFeatures = [
  {
    title: "High Resolution Output",
    description: "Generate stunning 768P and 1080P videos with cinematic quality and rich details",
    icon: ArrowsPointingOutIcon,
    specs: "768P, 1080P resolution"
  },
  {
    title: "Dual Generation Modes",
    description: "Create videos from text prompts or transform images into dynamic video content",
    icon: ClockIcon,
    specs: "Text-to-video & Image-to-video"
  },
  {
    title: "Fast Processing",
    description: "Advanced Veo3 AI processing with 20-60 seconds generation time and high instruction response rate",
    icon: ArrowPathIcon,
    specs: "20-60 seconds processing time"
  }
];

// 控制每个视频是否显示
const showVideo = ref(mainFeatures.map(() => false));
const videoLoading = ref(mainFeatures.map(() => false));

function playVideo(idx: number) {
  showVideo.value = showVideo.value.map((_, i) => i === idx);
  videoLoading.value = videoLoading.value.map((_, i) => i === idx);
}

function pauseAndShowCover(idx: number, event: Event) {
  const video = event.target as HTMLVideoElement;
  video.pause();
  showVideo.value[idx] = false;
  videoLoading.value[idx] = false;
}

function onVideoPlaying(idx: number) {
  videoLoading.value[idx] = false;
}

function onVideoEnded(idx: number) {
  showVideo.value[idx] = false;
  videoLoading.value[idx] = false;
}

// 跳转到首页
const scrollToHero = () => {
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
/* 渐变背景动画 */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style> 