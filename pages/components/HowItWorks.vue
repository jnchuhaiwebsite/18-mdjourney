<template>
  <section class="py-20 bg-blue-pale">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#f49d25] to-[#ff8c42] sm:text-5xl animate-fade-in">
          Master Imagen 4 Ultra
        </h2>
        <p class="mt-4 text-xl text-gray-300 animate-slide-up">
          Generate Professional AI Images with Advanced Configuration Options
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
  CpuChipIcon,
  LanguageIcon,
  CloudArrowDownIcon
} from '@heroicons/vue/24/outline'

const steps = [
  {
    title: "Craft Your English Prompt",
    description: "Create your image description in English - the only supported language for Imagen prompts. Be specific and detailed for best results.",
    icon: PencilIcon
  },
  {
    title: "Configure Image Settings",
    description: "Choose your preferred aspect ratio (1:1, 3:4, 4:3, 9:16, or 16:9) and set person generation preferences according to your region's guidelines.",
    icon: AdjustmentsHorizontalIcon
  },
  {
    title: "Generate & Download",
    description: "Click generate to create your AI masterpiece with Imagen 4 Ultra's advanced technology, complete with secure verification.",
    icon: CloudArrowDownIcon
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