<template>
  <div class="min-h-screen bg-blue-pale">
    <main class="w-full mx-auto p-6 bg-blue-pale rounded-lg max-w-7xl min-h-screen">
      <!-- 页面标题区域 -->
      <header>
        <PageHero 
          title="Midjourney FAQ - Help"
          subtitle="Get answers to common questions about our pricing plans and features."
        />
      </header>


    <!-- FAQ Section -->
    <section class="py-16 bg-blue-pale">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="space-y-6">
          <div 
            v-for="(faq, index) in faqSection.questions" 
            :key="index"
            class="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <button
              @click="toggleFaq(index)"
              class="flex justify-between items-start w-full text-left p-6 focus:outline-none group bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-start">
                <svg class="w-5 h-5 mr-3 text-blue-600 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {{ faq.question }}
                </h3>
              </div>
              <svg 
                :class="[
                  'w-5 h-5 text-gray-400 transform transition-transform duration-200 mt-1 flex-shrink-0',
                  openFaqs[index] ? 'rotate-180' : ''
                ]"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              >
                <path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
            </button>
            
            <div 
              v-show="openFaqs[index]"
              class="px-6 pb-6 bg-gray-50 border-t border-gray-200"
            >
              <div class="pt-4 text-gray-700 leading-relaxed prose prose-gray max-w-none">
                <div v-html="formatAnswer(faq.answer)"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center mt-12">
          <button
            @click="scrollToGenerator"
            class="inline-flex items-center px-8 py-4 bg-blue-button hover:bg-blue-buttonhover text-white rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label="Start creating with Midjourney"
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
      </div>
    </section>
  </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeo } from '~/composables/useSeo';
import { useRouter } from 'vue-router';

const router = useRouter();
defineOptions({
  name: 'FaqPage'
})

// SEO data
useSeo({
  title: 'Midjourney FAQ - Help & Support Center',
  description: 'Unlock Midjourney full power. Midjourney is the ultimate AI art & video generator for creating stunning visuals from text or images. No Discord needed. Try it now!',
})

// FAQ data
const faqSection = {
  heading: "Frequently Asked Questions",
  subheading: "Get answers to common questions about our pricing plans and features.",
  questions: [
    {
      question: "What can I create with Midjourney?",
      answer: "Midjourney is a powerful AI platform that allows you to create stunning, high-quality images and videos from text prompts or by transforming existing images. You can generate artwork, concept designs, marketing visuals, social media content, portraits, landscapes, and cinematic videos with incredible detail and artistic quality. Our platform supports multiple generation modes including text-to-image, image-to-image, and AI video creation, with various aspect ratios and generation speeds to fit your creative workflow."
    },
    {
      question: "How do I use the AI Video Generator feature?",
      answer: "It's designed to be incredibly simple! Here's the 3-step process:<br><br><strong>1.</strong> Select the \"AI Video\" mode in the generator.<br><strong>2.</strong> Upload a high-quality static image you've created or one of your own.<br><strong>3.</strong> (Optional) Add a text prompt to guide the motion, like \"gentle breeze through the trees\" or \"slow zoom in.\"<br><br>Our engine will then analyze the image and bring it to life with subtle, realistic motion, creating a captivating short video clip perfect for social media and presentations."
    },
    {
      question: "How does Midjourney pricing work?",
      answer: "Midjourney uses a flexible credit-based pricing system designed to give you maximum value and control. Instead of restrictive monthly subscriptions, you purchase credit packages that never expire. Different generation types consume different amounts of credits: AI video generation requires more credits due to computational complexity, while image generation uses fewer credits. You can choose from relaxed, fast, or turbo generation speeds, with faster speeds consuming more credits but delivering results quicker. This system lets you create at your own pace without worrying about monthly deadlines."
    },
    {
      question: "Can I use the art and videos I create for commercial projects?",
      answer: "Absolutely. This is a core benefit for our users. Our Creator and Studio plans grant you a full commercial license for every image and video you generate. This means you have the rights to use your creations in marketing campaigns, product designs, client work, and any other for-profit venture. Our licensing aligns with Midjourney's own commercial use terms, giving you complete peace of mind."
    },
    {
      question: "What kind of prompts work best for Midjourney V1?",
      answer: "Midjourney V1 has exceptional natural language understanding, but specificity is still key. Think like a photographer or art director. Instead of just \"a dog,\" try:<br><br><em>\"A cinematic, ultra-realistic photo of a golden retriever puppy sitting in a sun-drenched, grassy field, soft morning light, looking at the camera with a playful expression.\"</em><br><br>Include subject, action, environment, lighting, style, and composition. The more detail you provide, the closer the AI can get to the masterpiece in your mind."
    },
    {
      question: "Is it safe to upload my images for the Image-to-Image and AI Video features?",
      answer: "Your privacy and data security are our top priorities. When you upload an image to Genesis Engine, it is used only for the duration of that specific generation task. The image is processed in a secure environment and is automatically deleted from our temporary servers immediately after your generation is complete. We do not store your uploaded source images, nor do we use them for any other purpose."
    }
  ]
};

// Track expanded state of each FAQ item - all expanded by default
const openFaqs = ref(Array(faqSection.questions.length).fill(true));

// Toggle the expanded/collapsed state of FAQ item
const toggleFaq = (index: number) => {
  openFaqs.value[index] = !openFaqs.value[index];
};

// Scroll to generator page
const scrollToGenerator = () => {
  router.push('/');
};

// Format answer text with HTML
const formatAnswer = (answer: string) => {
  return answer;
};
</script>

<style scoped>
.prose {
  color: #374151;
  line-height: 1.7;
}

.prose strong {
  color: #111827;
  font-weight: 600;
}

.prose em {
  color: #6b7280;
  font-style: italic;
}

.prose br {
  margin-bottom: 0.5em;
}

.transition-all {
  transition-property: all;
}

.duration-200 {
  transition-duration: 200ms;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style> 