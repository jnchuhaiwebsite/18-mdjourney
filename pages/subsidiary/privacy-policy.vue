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
          <p>Welcome to Veo3 ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered video generation service.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Images you upload (JPG/JPEG/PNG format, under 10MB)</li>
            <li>Text prompts for video generation</li>
            <li>Account information and preferences</li>
            <li>Model selection choices (Standard or Fast model)</li>
            <li>Usage data and interaction with our platform</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Generate 1080p, 8-second videos from your inputs</li>
            <li>Improve our AI models and service quality</li>
            <li>Maintain and optimize our platform</li>
            <li>Communicate with you about our services</li>
            <li>Ensure compliance with our terms and policies</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">4. Data Storage and Security</h2>
          <p>We implement appropriate security measures to protect your uploaded content and personal information. Your images and generated videos are stored securely and processed in accordance with industry standards.</p>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent abuse</li>
            <li>With service providers who assist in our operations</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Access your personal information</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
            <li>Update or correct your information</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-4">7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at: support@vidveo3.com</p>
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
  title: 'veo3 AI | Privacy Policy',
  description: 'Learn how veo3 AI protects your data and privacy while using our AI image animator platform powered by advanced AI technology.'
})
</script>

<style>
body {
  background-color: #111827; /* bg-blue-pale */
  color: #F3F4F6; /* text-gray-100 */
}
</style> 