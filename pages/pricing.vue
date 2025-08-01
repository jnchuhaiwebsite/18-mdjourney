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
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        aria-label="Pricing plans"
      >
        <!-- 循环渲染套餐卡片 -->
        <article
          v-for="(plan, index) in planData"
          :key="index"
          :class="[
            'bg-blue-pricing rounded-xl p-8 flex flex-col',
            plan.is_popular
              ? 'border-2 border-blue-button shadow-lg'
              : 'border border-blue-pricingborder shadow-sm hover:shadow-md transition-shadow',
            plan.price === 0 ? 'hidden md:flex' : 'flex'
          ]"
          :aria-labelledby="`plan-${index}-title`"
        >
          <!-- 热门标签 -->
          <div
            v-if="plan.is_popular"
              class="absolute -top-3 right-6 px-3 py-1 bg-blue-button text-white text-sm rounded-full"
            aria-label="Most popular plan"
          >
            Most Popular
          </div>

          <!-- 套餐标题 -->
          <header class="mb-6">
            <h3 
              :id="`plan-${index}-title`"
              class="text-2xl font-bold text-black mb-2 font-medium"
            >
              {{ plan.name }}
            </h3>
            <p class="text-blue-pricingtext mb-6">{{ plan.description }}</p>
          </header>

          <!-- 价格信息 -->
          <div class="mb-6">
            <div class="text-3xl font-bold text-black">
              ${{ plan.price }}
              <span class="text-blue-pricingtext text-base font-normal"></span>
            </div>
          </div>

          <!-- 功能特性列表 -->
          <section class="mb-8" :aria-label="`${plan.name} plan features`">
            <ul class="space-y-3">
              <li
                v-for="(feature, fIndex) in getPlanFeatures(plan)"
                :key="fIndex"
                class="flex items-center text-blue-pricingtext"
              >
                <!-- <span class="mr-2 text-theme" aria-hidden="true">✓</span> -->
                {{ feature }}
              </li>
            </ul>
          </section>

          <!-- 操作按钮 -->
          <footer class="mt-auto">
            <button
              @click="plan.code ? handleUpgradePlan(plan) : null"
              :disabled="upgradingPlanId === plan.code"
              :class="[
                'w-full py-3 px-4 rounded-lg flex items-center justify-center',
                getButtonClass(plan),
              ]"
              :aria-describedby="`plan-${index}-title`"
            >
              <div v-if="upgradingPlanId === plan.code" class="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2" aria-hidden="true"></div>
              {{ plan.button_text }}
            </button>
          </footer>
        </article>
      </section>

      <!-- 积分消耗说明区域 -->
      <section 
        class="mt-16 bg-blue-pricing rounded-xl border-2 border-blue-button shadow-lg"
        aria-label="Credit consumption guide"
      >
        <!-- 标题部分 -->
        <header class="px-8 py-6 border-b border-blue-pricingborder">
          <h2 class="text-2xl font-bold text-black mb-2">
            Credit Consumption Guide
          </h2>
          <p class="text-blue-pricingtext">
            Different generation types and speeds consume different amounts of credits. Choose the option that best fits your needs.
          </p>
        </header>

        <!-- 主要内容区域 -->
        <div class="p-8">
          <!-- AI Video Generation -->
          <div class="mb-10">
            <h3 class="text-xl font-semibold text-black mb-4 flex items-center">
              <div class="w-3 h-3 bg-blue-accent rounded-full mr-3"></div>
              AI Video Generation
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-blue-pale rounded-lg p-4 border border-blue-pricingborder hover:border-blue-button transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-blue-dark">Relaxed Mode</span>
                  <span class="text-blue-button font-bold">20 Credits</span>
                </div>
                <p class="text-sm text-blue-pricingtext">
                  Slower generation, best quality output
                </p>
              </div>
              <div class="bg-blue-pale rounded-lg p-4 border border-blue-pricingborder hover:border-blue-button transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-blue-dark">Fast Mode</span>
                  <span class="text-blue-button font-bold">40 Credits</span>
                </div>
                <p class="text-sm text-blue-pricingtext">
                  Balanced speed and quality
                </p>
              </div>
              <div class="bg-blue-pale rounded-lg p-4 border border-blue-pricingborder hover:border-blue-button transition-colors">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-medium text-blue-dark">Turbo Mode</span>
                  <span class="text-blue-button font-bold">70 Credits</span>
                </div>
                <p class="text-sm text-blue-pricingtext">
                  Lightning-fast generation
                </p>
              </div>
            </div>
          </div>

          <!-- Image Generation -->
          <div class="mb-10">
            <h3 class="text-xl font-semibold text-black mb-4 flex items-center">
              <div class="w-3 h-3 bg-blue-medium rounded-full mr-3"></div>
              Image Generation
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Text to Image -->
              <div class="space-y-4">
                <h4 class="font-medium text-blue-dark">Text to Image</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-blue-pale rounded-lg p-3 border border-blue-pricingborder text-center">
                    <div class="font-medium text-blue-dark">Relaxed</div>
                    <div class="text-blue-button font-bold">4 Credits</div>
                  </div>
                  <div class="bg-blue-pale rounded-lg p-3 border border-blue-pricingborder text-center">
                    <div class="font-medium text-blue-dark">Fast</div>
                    <div class="text-blue-button font-bold">8 Credits</div>
                  </div>
                  <div class="bg-blue-pale rounded-lg p-3 border border-blue-pricingborder text-center">
                    <div class="font-medium text-blue-dark">Turbo</div>
                    <div class="text-blue-button font-bold">12 Credits</div>
                  </div>
                </div>
              </div>

              <!-- Image to Image -->
              <div class="space-y-4">
                <h4 class="font-medium text-blue-dark">Image to Image</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div class="bg-blue-pale rounded-lg p-3 border border-blue-pricingborder text-center">
                    <div class="font-medium text-blue-dark">Relaxed</div>
                    <div class="text-blue-button font-bold">4 Credits</div>
                  </div>
                  <div class="bg-blue-pale rounded-lg p-3 border border-blue-pricingborder text-center">
                    <div class="font-medium text-blue-dark">Fast</div>
                    <div class="text-blue-button font-bold">8 Credits</div>
                  </div>
                  <div class="bg-blue-pale rounded-lg p-3 border border-blue-pricingborder text-center">
                    <div class="font-medium text-blue-dark">Turbo</div>
                    <div class="text-blue-button font-bold">12 Credits</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Supported Aspect Ratios -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-black mb-4 flex items-center">
              <div class="w-3 h-3 bg-blue-light rounded-full mr-3"></div>
              Supported Aspect Ratios
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
              <div v-for="ratio in ['2:1', '16:9', '4:3', '3:2', '6:5', '1:1', '5:6', '3:4', '2:3', '9:16']" 
                   :key="ratio"
                   class="bg-blue-pale rounded-lg p-3 border border-blue-pricingborder text-center hover:border-blue-button transition-colors">
                <div class="font-medium text-blue-dark text-sm">{{ ratio }}</div>
              </div>
            </div>
          </div>

          <!-- Pro Tips -->
          <div class="bg-gradient-to-r from-blue-light to-blue-pale rounded-lg p-6 border border-blue-pricingborder">
            <h3 class="text-lg font-semibold text-blue-dark mb-3 flex items-center">
              <i class="fa-solid fa-lightbulb text-blue-button mr-2"></i>
              Pro Tips
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-pricingtext">
              <div class="flex items-start">
                <i class="fa-solid fa-check text-blue-button mr-2 mt-1 text-xs"></i>
                <span>Use <strong>Relaxed Mode</strong> for highest quality when time isn't critical</span>
              </div>
              <div class="flex items-start">
                <i class="fa-solid fa-check text-blue-button mr-2 mt-1 text-xs"></i>
                <span>Choose <strong>Fast Mode</strong> for the perfect balance of speed and quality</span>
              </div>
              <div class="flex items-start">
                <i class="fa-solid fa-check text-blue-button mr-2 mt-1 text-xs"></i>
                <span>Select <strong>Turbo Mode</strong> when you need results immediately</span>
              </div>
              <div class="flex items-start">
                <i class="fa-solid fa-check text-blue-button mr-2 mt-1 text-xs"></i>
                <span>AI Video generation requires more credits due to computational complexity</span>
              </div>
            </div>
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