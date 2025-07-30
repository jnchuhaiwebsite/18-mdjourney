<template>
  <main class="w-full mx-auto p-6 bg-blue-pale rounded-lg max-w-24xl min-h-screen">
    <!-- 首屏区块 -->
    <section
      id="hero"
      class="min-h-[700px] relative"
    >
      <PageHero 
        title="The Midjourney Video Generator, Redefined."
        subtitle="From a simple sentence to a breathtaking video clip. Experience the ultimate text-to-video and image-to-video workflow, built to unleash the full cinematic power of Midjourney."
      />
      <HomeVideoGenerator 
        ref="videoGenerator"
        @generate="handleGenerate"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount, defineAsyncComponent, onMounted } from "vue";
import { useSeo } from '~/composables/useSeo';
import { ref } from 'vue'
import HomeVideoGenerator from '~/components/HomeVideoGenerator.vue'


const PageHero = defineAsyncComponent(() => import('~/components/PageHero.vue'));

import { useNuxtApp } from 'nuxt/app'
const { $toast } = useNuxtApp() as any

// 处理生成事件
const handleGenerate = (params: any) => {
  console.log('Generation event triggered:', params)
  $toast.success('Starting video generation...', 3000)
}
// 使用默认的 SEO 配置
useSeo({
  title: 'AI Video Generator - Transform Text & Images into Videos',
  description: 'Experience the ultimate text-to-video and image-to-video workflow with our Midjourney Video Generator. Create stunning videos from simple prompts.'
})

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
    name: "AI Video Generation",
    description: "Advanced AI video generation platform that transforms static images into dynamic videos. Upload any image and watch it come to life with our cutting-edge AI animation technology. Professional video generation at your fingertips.",
    applicationCategory: "VideoGenerationApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Advanced AI video generation technology",
      "Static image to video transformation",
      "Customizable motion descriptions",
      "Professional video quality",
      "Fast video generation",
      "Multiple video formats support",
      "Commercial usage rights",
      "Digital watermarking",
      "Safety filters and content moderation",
      "Instant video download"
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        "name": "supportedVideoFormats",
        "value": ["MP4", "MOV", "AVI"]
      },
      {
        "@type": "PropertyValue",
        "name": "videoDurationOptions",
        "value": [3, 6, 10, 15]
      },
      {
        "@type": "PropertyValue",
        "name": "defaultSettings",
        "value": {
          "duration": 6,
          "fps": 30,
          "quality": "high"
        }
      }
    ],
    screenshot: "/logo.png",
    applicationSubCategory: "AI Video Generation",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    softwareVersion: "1.0.0",
    inLanguage: "en-US"
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