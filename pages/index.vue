<template>
  <div class="w-full mx-auto bg-blue-pale">
    <main class="max-w-24xl mx-auto min-h-screen">
      <!-- 首屏区块 -->
      <section
        id="hero"
        class="min-h-[700px] relative pt-[64px]"
      >
        <keep-alive>
          <ImageUploader />
        </keep-alive>
      </section>

    
      
      <!-- 操作步骤 -->
      <section id="how-it-works">
        <keep-alive>
          <HowItWorks />
        </keep-alive>
      </section>

      <!-- 特性展示 -->
      <section id="features-showcase">
        <keep-alive>
          <FeatureShowcase />
        </keep-alive>
      </section>

      <!-- 用户评论 -->
      <section id="reviews">
        <keep-alive>
          <Reviews />
        </keep-alive>
      </section>

      <!-- 定价模块 -->
      <section id="pricing">
        <keep-alive>
          <PricingPlans />
        </keep-alive>
      </section>

      <!-- 常见问题模块 -->
      <section id="faq">
        <keep-alive>
          <FaqSection />
        </keep-alive>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, defineAsyncComponent, onMounted } from "vue";
import { useSeo } from '~/composables/useSeo';

const PricingPlans = defineAsyncComponent(() => import('~/components/PricingPlans.vue'));
const ImageUploader = defineAsyncComponent(() => import('~/components/ImageUploader.vue'));
const FaqSection = defineAsyncComponent(() => import('~/pages/components/FaqSection.vue'));
const HowItWorks = defineAsyncComponent(() => import('~/pages/components/HowItWorks.vue'));
const FeatureShowcase = defineAsyncComponent(() => import('~/pages/components/FeatureShowcase.vue'));
const Reviews = defineAsyncComponent(() => import('~/pages/components/Reviews.vue'));

import { useNuxtApp } from 'nuxt/app'
const { $toast } = useNuxtApp() as any

// 使用默认的 SEO 配置
useSeo()

// 处理支付回调
onBeforeMount(() => {
  if (typeof window === "undefined") return;

  const urlParams = new URLSearchParams(window.location.search);
  const paySuccess = urlParams.get("paysuccess");

  if (paySuccess == "1") {
    window.history.replaceState({}, "", window.location.pathname);
    setTimeout(() => {
      $toast.success("Thank you for your support! Your membership benefits are now activated.",3000);
    }, 500);
  } else if (urlParams.get("payfail") == "1") {
    window.history.replaceState({}, "", window.location.pathname);
  }
});

// 设置页面元数据
onMounted(() => {
  // 结构化数据标记以提高SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Veo3 AI",
    description: "Advanced video generation platform powered by Veo3 technology. Create stunning videos from text descriptions or transform images into dynamic video content. Support for multiple image formats and batch processing.",
    applicationCategory: "VideoGenerationApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Veo3-powered video generation",
      "Text-to-video conversion",
      "Image-to-video conversion",
      "Batch image processing",
      "Multiple image format support",
      "HD video output (768P/1080P)",
      "Fast processing (20-60 seconds)",
      "Professional video quality",
      "Commercial usage rights",
      "Instant video download"
    ],
    screenshot: "/logo.png",
    applicationSubCategory: "AI Video Generation",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0.0"
  };
  // 添加结构化数据到页面头部
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
});
</script>

<style scoped>
html {
  font-size: 18px;
}
</style>