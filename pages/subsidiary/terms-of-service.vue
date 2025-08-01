<template>
  <div class="min-h-screen bg-blue-pale">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="mb-6">
        <NuxtLink to="/" class="flex items-center text-blue-navtext hover:text-blue-pricinghover transition-colors duration-200">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </NuxtLink>
      </div>

      <h1 class="text-4xl lg:text-5xl font-extrabold leading-tight mb-8 text-blue-h1">Terms of Service</h1>
      <p class="text-blue-footertext mb-8 text-lg">Effective Date: {{ new Date().toLocaleDateString() }}</p>
      
      <div class="space-y-6 text-blue-footertext leading-relaxed">
        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">1. Acceptance of Terms</h2>
          <p>By accessing or using The Midjourney AI Generator's services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our service.</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">2. Service Description</h2>
          <p>The Midjourney AI Generator provides advanced AI-powered creative services, including:</p>
          <ul class="list-disc pl-6 mt-2">
            <li><strong class="text-blue-button">Text-to-Image Generation</strong>: Convert text prompts into dynamic image content</li>
            <li><strong class="text-blue-button">Image-to-Image Generation</strong>: Transform existing images using AI-powered creative processing</li>
            <li><strong class="text-blue-button">Image + Text to Video Generation</strong>: Convert images and text prompts into dynamic video content</li>
            <li><strong class="text-blue-button">High-Quality Output</strong>: Support for multiple resolutions and aspect ratios</li>
            <li><strong class="text-blue-button">File Upload Support</strong>: Accept JPG/JPEG/PNG formats up to 10MB</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">3. User Responsibilities</h2>
          <p>Users must:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Upload only appropriate and lawful content</li>
            <li>Maintain account security and safeguard login credentials</li>
            <li>Comply with file format and size restrictions</li>
            <li>Process one generation request at a time</li>
            <li>Not attempt to circumvent system limitations or engage in malicious activities</li>
            <li>Ensure prompts and content are appropriate and legal</li>
            <li>Respect intellectual property rights and avoid copyright infringement</li>
            <li>Use the service for legitimate creative purposes only</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">4. Intellectual Property Rights</h2>
          <p>Users retain rights to their uploaded content. However, you grant The Midjourney AI Generator a license to use, process, and store your content for service provision. <strong class="text-blue-button">Generated images and videos</strong> are owned by the user, subject to our fair use policy. We are not responsible for the originality of generated content or its similarity to existing works.</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">5. Service Limitations</h2>
          <ul class="list-disc pl-6 mt-2">
            <li>One generation request per submission</li>
            <li><strong class="text-blue-button">Supported Language:</strong> English prompts (recommended for optimal results)</li>
            <li><strong class="text-blue-button">Generation Time:</strong> Processing may take 10 seconds to 3 minutes depending on model and complexity</li>
            <li><strong class="text-blue-button">Video Generation:</strong> Additional processing time required for video content creation</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">6. Prohibited Content</h2>
          <p>Users may not generate the following content:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Illegal or harmful content</li>
            <li>Copyright-infringing materials</li>
            <li>Adult or explicit sexual content</li>
            <li>Violent, graphic, or disturbing content</li>
            <li>Content that violates third-party rights</li>
            <li>Content that bypasses safety settings</li>
            <li>Hate speech or discriminatory content</li>
            <li>Inappropriate depictions of real individuals</li>
            <li>Content intended to deceive or mislead others</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">7. Subscription and Payment Terms</h2>
          <p>We offer both free and premium service options:</p>
          <ul class="list-disc pl-6 mt-2">
            <li>Free users receive basic generation capabilities with limited usage</li>
            <li>Premium subscribers enjoy advanced features and unlimited generations</li>
            <li>Specific terms for premium plans are detailed on our pricing page</li>
            <li>Refund policy applies as outlined in our refund terms</li>
            <li>Subscription fees are non-refundable except as required by law</li>
          </ul>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">8. Service Modifications and Termination</h2>
          <p>We reserve the right to modify or discontinue any aspect of our service at any time. We will provide reasonable advance notice for substantial changes. We may suspend or terminate user accounts for violations of these terms.</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">9. Disclaimer of Warranties</h2>
          <p>This service is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or suitability of generated results. Users assume all risks associated with using this service.</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">10. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-4 text-blue-h1">11. Contact Information</h2>
          <p>For any questions regarding these terms, please contact us at: <strong class="text-blue-button">support@midjourneyai.net</strong></p>
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
  name: 'terms-of-service'
})

useSeo({
  title: 'Terms of Service | Midjourney AI Generator',
  description: 'Read our terms of service for using the Midjourney AI Generator - offering text-to-image, image-to-image, and image+text-to-video generation services.'
})
</script>

<style>
/* 移除不必要的全局样式，使用tailwind类名代替 */
</style> 