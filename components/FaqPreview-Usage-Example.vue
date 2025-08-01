<template>
  <div>
    <!-- 页面的其他内容 -->
    <section class="py-16">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-center mb-8">Welcome to Genesis Engine</h1>
        <p class="text-xl text-center text-gray-600 mb-16">Create stunning AI art and videos with Midjourney V7</p>
      </div>
    </section>

    <!-- FAQ预览组件 -->
    <FaqPreview />

    <!-- 页面的其他内容 -->
    <section class="py-16 bg-gray-100">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-8">Ready to Start Creating?</h2>
        <button class="px-8 py-4 bg-blue-button text-white rounded-lg font-medium">
          Get Started Now
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// 导入FAQ预览组件
import FaqPreview from '~/components/FaqPreview.vue'

defineOptions({
  name: 'ExamplePage'
})
</script>