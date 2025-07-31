<template>
  <section id="how-it-works" class="py-24 bg-blue-pale">
    <div class="container mx-auto px-4 text-center max-w-6xl">
      <h2 class="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-blue-h1">
        Transform Your Art into Motion
      </h2>
      <p class="text-xl leading-relaxed max-w-3xl mx-auto mb-16 text-blue-footertext">
        Unlock the power of our <strong class="text-blue-button">midjourney image to video</strong> technology. 
        We've simplified the complex process of animation into a seamless, three-step workflow that anyone can master.
      </p>
      
      <!-- 三步流程 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
        <!-- Step 1 -->
        <div class="step-card bg-white backdrop-blur-sm p-8 rounded-2xl border border-blue-pricingborder hover:border-blue-button/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
          <!-- 步骤编号 -->
          <div class="w-12 h-12 bg-blue-button rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
            <span class="text-white font-bold text-lg">1</span>
          </div>
          
          <!-- 图标 -->
          <div class="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-button mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <h3 class="text-xl font-bold mb-4 text-blue-h1">
            1. Upload Your Source Image
          </h3>
          <p class="text-blue-footertext text-sm leading-relaxed mb-6">
            Begin with a high-quality image. This can be a piece you generated with our tools or any photo you wish to bring to life.
          </p>
        </div>

        <!-- Step 2 -->
        <div class="step-card bg-white backdrop-blur-sm p-8 rounded-2xl border border-blue-pricingborder hover:border-blue-button/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
          <!-- 步骤编号 -->
          <div class="w-12 h-12 bg-blue-button rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
            <span class="text-white font-bold text-lg">2</span>
          </div>
          
          <!-- 图标 -->
          <div class="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-button mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          
          <h3 class="text-xl font-bold mb-4 text-blue-h1">
            2. Guide the AI
          </h3>
          <p class="text-blue-footertext text-sm leading-relaxed mb-6">
            Provide a simple, descriptive prompt to guide our intelligent <strong class="text-blue-button">midjourney video model</strong>. 
            Use phrases like "slow zoom" or "leaves gently swaying."
          </p>
        </div>

        <!-- Step 3 -->
        <div class="step-card bg-white backdrop-blur-sm p-8 rounded-2xl border border-blue-pricingborder hover:border-blue-button/50 transition-all duration-300 group shadow-lg hover:shadow-xl">
          <!-- 步骤编号 -->
          <div class="w-12 h-12 bg-blue-button rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
            <span class="text-white font-bold text-lg">3</span>
          </div>
          
          <!-- 图标 -->
          <div class="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-button mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h3 class="text-xl font-bold mb-4 text-blue-h1">
            3. Generate & Share
          </h3>
          <p class="text-blue-footertext text-sm leading-relaxed mb-6">
            Our engine processes your request and renders a beautiful video clip in seconds, ready for download and sharing across your platforms.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 可以在这里添加任何需要的响应式数据或方法
</script>

<style scoped>
.step-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.step-card:hover {
  transform: translateY(-4px);
}

/* 响应式动画效果 */
.step-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

.step-card:nth-child(1) {
  animation-delay: 0.1s;
}

.step-card:nth-child(2) {
  animation-delay: 0.2s;
}

.step-card:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>