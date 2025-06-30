import { useHead } from '#app'

interface SeoOptions {
  title?: string
  description?: string
  image?: string
  url?: string
}

export const useSeo = (options: SeoOptions = {}) => {
  const defaultTitle = 'Imagen 4 Ultra - Advanced AI Image Generation'
  const defaultDescription = 'Imagen 4 Ultra - Create stunning images with advanced AI technology. Features multi-language support, digital watermarking, and customizable safety settings.'
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
        content: 'Imagen 4 Ultra, AI image generation, digital watermarking, multi-language support, safety settings, prompt rewriting'
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