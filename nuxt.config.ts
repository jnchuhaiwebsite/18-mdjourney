// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
  ssr: true, // 启用服务端渲染
  compatibilityDate: '2025-05-28', // 兼容性日期
  devtools: { enabled: true }, // 启用 Nuxt DevTools
  css: [
    '~/assets/css/tailwind.css', // Tailwind CSS 样式
    '@/assets/css/main.css', // 主样式文件
  ],
  plugins: [
    // '~/plugins/google-analytics.client.ts', // Google Analytics 插件（仅客户端）
  ],
  runtimeConfig: {
    public: {
      appid: process.env.APPID, // 应用 ID
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL, // 基础URL
    },
  },
  modules: [
    '@clerk/nuxt', // Clerk 集成
    '@pinia/nuxt', // Pinia 状态管理
    '@nuxtjs/tailwindcss', // Tailwind CSS 集成
    '@nuxt/image', // Nuxt Image 模块
  ],
  app: {
    head: {
      title: 'Veo3 | AI Video Generator with Synchronized Audio & Visuals',
      htmlAttrs: {
        lang: 'en' // 设置 HTML 语言
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Veo3 - AI Video Generator with perfect audio synchronization. Create stunning videos with automated sound effects, dialogue, and ambient noise generation.'
        },
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Veo3-AI Video Generation with Realistic Sound' },
        { property: 'og:description', content: 'Create stunning videos with AI-powered sound synchronization. Transform your ideas into professional videos with perfect audio using Veo3.' },
        { property: 'og:image', content: '/img/veo3-og-image.jpg' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Veo3-AI Video Generation with Realistic Sound' },
        { name: 'twitter:description', content: 'Create professional videos with AI-powered sound synchronization. Transform your ideas into stunning videos with perfect audio using Veo3.' },
        { name: 'twitter:image', content: '/img/veo3-og-image.jpg' },
        // Keywords
        { name: 'keywords', content: 'Veo3, AI video generation, video creator, realistic sound, audio sync, sound effects' },
        { name: 'author', content: 'veo3 AI Team' },
        { name: 'application-name', content: 'veo3 AI' },
      ],
      script: [
        { src: '/js/c6h.js', async: true } 
      ], // 外部脚本
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://veo3.com' }
      ]
    }
  },
  routeRules: {
    '/blog': { isr: true, prerender: true },
    '/blog/**': { isr: 60 },
  },
  nitro: {
    preset: 'cloudflare_pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },
    devProxy: {
      '/nuxtRequest': {
        target: process.env.NUXT_PUBLIC_API_BASE, // 从环境变量获取代理目标
        changeOrigin: true, // 允许跨域
        prependPath: false // 不添加代理路径前缀
      }
    },
    // 预渲染
    prerender: {
      // 预渲染路由
      routes: [
        // '/blog',
        '/subsidiary/privacy-policy',
        '/subsidiary/terms-of-service'
      ],
      crawlLinks: false,
      autoSubfolderIndex: false,
      failOnError: false,
      ignore: [
        '/api/**', // 忽略 API 路由
        '/admin/**' // 忽略管理后台路由
      ]
    },
  },
  // Nuxt3正确的Tailwind配置
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.ts',
    exposeConfig: false,
    viewer: false,
  },
  // 使用vite的正确配置方式
  vite: {
    build: {
      cssCodeSplit: true,
      // 强制提取CSS到单独文件
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.endsWith('.css')) {
              return '_nuxt/css/[name]-[hash][extname]';
            }
            return '_nuxt/assets/[name]-[hash][extname]';
          }
        }
      }
    },
    // 确保CSS的sourcemap
    css: {
      devSourcemap: true
    }
  },
  build: {
    analyze: true, // 启用打包分析
    // 代码压缩配置
    terser: {
      compress: {
        drop_console: true, // 移除 console 语句
        drop_debugger: true, // 移除 debugger 语句
        pure_funcs: ['console.log', 'console.info'], // 移除特定的函数调用
        passes: 3, // 增加压缩次数
        dead_code: true, // 移除未使用的代码
        global_defs: {
          'process.env.NODE_ENV': 'production' // 定义全局变量
        }
      },
      mangle: true, // 混淆变量名
      output: {
        comments: false // 移除注释
      }
    }
  },
  // 强制CSS提取的配置
  experimental: {
    // 强制禁用内联样式，将样式提取到外部文件
    inlineSSRStyles: false,
    // 启用vite特性兼容
    viteNode: true
  },
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark',
  },
})