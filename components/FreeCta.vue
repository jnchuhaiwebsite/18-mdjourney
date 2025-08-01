<template>
  <div class="relative min-h-[500px] w-full flex items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-900 to-gray-800">
    <div class="max-w-[800px] w-full bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/50 p-8 sm:p-10 text-center relative overflow-hidden">
      <!-- 标题 -->
      <h2 class="text-4xl font-bricolage-grotesque lg:text-5xl xl:text-6xl 2xl:text-[4rem] bg-gradient-to-r from-[#00ffd1] via-[#00ffd1]/80 via-[#00b8ff] to-[#00ffd1] bg-clip-text text-transparent whitespace-nowrap lg:whitespace-normal text-center mb-8 leading-loose mobile-large-title">
        Start Creating with Midjourney AI Generator
      </h2>

      <!-- 优惠信息卡片 -->
      <div class="bg-gray-700/50 rounded-2xl p-6 mb-8 relative">
        <!-- 装饰性闪光效果 -->
        <div v-for="sparkle in sparkles" :key="sparkle.id"
             class="absolute pointer-events-none sparkle-emoji"
             :style="{
               top: sparkle.top,
               left: sparkle.left,
               'animation-delay': sparkle.animationDelay
             }">
          ✨
        </div>
        
        <!-- 礼物图标和积分数量 -->
        <div class="text-3xl sm:text-4xl font-extrabold mb-2 flex items-center justify-center gap-3 text-white">
          <span class="gift-emoji">🎁</span> 20 Free Credits
        </div>
        <p class="text-gray-300">
          Your gift to start creating instantly. Enough for your first cinematic video!
        </p>
      </div>

      <!-- CTA按钮 -->
      <NuxtLink 
        to="/seedance/free"
        class="block w-full bg-[#00ffd1]/50 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#00ffd1]/20 hover:scale-105 mb-4"
      >
        Claim Your Welcome Gift
      </NuxtLink>

      <!-- 免责声明 -->
      <p class="text-sm text-gray-400">
        No credit card required.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Sparkle {
  id: number;
  top: string;
  left: string;
  animationDelay: string;
}

const sparkles = ref<Sparkle[]>([]);

onMounted(() => {
  const newSparkles: Sparkle[] = [];
  for (let i = 0; i < 6; i++) {
    newSparkles.push({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      animationDelay: `${i * 0.3}s`
    });
  }
  sparkles.value = newSparkles;
});
</script>

<style scoped>
.gift-emoji {
  display: inline-block;
  animation: gift-shake 2.5s infinite ease-in-out;
}

.sparkle-emoji {
  font-size: 1.5rem;
  animation: sparkle-animation 2s infinite ease-out;
  opacity: 0;
}

@keyframes sparkle-animation {
  0% {
    transform: scale(0) translateY(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1.5) translateY(-30px);
    opacity: 0;
  }
}

@keyframes gift-shake {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}
</style>
