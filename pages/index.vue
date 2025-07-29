<template>
  <div class="w-full mx-auto bg-blue-pale">
    <main class="max-w-24xl mx-auto min-h-screen">
      <!-- 首屏区块 -->
      <section
        id="hero"
        class="min-h-[700px] relative pt-[64px]"
      >
        <PageHero 
          title="Imagen 4 Ultra - Professional AI Art Generation Platform"
          subtitle="Create stunning, high-quality images instantly with our cutting-edge AI technology - Professional-grade art generation at your fingertips"
        />
      </section>

      <!-- 展示案例 -->
      <section id="ShowcaseExamples">
          <ShowcaseExamples />
      </section>

      <!-- 操作步骤 -->
      <section id="how-it-works">
          <HowItWorks />
      
      </section>



      <!-- 特性展示 -->
      <section id="features-showcase">
      
          <FeatureShowcase />
       
      </section>

      <!-- 用户评论 -->
      <section id="reviews">
      
          <Reviews />
        
      </section>

      <!-- 定价模块 -->
      <!-- <section id="pricing">
        <keep-alive>
          <PricingPlans />
        </keep-alive>
      </section> -->

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


const FaqSection = defineAsyncComponent(() => import('~/pages/components/FaqSection.vue'));
const HowItWorks = defineAsyncComponent(() => import('~/pages/components/HowItWorks.vue'));
const FeatureShowcase = defineAsyncComponent(() => import('~/pages/components/FeatureShowcase.vue'));
const Reviews = defineAsyncComponent(() => import('~/pages/components/Reviews.vue'));
const ShowcaseExamples = defineAsyncComponent(() => import('~/pages/components/ShowcaseExamples.vue'));
const PromptImageGenerator = defineAsyncComponent(() => import('~/components/PromptImageGenerator.vue'));
const PageHero = defineAsyncComponent(() => import('~/components/PageHero.vue'));

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
    name: "Imagen 4 Ultra",
    description: "Advanced AI image generation platform powered by Imagen 4 Ultra technology. Create high-quality images with customizable parameters including aspect ratio and person generation controls. Supports English prompts with professional-grade output.",
    applicationCategory: "ImageGenerationApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Advanced Imagen 4 Ultra technology",
      "English prompt support",
      "Multiple aspect ratios (1:1, 3:4, 4:3, 9:16, 16:9)",
      "Customizable person generation settings",
      "Professional image quality",
      "Fast generation (20-60 seconds)",
      "Commercial usage rights",
      "Digital watermarking",
      "Safety filters and content moderation",
      "Instant image download"
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        "name": "supportedAspectRatios",
        "value": ["1:1", "3:4", "4:3", "9:16", "16:9"]
      },
      {
        "@type": "PropertyValue",
        "name": "personGenerationOptions",
        "value": ["dont_allow", "allow_adult", "allow_all"]
      },
      {
        "@type": "PropertyValue",
        "name": "defaultSettings",
        "value": {
          "batchSize": 1,
          "aspectRatio": "1:1",
          "personGeneration": "allow_adult"
        }
      }
    ],
    screenshot: "/logo.png",
    applicationSubCategory: "AI Image Generation",
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