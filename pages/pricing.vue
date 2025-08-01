<template>
  <div class="min-h-screen bg-blue-pale">
    <main class="w-full mx-auto p-6 bg-blue-pale rounded-lg max-w-7xl min-h-screen">
      <!-- 页面标题区域 -->
      <header>
        <PageHero 
          title="Midjourney AI Video & Image Pricing"
          subtitle="Unlock the full power of Midjourney with a plan that scales with your ambition. No hidden fees, cancel anytime."
        />
      </header>

      <!-- 加载状态 -->
      <section v-if="pending" class="flex justify-center items-center py-20 w-full" aria-live="polite">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"
          aria-label="Loading pricing plans"
        ></div>
      </section>

      <!-- 定价方案区域 -->
      <section
        v-else
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto place-items-stretch"
        aria-label="Pricing plans"
      >
        <!-- 循环渲染套餐卡片 -->
        <article
          v-for="(plan, index) in planData"
          :key="index"
          :class="[
            'relative bg-blue-pricing rounded-xl p-6 flex flex-col h-full',
            plan.is_popular
              ? 'border-2 border-blue-button shadow-xl scale-105 z-10'
              : 'border border-blue-pricingborder shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
            plan.price === 0 ? 'hidden md:flex' : 'flex'
          ]"
          :aria-labelledby="`plan-${index}-title`"
        >
          <!-- 热门标签 -->
          <div
            v-if="plan.is_popular"
            class="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-blue-button to-blue-600 text-white text-sm font-semibold rounded-full z-20 shadow-lg"
            aria-label="Most popular plan"
          >
            ⭐ Most Popular
          </div>

          <!-- 套餐标题 -->
          <header class="text-center mb-6">
            <h3 
              :id="`plan-${index}-title`"
              class="text-2xl font-bold text-black mb-3"
            >
              {{ plan.name }}
            </h3>
            <p class="text-blue-pricingtext text-sm leading-relaxed" v-html="plan.description"></p>
          </header>

          <!-- 价格信息 -->
          <div class="mb-6 text-center">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
              <div class="inline-flex items-baseline gap-2">
                <span class="text-4xl font-bold text-blue-button">${{ plan.price }}</span>
                <span class="text-sm text-blue-pricingtext font-medium bg-white px-3 py-1 rounded-full shadow-sm">one-time</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="mb-8">
            <button
              @click="plan.code ? handleUpgradePlan(plan) : null"
              :disabled="upgradingPlanId === plan.code"
              :class="[
                'w-full py-4 px-6 rounded-xl font-semibold text-base flex items-center justify-center transition-all duration-300 transform hover:scale-105',
                getButtonClass(plan),
              ]"
              :aria-describedby="`plan-${index}-title`"
            >
              <div v-if="upgradingPlanId === plan.code" class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" aria-hidden="true"></div>
              {{ plan.button_text }}
            </button>
          </div>

          <!-- 功能特性列表 -->
          <section class="flex-grow" :aria-label="`${plan.name} plan features`">
            <!-- <h4 class="text-sm font-semibold text-black mb-4 text-center">What's included:</h4> -->
            <ul class="space-y-4">
              <li
                v-for="(feature, fIndex) in getPlanFeatures(plan)"
                :key="fIndex"
                class="flex items-start text-blue-pricingtext"
              >
                <span class="mr-3 text-green-500 font-bold text-lg flex-shrink-0 mt-0.5" aria-hidden="true">✅</span>
                <span class="text-sm leading-relaxed" v-html="feature"></span>
              </li>
            </ul>
          </section>
        </article>
      </section>

      <!-- 常见问题区域 -->
      <section 
        class="mt-16 bg-blue-pricing rounded-xl border-2 border-blue-button shadow-lg"
        aria-label="Frequently asked questions about pricing plans"
      >
        <!-- 标题部分 -->
        <header class="px-8 py-6 border-b border-blue-pricingborder">
          <h2 class="text-2xl font-bold text-black mb-2">
            Frequently Asked Questions
          </h2>
          <p class="text-blue-pricingtext">
            Get answers to common questions about our pricing plans and features.
          </p>
        </header>

        <!-- FAQ内容区域 -->
        <div class="p-8 space-y-6">
          <!-- FAQ 1 -->
          <div class="bg-blue-pale rounded-lg p-6 border border-blue-pricingborder">
            <h3 class="text-lg font-semibold text-blue-dark mb-3 flex items-center">
              <i class="fa-solid fa-question-circle text-blue-button mr-3"></i>
              How do the credit packages work?
            </h3>
            <p class="text-blue-pricingtext leading-relaxed">
              Our credit packages are one-time purchases that give you different amounts of credits to use for AI image and video generation. 
              Each package offers better value as you buy more credits - larger packages provide more credits per dollar spent. 
              Simply choose the package size that fits your creative needs and budget.
            </p>
          </div>

          <!-- FAQ 2 -->
          <div class="bg-blue-pale rounded-lg p-6 border border-blue-pricingborder">
            <h3 class="text-lg font-semibold text-blue-dark mb-3 flex items-center">
              <i class="fa-solid fa-question-circle text-blue-button mr-3"></i>
              Do my purchased credits expire?
            </h3>
            <p class="text-blue-pricingtext leading-relaxed">
              No! Your purchased credits never expire and remain in your account until you use them. 
              This means you can use your credits at your own pace without worrying about time limits. 
              Once you buy credits, they're yours to use whenever you want to create amazing AI content.
            </p>
          </div>

          <!-- FAQ 3 -->
          <div class="bg-blue-pale rounded-lg p-6 border border-blue-pricingborder">
            <h3 class="text-lg font-semibold text-blue-dark mb-3 flex items-center">
              <i class="fa-solid fa-question-circle text-blue-button mr-3"></i>
              Can I buy multiple credit packages?
            </h3>
            <p class="text-blue-pricingtext leading-relaxed">
              Yes! You can purchase multiple credit packages at any time to add more credits to your account. 
              All purchased credits will be added to your current balance immediately after payment. 
              This gives you the flexibility to buy credits as needed without being locked into a subscription plan.
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { getSubPlans, payOrder } from "~/api/index";
import { useClerkAuth } from '~/utils/authHelper';
import { useSeo } from '~/composables/useSeo';
import { useAsyncData } from 'nuxt/app';
import PageHero from '~/components/PageHero.vue';

// 定义套餐数据类型
interface PricingPlan {
  name: string;
  description: string;
  price: number;
  code: string;
  button_text: string;
  is_popular: boolean;
  features: string | string[];
}

// 设置SEO
useSeo({
  title: 'Midjourney Pricing - See Free & Paid Subscription Plans',
  description: 'Explore simple Midjourney pricing on Midjourney. Get unlimited AI art & video with V7. No Discord needed. Find the perfect plan and start for free!',
});

// 引入auth认证
const {
  isSignedIn
} = useClerkAuth();

// 用户状态
const upgradingPlanId = ref<string | null>(null);

// 使用useAsyncData获取套餐数据
const { data, pending, error } = await useAsyncData('pricingPlans', async () => {
  try {
    const response = await getSubPlans();
    return response.data as PricingPlan[];
  } catch (err) {
    console.error('Error fetching pricing plans:', err);
    throw err;
  }
}, {
  // immediate: true
});

// 监听数据变化
watch(data, (newData) => {
  console.log('Pricing data updated:', newData);
});

// 计算属性：确保data有值时才返回
const planData = computed(() => {
  return data.value || [];
});

// 获取套餐特性列表
const getPlanFeatures = (plan: PricingPlan): string[] => {
  if (!plan.features) return [];
  // 如果特性是字符串，按逗号分割
  if (typeof plan.features === 'string') {
    return plan.features.split(',').map((feature: string) => feature.trim());
  }
  // 如果已经是数组，直接返回
  return Array.isArray(plan.features) ? plan.features : [];
};

  // 获取按钮样式
const getButtonClass = (plan: PricingPlan): string => {
  if (plan.price === 0) {
    return "bg-gray-100 text-white hover:bg-gray-200";
  } else if (plan.is_popular) {
    return "bg-blue-button text-white hover:bg-blue-buttonhover";
  } else {
    return "bg-blue-button text-white hover:bg-blue-buttonhover";
  }
};

// 处理升级计划
const handleUpgradePlan = async (plan: PricingPlan) => {
  // 如果没有登录，则提示登录并触发登录
  if (!isSignedIn.value) {
    try {
      const loginBtn = document.querySelector('#bindLogin') as HTMLElement;
      if (loginBtn) {
        loginBtn.click();
      }
    } catch (error) {
      console.error("Failed to find login:", error);
    }
    return;
  }

  upgradingPlanId.value = plan.code;
  try {
    const response = (await payOrder({ price_id: plan.code })) as any;
    if (response.code === 200 && response.data?.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error(response.msg || "Failed to create payment order");
    }
  } catch (error) {
    console.error("Payment failed:", error);
  } finally {
    upgradingPlanId.value = null;
  }
};
</script>

<style scoped>
.hover-theme:hover {
  background-color: var(--theme-primary-hover) !important;
  color: #fff !important;
}

.text-theme {
  color: #ec2657;
}
</style> 