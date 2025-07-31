<template>
  <section id="gallery" class="py-24 bg-blue-pale">
    <div class="container mx-auto px-4 text-center max-w-7xl">
      <h2 class="text-4xl lg:text-5xl font-extrabold leading-tight mb-6 text-blue-h1">
        Proof in Pixels (and Motion)
      </h2>
      <p class="text-xl leading-relaxed max-w-3xl mx-auto mb-16 text-blue-footertext">
        Explore a gallery of incredible works created with our <strong class="text-blue-button">midjourney image to video</strong> tools and the powerful <strong class="text-blue-button">Midjourney V1</strong> engine. This is the quality and creativity you can achieve in seconds.
      </p>
      
      <div class="gallery-container mt-16">
        <!-- Video Case 1 -->
        <div class="gallery-item relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group cursor-pointer">
          <video 
            ref="video1"
            loop 
            muted 
            playsinline 
            src="https://resp.midjourneyai.net/midjourney/videogenerator/1.mp4" 
            poster="https://resp.midjourneyai.net/midjourney/videogenerator/1.webp"
            loading="lazy"
            preload="metadata"
            @click="togglePlay($event)"
            @mouseenter="playVideo($event)"
            @mouseleave="pauseVideo($event)"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          ></video>
        </div>

        <!-- Video Case 2 -->
        <div class="gallery-item relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group cursor-pointer">
          <video 
            ref="video2"
            loop 
            muted 
            playsinline 
            src="https://resp.midjourneyai.net/midjourney/videogenerator/2.mp4" 
            poster="https://resp.midjourneyai.net/midjourney/videogenerator/2.webp"
            loading="lazy"
            preload="metadata"
            @click="togglePlay($event)"
            @mouseenter="playVideo($event)"
            @mouseleave="pauseVideo($event)"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          ></video>
        </div>

        <!-- Video Case 3 -->
        <div class="gallery-item relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group cursor-pointer">
          <video 
            ref="video3"
            loop 
            muted 
            playsinline 
            src="https://resp.midjourneyai.net/midjourney/videogenerator/3.mp4" 
            poster="https://resp.midjourneyai.net/midjourney/videogenerator/3.webp"
            loading="lazy"
            preload="metadata"
            @click="togglePlay($event)"
            @mouseenter="playVideo($event)"
            @mouseleave="pauseVideo($event)"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          ></video>
        </div>

        <!-- Video Case 4 -->
        <div class="gallery-item relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group cursor-pointer">
          <video 
            ref="video4"
            loop 
            muted 
            playsinline 
            src="https://resp.midjourneyai.net/midjourney/videogenerator/4.mp4" 
            poster="https://resp.midjourneyai.net/midjourney/videogenerator/4.webp"
            loading="lazy"
            preload="metadata"
            @click="togglePlay($event)"
            @mouseenter="playVideo($event)"
            @mouseleave="pauseVideo($event)"
            class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
          ></video>
        </div>
                 <!-- Video Case 5 -->
         <div class="gallery-item relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group cursor-pointer">
           <video 
             ref="video5"
             loop 
             muted 
             playsinline 
             src="https://resp.midjourneyai.net/midjourney/videogenerator/7.mp4" 
             poster="https://resp.midjourneyai.net/midjourney/videogenerator/7.webp"
             loading="lazy"
             preload="metadata"
             @click="togglePlay($event)"
             @mouseenter="playVideo($event)"
             @mouseleave="pauseVideo($event)"
             class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
           ></video>
         </div>

         <!-- Video Case 6 -->
         <div class="gallery-item relative overflow-hidden rounded-2xl shadow-lg bg-blue-pale group cursor-pointer">
           <video 
             ref="video6"
             loop 
             muted 
             playsinline 
             src="https://resp.midjourneyai.net/midjourney/videogenerator/8.mp4" 
             poster="https://resp.midjourneyai.net/midjourney/videogenerator/8.webp"
             loading="lazy"
             preload="metadata"
             @click="togglePlay($event)"
             @mouseenter="playVideo($event)"
             @mouseleave="pauseVideo($event)"
             class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
           ></video>
         </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 视频播放控制函数
const playVideo = (event: Event) => {
  const video = event.target as HTMLVideoElement
  video.play().catch(() => {
    // 静默处理播放错误
  })
}

const pauseVideo = (event: Event) => {
  const video = event.target as HTMLVideoElement
  video.pause()
}

const togglePlay = (event: Event) => {
  const video = event.target as HTMLVideoElement
  if (video.paused) {
    video.play().catch(() => {
      // 静默处理播放错误
    })
  } else {
    video.pause()
  }
}
</script>

<style scoped>
/* 画廊容器居中布局 */
.gallery-container {
  display: grid;
  gap: 1.5rem;
  justify-content: center;
  max-width: fit-content;
  margin: 0 auto;
}

/* 画廊项目样式 */
.gallery-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  width: 300px;
  transition: all 0.3s ease;
}

/* 视频居中显示 */
.gallery-item video {
  width: 100%;
  height: auto;
  display: block;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .gallery-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .gallery-item {
    width: 280px;
  }
}

/* 平板端优化 */
@media (min-width: 768px) and (max-width: 1023px) {
  .gallery-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  .gallery-item {
    width: 280px;
  }
}

/* 桌面端优化 - 每行3个 */
@media (min-width: 1024px) {
  .gallery-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  
  .gallery-item {
    width: 320px;
  }
}

/* 悬停效果增强 */
.gallery-item:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

/* 视频加载状态优化 */
video {
  background-color: #f8fafc;
  border-radius: 1rem;
}

video:hover {
  cursor: pointer;
}
</style>