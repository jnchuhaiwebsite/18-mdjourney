<template>
  <div class="min-h-screen bg-blue-pale">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="mb-6">
        <NuxtLink to="/" class="flex items-center text-gray-400 hover:text-gray-200">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </NuxtLink>
      </div>
      
      <h1 class="text-3xl font-bold mb-8 text-white">Privacy Policy</h1>
      <p class="text-gray-300 mb-8">Effective Date: June 27, 2025</p>
      
      <div class="space-y-6 text-white">
        <section>
          <h2 class="text-xl font-semibold mb-4">1. Introduction</h2>
          <p>Welcome to Imagen 4 Ultra ("we," "our," or "us"). This Privacy Policy outlines how we collect, use, protect, and handle your information when you use our cutting-edge AI-powered image and video generation platform.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <p>Imagen 4 Ultra collects the following information that you provide directly to us:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Images you upload (supported formats: JPG/JPEG/PNG, maximum size: 10MB)</li>
            <li>Text prompts and instructions for AI-powered generation</li>
            <li>Account information, credentials, and user preferences</li>
            <li>AI model selection preferences (Ultra, Standard, or Fast models)</li>
            <li>Platform usage statistics and interaction data</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>At Imagen 4 Ultra, we use the information collected to:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Generate high-quality 1080p, 8-second AI videos from your inputs</li>
            <li>Train and enhance our proprietary AI models and algorithms</li>
            <li>Optimize platform performance and user experience</li>
            <li>Provide customer support and communicate service updates</li>
            <li>Maintain compliance with our terms of service and applicable regulations</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p>Imagen 4 Ultra implements industry-leading security measures to protect your uploaded content and personal information. All user data, including source images and generated videos, are encrypted and processed according to the highest security standards in the industry.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
          <p>Imagen 4 Ultra does not sell your personal information. Your data may only be shared under these specific circumstances:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>With your explicit consent and authorization</li>
            <li>To comply with legal obligations and regulatory requirements</li>
            <li>To protect our intellectual property and prevent service abuse</li>
            <li>With trusted third-party service providers who assist our operations</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">6. Your Rights</h2>
          <p>As an Imagen 4 Ultra user, you have the right to:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Access and download your personal information</li>
            <li>Request complete deletion of your account and associated data</li>
            <li>Opt-out of promotional communications and marketing</li>
            <li>Update or correct your profile information and preferences</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or Imagen 4 Ultra's data practices, please contact our dedicated support team at: support@imagen4ultra.com</p>
        </section>

        <section class="mt-8">
          <p class="text-sm">Last updated: {{ new Date().toLocaleDateString() }}</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from '~/composables/useSeo';

// @ts-ignore: Nuxt宏函数
definePageMeta({
  layout: false,
  name: 'privacy-policy'
})

useSeo({
  title: 'Imagen 4 Ultra AI | Privacy Policy',
  description: 'Learn how Imagen 4 Ultra AI protects your data and privacy while using our advanced AI image and video generation platform.'
})
</script>

<style>
body {
  background-color: #111827; /* bg-blue-pale */
  color: #F3F4F6; /* text-gray-100 */
}
</style> 