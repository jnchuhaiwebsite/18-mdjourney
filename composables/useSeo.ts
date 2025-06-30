import { useHead } from '#app'

interface SeoOptions {
  title?: string
  description?: string
  image?: string
  url?: string
}

export const useSeo = (options: SeoOptions = {}) => {
  const defaultTitle = 'Imagen 4 Ultra - Professional AI Image Generation Platform'
  const defaultDescription = 'Create stunning images with Imagen 4 Ultra AI technology. Features customizable aspect ratios, person generation controls, and professional-grade output. Supports English prompts with advanced safety filters.'
  const defaultImage = '/img/imagen4-ultra-og-image.jpg'
  const baseUrl = 'https://imagen4ultra.com'

  const title = options.title || defaultTitle
  const description = options.description || defaultDescription
  const image = options.image || defaultImage
  const url = options.url ? `${baseUrl}${options.url}` : baseUrl

  useHead({
    title,
    meta: [
      {
        name: 'description',
        content: description
      },
      // Open Graph / Facebook
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:title',
        content: title
      },
      {
        property: 'og:description',
        content: description
      },
      {
        property: 'og:image',
        content: image
      },
      {
        property: 'og:url',
        content: url
      },
      // Twitter
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: title
      },
      {
        name: 'twitter:description',
        content: description
      },
      {
        name: 'twitter:image',
        content: image
      },
      // Keywords
      {
        name: 'keywords',
        content: 'Imagen 4 Ultra, AI image generation, aspect ratio customization, person generation controls, English prompts, professional image quality, safety filters, digital watermarking'
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: url
      }
    ]
  })
} 