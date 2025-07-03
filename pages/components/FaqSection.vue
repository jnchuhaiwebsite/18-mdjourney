<template>
  <section id="faq" class="py-20 bg-blue-pale">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="faq-heading" class="text-3xl font-bold text-center mb-12 text-[#ec2657]">Frequently Asked Questions - Imagen 4 Ultra</h2>
      
      <div class="space-y-4">
        <div 
          v-for="(faq, index) in faqs" 
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
    </div>

    <div class="text-center mt-16">
        <button
          @click="scrollToHero"
          class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#ec2657] to-[#333333] hover:from-[#ec2657]/90 hover:to-[#333333]/80 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-200"
          aria-label="Start creating with Imagen 4 Ultra"
        >
          Start Creating Today
          <svg 
            class="ml-2 w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
        </button>
      </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { navigateTo } from 'nuxt/app';

defineOptions({
  name: 'FaqSection'
})

// FAQ data
const faqs = [
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
  },
  {
    question: "How long does image generation take?",
    answer: "With Imagen 4 Ultra, standard images typically complete in 10-15 seconds. High-quality and complex images may take 20-30 seconds. Generation time also depends on current system load and your selected image resolution."
  },
  {
    question: "Who owns the copyright to generated images?",
    answer: "Images generated using Imagen 4 Ultra are owned by you, the user, and can be used for both personal and commercial purposes. However, please note that if your prompts include copyrighted characters or brands, the use of the resulting images may be restricted."
  },
  {
    question: "What should I do if generation fails or results are not ideal?",
    answer: "If generation fails, try simplifying your prompt or breaking down complex requirements. For less-than-ideal results, try using more specific descriptions, adjusting style parameters, or using negative prompts to specify unwanted elements. You can also use our feedback tools to help the system learn your preferences."
  }
];

// Track expanded state of each FAQ item
const openFaqs = ref(Array(faqs.length).fill(false));

// Toggle the expanded/collapsed state of FAQ item
const toggleFaq = (index: number) => {
  openFaqs.value[index] = !openFaqs.value[index];
};

const scrollToHero = () => {
  const heroElement = document.getElementById('hero');
  if (heroElement) {
    heroElement.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
/* Rotation animation */
.rotate-180 {
  transform: rotate(180deg);
}

/* Slide transition effects */
.transition-all {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Button hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(244, 157, 37, 0.3), 0 4px 6px -2px rgba(244, 157, 37, 0.2);
}

/* Add glow effects */
.bg-\[\#ec2657\] {
  box-shadow: 0 0 15px rgba(244, 157, 37, 0.3);
}

.bg-\[\#ec2657\]:hover {
  box-shadow: 0 0 20px rgba(244, 157, 37, 0.5);
}
</style> 