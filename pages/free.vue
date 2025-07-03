<template>
  <div class="bg-[#101010] text-gray-200">
    <div class="container mx-auto px-4 py-12 md:py-20">
      <div class="text-center max-w-3xl mx-auto mt-8">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#ec2657] via-[#990066] to-[#333333] bg-clip-text text-transparent">
          imagen 4 ultra free | Claim Your Free AI Image Generation Credits
        </h1>
        <p class="text-lg md:text-xl text-gray-400 mb-8">
          Sign up for Imagen 4 Ultra Free today and receive <strong>20 free credits</strong> to experience the cutting-edge of AI image creation. No credit card required. Discover the power of imagen 4 ultra free and transform your creative process.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 items-center">
        <div class="bg-[#19171C] rounded-lg shadow-xl p-8 border border-[#ec2657]/20">
          <h2 class="text-2xl font-semibold mb-4 text-white">What You Get with 20 Credits</h2>
          <p class="text-gray-400 mb-4">
            Your free credits give you the perfect opportunity to test our powerful generation models with imagen 4 ultra free:
          </p>
          <ul class="space-y-3 text-gray-300">
            <li>✨ <strong>Generate 1 Ultra-Quality Image:</strong> Experience our most advanced model, delivering incredible detail, realism, and prompt accuracy with imagen 4 ultra free.</li>
            <li>✨ <strong>Generate 2 Normal-Quality Images:</strong> Quickly create high-quality images perfect for concepts, drafts, and rapid ideation using imagen 4 ultra free.</li>
          </ul>
          <p class="mt-4 text-gray-400">
            Curious about the difference? <NuxtLink to="/normal-vs-ultra" class="text-[#ec2657] hover:underline">Compare Normal vs. Ultra quality here</NuxtLink>.
          </p>
        </div>
        <div class="bg-[#19171C] rounded-lg shadow-xl p-8 border border-gray-800">
          <h2 class="text-2xl font-semibold mb-4 text-white">How to Get Started</h2>
          <ol class="space-y-3 text-gray-300 list-decimal list-inside">
            <li><strong>Create a Free Account:</strong> Quick and simple sign-up to access imagen 4 ultra free.</li>
            <li><strong>Receive 20 Free Credits:</strong> Credits are added to your account instantly, allowing you to explore imagen 4 ultra free.</li>
            <li><strong>Start Creating:</strong> Use our intuitive prompt editor to bring your ideas to life with imagen 4 ultra free.</li>
          </ol>
        </div>
      </div>

      <div class="mt-16 text-center bg-[#19171C] rounded-lg p-8 border border-gray-800 shadow-xl">
        <h2 class="text-2xl font-semibold mb-3 text-white">Coming Soon: Earn More Credits!</h2>
        <p class="text-gray-400 max-w-2xl mx-auto">
          We're launching a referral program! Soon, you'll be able to share a unique link from your user dashboard. When a friend signs up and subscribes, you'll receive a generous amount of credits based on their first plan. It's our way of saying thank you for spreading the word about imagen 4 ultra free.
        </p>
      </div>

      <div v-if="!isSignedIn" class="mt-12 text-center flex justify-center">
        <button 
          @click="scrollToGenerator"
          class="bg-[#ec2657] hover:bg-[#990066] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold flex items-center gap-1.5 sm:gap-2 transition-colors duration-200 shadow-lg text-sm sm:text-base"
        >
          <span>Start Creating</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeo } from '~/composables/useSeo';
import { useClerkAuth } from '~/utils/auth';
import { navigateTo } from 'nuxt/app';

const { isSignedIn, login } = useClerkAuth();
const showConfirmDialog = ref(false);

const handleSignUpClick = () => {
  showConfirmDialog.value = true;
};

const proceedToSignUp = () => {
  showConfirmDialog.value = false;
  login();
};

// 滚动到图片生成器组件
const scrollToGenerator = () => {
  navigateTo('/')
}

useSeo({
  title: 'Free AI Image Credits | Imagen 4 Ultra',
  description: 'Sign up for Imagen 4 Ultra Free and get 20 credits for AI images. No card needed. Discover more credits!',
  url: '/free'
});
</script> 