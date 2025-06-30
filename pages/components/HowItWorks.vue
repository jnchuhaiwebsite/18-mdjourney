<template>
  <section class="py-20 bg-blue-pale">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f49d25] to-[#ff8c42] sm:text-5xl animate-fade-in">
          How Veo3 AI Works
        </h2>
        <p class="mt-4 text-xl text-gray-300 animate-slide-up">
          Simple 4-step process to create stunning videos with Veo3 technology
        </p>
      </div>

      <div class="flex flex-row flex-wrap justify-center gap-4">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 sm:p-8 shadow-xl border border-gray-700/50 hover:border-[#f49d25]/50 transition-all duration-300 hover:transform hover:scale-105 group flex-1 min-w-[250px] max-w-[300px]">
          <div class="absolute -top-4 -left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#f49d25] to-[#ff8c42] rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg group-hover:shadow-[#f49d25]/25 transition-all duration-300">
            {{ index + 1 }}
          </div>
          
          <div class="text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-700/50 rounded-full mb-6 group-hover:bg-gray-700/70 transition-colors duration-300">
              <component :is="step.icon" class="w-5 h-5 sm:w-6 sm:h-6 text-[#f49d25]" />
            </div>
            
            <h3 class="text-xl sm:text-2xl font-bold text-white mb-4">{{ step.title }}</h3>
            <p class="text-gray-300 mb-4">{{ step.description }}</p>
          </div>
          
          <!-- Animated underline -->
          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#f49d25] to-[#ff8c42] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { 
  CommandLineIcon, 
  PhotoIcon, 
  VideoCameraIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  PencilIcon,
  CpuChipIcon
} from '@heroicons/vue/24/outline'

const steps = [
  {
    title: "Choose Your Mode",
    description: "Select between text-to-video or image-to-video generation. Upload one image (JPG/JPEG or PNG format, max 10MB), or describe your vision with text prompts.",
    icon: CommandLineIcon
  },
  {
    title: "Describe Your Vision",
    description: "Add detailed descriptions of how you want your content to be animated. Be specific about motion, style, effects, and the overall video concept you want to achieve.",
    icon: PencilIcon
  },
  {
    title: "Veo3 AI Processing",
    description: "Our advanced Veo3 AI technology analyzes your input and creates smooth, natural animations. The AI understands context and generates high-quality video content based on your specifications.",
    icon: CpuChipIcon
  },
  {
    title: "Download Your Video",
    description: "Your professional video will be swiftly processed and ready to download in high-quality MP4 format. Perfect for social media, marketing, presentations, or creative projects.",
    icon: ArrowDownTrayIcon
  }
];
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 