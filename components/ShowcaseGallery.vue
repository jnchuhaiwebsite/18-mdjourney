<template>
  <section id="gallery" class="py-24 bg-blue-pale">
    <div class="container mx-auto px-4 text-center max-w-7xl">
      <h2 class="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-blue-h1">
        Proof in Pixels (and Motion)
      </h2>
      <p class="text-xl leading-relaxed max-w-3xl mx-auto mb-16 text-blue-footertext">
        Explore a gallery of incredible works created with our <strong class="text-blue-button">midjourney image to video</strong> tools and the powerful <strong class="text-blue-button">Midjourney V7</strong> engine. This is the quality and creativity you can achieve in seconds.
      </p>
      
      <div class="gallery-container mt-16 columns-1 md:columns-2 lg:columns-3 gap-6">
        <!-- Video Item 1 -->
        <div class="gallery-item mb-6 break-inside-avoid relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group">
          <video 
            autoplay 
            loop 
            muted 
            playsinline 
            src="https://assets.mixkit.co/videos/preview/mixkit-mysterious-fog-in-a-dark-forest-4131-large.mp4" 
            loading="lazy"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          ></video>
          <div class="item-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-4 text-white opacity-0 translate-y-5 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <div class="item-type inline-flex items-center gap-2 text-xs font-bold bg-blue-button px-3 py-1 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              AI VIDEO
            </div>
            <p class="item-prompt text-sm font-medium text-white m-0 leading-relaxed">
              "A mysterious, foggy dark forest at night, cinematic lighting, slow drifting fog"
            </p>
          </div>
        </div>

        <!-- Image Item 1 -->
        <div class="gallery-item mb-6 break-inside-avoid relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group">
          <img 
            src="https://images.unsplash.com/photo-1679083216927-484717013835?q=80&w=800" 
            alt="AI generated art of a cyberpunk warrior" 
            loading="lazy"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          >
          <div class="item-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-4 text-white opacity-0 translate-y-5 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <div class="item-type inline-flex items-center gap-2 text-xs font-bold bg-blue-button px-3 py-1 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              AI IMAGE
            </div>
            <p class="item-prompt text-sm font-medium text-white m-0 leading-relaxed">
              "Portrait of a cyberpunk warrior, neon-drenched alley, hyperrealistic, 85mm lens, Midjourney V7"
            </p>
          </div>
        </div>

        <!-- Image Item 2 -->
        <div class="gallery-item mb-6 break-inside-avoid relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group">
          <img 
            src="https://images.unsplash.com/photo-1674063236906-a36495669074?q=80&w=800" 
            alt="AI generated art of a majestic fantasy landscape" 
            loading="lazy"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          >
          <div class="item-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-4 text-white opacity-0 translate-y-5 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <div class="item-type inline-flex items-center gap-2 text-xs font-bold bg-blue-button px-3 py-1 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              AI IMAGE
            </div>
            <p class="item-prompt text-sm font-medium text-white m-0 leading-relaxed">
              "Vast fantasy landscape with floating islands and waterfalls, style of Studio Ghibli"
            </p>
          </div>
        </div>

        <!-- Video Item 2 -->
        <div class="gallery-item mb-6 break-inside-avoid relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group">
          <video 
            autoplay 
            loop 
            muted 
            playsinline 
            src="https://assets.mixkit.co/videos/preview/mixkit-ripples-on-the-water-of-a-lake-in-the-mountains-4649-large.mp4" 
            loading="lazy"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          ></video>
          <div class="item-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-4 text-white opacity-0 translate-y-5 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <div class="item-type inline-flex items-center gap-2 text-xs font-bold bg-blue-button px-3 py-1 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              AI VIDEO
            </div>
            <p class="item-prompt text-sm font-medium text-white m-0 leading-relaxed">
              "Calm mountain lake at sunset, gentle ripples on the water, subtle mist rising"
            </p>
          </div>
        </div>

        <!-- Additional Demo Items -->
        <div class="gallery-item mb-6 break-inside-avoid relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group">
          <img 
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800" 
            alt="AI generated futuristic city" 
            loading="lazy"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          >
          <div class="item-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-4 text-white opacity-0 translate-y-5 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <div class="item-type inline-flex items-center gap-2 text-xs font-bold bg-blue-button px-3 py-1 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              AI IMAGE
            </div>
            <p class="item-prompt text-sm font-medium text-white m-0 leading-relaxed">
              "Futuristic cityscape at dawn, flying vehicles, glass towers reflecting sunrise"
            </p>
          </div>
        </div>

        <div class="gallery-item mb-6 break-inside-avoid relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group">
          <img 
            src="https://images.unsplash.com/photo-1682687220777-2c60708d6889?q=80&w=800" 
            alt="AI generated portrait" 
            loading="lazy"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          >
          <div class="item-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-4 text-white opacity-0 translate-y-5 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
            <div class="item-type inline-flex items-center gap-2 text-xs font-bold bg-blue-button px-3 py-1 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              AI IMAGE
            </div>
            <p class="item-prompt text-sm font-medium text-white m-0 leading-relaxed">
              "Renaissance portrait with digital glitch effects, classical meets contemporary"
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 可以在这里添加任何需要的响应式数据或方法
// 比如动态加载更多画廊项目，或者从API获取数据
</script>

<style scoped>
/* 瀑布流布局优化 */
.gallery-container {
  column-fill: balance;
}

/* 确保图片/视频完全加载后显示 */
.gallery-item img,
.gallery-item video {
  opacity: 0;
  animation: fadeIn 0.5s ease-in-out 0.2s forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .gallery-container {
    columns: 1 !important;
  }
  
  .gallery-item {
    margin-bottom: 1rem;
  }
}

/* 平板端优化 */
@media (min-width: 768px) and (max-width: 1023px) {
  .gallery-container {
    columns: 2;
  }
}

/* 桌面端优化 */
@media (min-width: 1024px) {
  .gallery-container {
    columns: 3;
  }
}

/* 悬停效果增强 */
.gallery-item {
  transition: all 0.3s ease;
}

.gallery-item:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 类型标签动画 */
.item-type {
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.gallery-item:hover .item-type {
  transform: translateY(0);
}
</style>