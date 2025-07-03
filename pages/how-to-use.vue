<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#ec2657] via-[#990066] to-[#333333] bg-clip-text text-transparent">imagen 4 ultra how to use: How to Use Imagen 4 Ultra AI</h1>

    <div class="max-w-4xl mx-auto">
      <!-- Step-by-step Guide -->
      <div class="space-y-12">
        <div v-for="(step, index) in steps" :key="index" class="flex items-start">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-[#ec2657] flex items-center justify-center text-white text-xl font-bold">
            {{ index + 1 }}
          </div>
          <div class="ml-6">
            <h2 class="text-xl font-semibold mb-2 text-[#F3F4F6]">{{ step.title }}</h2>
            <p class="text-[#8a8c90] mb-4">{{ step.description }}</p>
            <div v-if="step.tips" class="bg-[#19171C]/50 p-4 rounded-lg border border-[#ec2657]/20">
              <h3 class="font-semibold text-[#ec2657] mb-2">Pro Tips:</h3>
              <ul class="list-disc list-inside space-y-2 text-[#8a8c90]">
                <li v-for="(tip, tipIndex) in step.tips" :key="tipIndex">
                  {{ tip }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-12 text-center">
        <NuxtLink to="/components/generation" 
                  class="bg-[#ec2657] text-white px-8 py-3 rounded-full hover:bg-[#990066] transition-colors">
          Start Creating Now
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'

const steps = [
  {
    title: 'Choose Your Plan',
    description: 'Select a plan that matches your creative needs, from our free tier for beginners to premium features for professionals.',
    tips: [
      'Start with the free tier to explore basic features',
      'Upgrade to premium for advanced features and more generations'
    ]
  },
  {
    title: 'Master Prompt Elements',
    description: 'Create powerful prompts using five essential elements that help AI understand your vision perfectly.',
    tips: [
      'Subject: Be specific, e.g., "a red 1960s classic sports car"',
      'Environment: Set the scene, e.g., "on a cyberpunk street with neon lights"',
      'Medium & Style: Specify art form, e.g., "surrealist oil painting" or "vintage film photography"',
      'Composition & Angle: Define viewpoint, e.g., "wide-angle lens" or "close-up shot"',
      'Lighting & Mood: Describe atmosphere, e.g., "soft golden morning light"'
    ]
  },
  {
    title: 'Select Image Ratio',
    description: 'Choose the perfect aspect ratio for your project, with square (1:1) as the default format.',
    tips: [
      'Square (1:1) - Perfect for social media profiles and universal use',
      'Portrait (3:4, 9:16) - Ideal for mobile wallpapers and story formats',
      'Landscape (4:3, 16:9) - Great for web banners and scenic shots'
    ]
  },
  {
    title: 'Style Control Techniques',
    description: 'Create unique visual effects through various artistic mediums and style commands.',
    tips: [
      'Artistic Medium: Choose from "pencil sketch", "charcoal", "watercolor" and more',
      'Historical Styles: Use "in the style of [art movement]" for impressionist, pop art etc.',
      'Creative Fusion: Blend different styles, like "ukiyo-e meets cyberpunk"'
    ]
  },
  {
    title: 'Text Integration',
    description: 'Add text to your images for creating posters, logos, and more.',
    tips: [
      'Text Length: Keep under 25 characters for optimal results',
      'Layout Control: Specify text position and size in your prompt',
      'Font Style: Describe desired typography (e.g., "bold", "handwritten")',
      'Parameter Templates: Use templates for batch-creating varied text designs'
    ]
  }
]

// SEO Configuration
useHead({
  title: 'How to Use Imagen 4 Ultra AI | Complete Guide 2025',
  meta: [
    {
      name: 'description',
      content: 'Master Imagen 4 Ultra AI with expert tips on prompts, styles, and text integration. Create stunning AI art with our step-by-step guide.'
    },
    {
      name: 'keywords',
      content: 'Imagen 4 Ultra, AI image generation, prompt engineering, art styles, aspect ratio, text integration, AI art guide'
    },
    {
      property: 'og:title',
      content: 'How to Use Imagen 4 Ultra AI | Complete Guide 2025'
    },
    {
      property: 'og:description',
      content: 'Master Imagen 4 Ultra AI with expert tips on prompts, styles, and text integration. Create stunning AI art with our step-by-step guide.'
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: 'How to Use Imagen 4 Ultra AI | Complete Guide 2025'
    },
    {
      name: 'twitter:description',
      content: 'Master Imagen 4 Ultra AI with expert tips on prompts, styles, and text integration. Create stunning AI art with our step-by-step guide.'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://yourdomain.com/how-to-use'
    }
  ]
})
</script>

<style scoped>
/* Enhanced accessibility and SEO-friendly styling */
h1, h2, h3 {
  scroll-margin-top: 2rem;
}

.prose {
  max-width: 65ch;
  line-height: 1.6;
}

/* Improved text contrast for accessibility */
.text-gray-400 {
  opacity: 0.9;
}

/* Print-friendly styles */
@media print {
  .bg-gradient-to-r {
    background: none;
    color: #000;
  }
  
  .text-gray-400 {
    color: #333;
  }
}
</style> 