import { useHead } from '#app'

interface SeoOptions {
  title?: string
  description?: string
  image?: string
  url?: string
}

export const useSeo = (options: SeoOptions = {}) => {
  const defaultTitle = 'Veo3-AI Video Generation with Realistic Sound'
  const defaultDescription = 'Veo3 - AI Video Generator with perfect audio synchronization. Create stunning videos with automated sound effects, dialogue, and ambient noise generation.'
  const defaultImage = '/img/veo3-og-image.jpg'
  const baseUrl = 'https://veo3.com'

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
        content: 'Veo3, AI video generation, video creator, realistic sound, audio sync, sound effects'
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