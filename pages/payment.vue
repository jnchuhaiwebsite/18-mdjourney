<template>
  <div class="min-h-screen bg-blue-pale flex items-center justify-center px-4 pt-12 pb-4">
    <!-- Loading Dots -->
    <div v-if="isLoading" class="flex space-x-3">
      <div class="w-3 h-3 bg-blue-button rounded-full animate-bounce-1 opacity-75"></div>
      <div class="w-3 h-3 bg-blue-button rounded-full animate-bounce-2 opacity-75"></div>
      <div class="w-3 h-3 bg-blue-button rounded-full animate-bounce-3 opacity-75"></div>
    </div>

    <!-- Content -->
    <div v-else-if="paymentStatus" class="w-full max-w-2xl bg-blue-pricing rounded-2xl md:p-8 p-4 text-center shadow-lg border border-blue-pricingborder">
      <div class="max-w-xl mx-auto">
        <!-- 图标 -->
        <div
          :class="[
            'mx-auto w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 md:mb-6',
            paymentStatus === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
          ]"
        >
          <svg v-if="paymentStatus === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-8 md:w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <!-- Title and Description -->
        <h1 class="text-xl md:text-3xl font-bold text-blue-h1 mb-2 md:mb-4">
          {{ paymentStatus === 'success' ? 'Payment Successful!' : 'Payment not successful' }}
        </h1>
        <p class="text-sm md:text-lg text-blue-pricingtext mb-4 md:mb-8">
          {{ paymentStatus === 'success' 
            ? 'Thank you for your support! Your membership benefits are now activated.'
            : 'Payment was not successful. Please return to the home page and place your order again.' }}
        </p>

        <!-- Plan Information (Only show on success) -->
        <div v-if="paymentStatus === 'success' && planInfo" class="md:w-full mx-auto bg-blue-light rounded-xl p-4 md:p-8 mb-4 md:mb-8 border border-blue-pricingborder">
          <div class="grid md:grid-cols-2 gap-4 md:gap-8">
            <!-- Plan Details -->
            <div class="text-left">
              <h2 class="text-base md:text-xl font-semibold text-blue-h1 mb-3 md:mb-6">Plan Details</h2>
              <!-- Mobile: Single line display -->
              <div class="flex justify-between items-center md:hidden">
                <div class="flex flex-col">
                  <span class="text-sm text-blue-pricingtext">Plan Name</span>
                  <span class="text-md text-blue-h1 font-medium">{{ planInfo.name }}</span>
                </div>
                <div class="flex flex-col text-right">
                  <span class="text-sm text-blue-pricingtext">Price</span>
                  <span class="text-md text-blue-h1 font-medium">${{ planInfo.price }}</span>
                </div>
              </div>
              <!-- Desktop: Stacked display -->
              <div class="hidden md:block space-y-4">
                <div class="flex flex-col">
                  <span class="text-blue-pricingtext mb-1">Plan Name</span>
                  <span class="text-lg text-blue-h1 font-medium">{{ planInfo.name }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-blue-pricingtext mb-1">Price</span>
                  <span class="text-lg text-blue-h1 font-medium">${{ planInfo.price }}</span>
                </div>
              </div>
            </div>
            
            <!-- Plan Benefits -->
            <div class="text-left mt-4 md:mt-0">
              <h2 class="text-base md:text-xl font-semibold text-blue-h1 mb-3 md:mb-6">Plan Benefits</h2>
              <ul class="space-y-2 md:space-y-3">
                <li v-for="(feature, index) in getPlanFeatures(planInfo)" 
                    :key="index" 
                    class="flex items-start text-blue-navtext">
                  <span class="mr-2 md:mr-3 flex-shrink-0 w-4 h-4 md:w-5 md:h-5 bg-blue-button/20 rounded-full flex items-center justify-center mt-0.5">
                    <span class="text-blue-button text-xs md:text-sm">✓</span>
                  </span>
                  <span class="text-sm md:text-base">{{ feature }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Back to Home Button -->
        <NuxtLink 
          to="/" 
          class="inline-block bg-blue-button text-blue-buttontext font-medium px-5 py-2 md:px-8 md:py-3 rounded-lg hover:bg-blue-buttonhover transition-colors text-sm md:text-lg">
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSubPlans,getSubplansTest } from '~/api/index'


// Plan information
const planInfo = ref<any>(null)
const paymentStatus = ref<'success' | 'failed' | null>(null)
const isLoading = ref(true)

// Get plan features list
const getPlanFeatures = (plan: any): string[] => {
  if (!plan.features) return [];
  // Split features by newline
  return plan.features.split(',').map((feature: string) => feature.trim());
};

// Get plan information on page load
onMounted(async () => {
  try {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get('level');
    const paySuccess = urlParams.get('paysuccess');
    const payFail = urlParams.get('payfail');
    
    // Set payment status
    if (paySuccess == '1') {
      paymentStatus.value = 'success';
    } else if (payFail == '1') {
      paymentStatus.value = 'failed';
      isLoading.value = false;
      return; // Don't fetch plan info if payment failed
    } else {
      // 跳转回首页套餐模块
      location.replace('/');
      return;
    }

    if (level && paymentStatus.value === 'success') {
      if(level == '99'){
        // Get all plan information
        const response = await getSubplansTest() as any;
        if (response.code === 200 && response.data) {
          planInfo.value = response.data;
        }
        return
      }

      // Get all plan information
      const response = await getSubPlans() as any;
      if (response.code === 200 && response.data) {
        // Find matching plan by level
        const matchedPlan = response.data.find((plan: any) => plan.level === parseInt(level));
        if (matchedPlan) {
          planInfo.value = matchedPlan;
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch plan information:', error);
    paymentStatus.value = 'failed';
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

.animate-bounce-1 {
  animation: bounce 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.animate-bounce-2 {
  animation: bounce 1s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.2s;
}

.animate-bounce-3 {
  animation: bounce 1s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.4s;
}
</style> 