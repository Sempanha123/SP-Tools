/**
 * Single source of truth for the tool catalogue.
 *
 * Header, footer, homepage grid and /tools all read from here, so adding a tool
 * means editing this file only.
 */

export type ToolCategory = 'image' | 'download'

export interface ToolDefinition {
  slug: string
  name: string
  shortName: string
  href: string
  category: ToolCategory
  tagline: string
  description: string
  /** Inline SVG path data rendered inside a 24×24 viewBox. */
  icon: string
  /** `stroke` for outline icons, `fill` for solid brand glyphs. */
  iconStyle: 'stroke' | 'fill'
  accent: string
  badge?: string
  features: string[]
  available: boolean
}

export const tools: ToolDefinition[] = [
  {
    slug: 'bg-remover',
    name: 'AI Background Remover',
    shortName: 'Background Remover',
    href: '/tools/bg-remover',
    category: 'image',
    tagline: 'Free AI background remover for transparent PNG images.',
    description:
      'Remove image backgrounds online for free and download a transparent PNG with no signup or SP-Tools watermark.',
    icon: 'M4 4h16v16H4zM8 15l2.5-3 2 2 2.5-3 3 4',
    iconStyle: 'stroke',
    accent: 'oklch(0.573 0.208 287)',
    badge: 'Popular',
    features: [
      'Free background removal',
      'Transparent PNG output',
      'JPG, PNG and WEBP input',
    ],
    available: true,
  },
  {
    slug: 'image-upscaler',
    name: 'AI Image Upscaler',
    shortName: 'Image Upscaler',
    href: '/tools/image-upscaler',
    category: 'image',
    tagline: 'Free AI image upscaler for 2× and 4× enlargement.',
    description:
      'Upscale JPG, PNG and WEBP images online by 2× or 4×, compare the result and download without an SP-Tools watermark.',
    icon: 'M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6',
    iconStyle: 'stroke',
    accent: 'oklch(0.606 0.24 310)',
    badge: 'AI',
    features: ['Free 2× and 4× scaling', 'Before/after compare', 'JPG, PNG and WEBP'],
    available: true,
  },
  {
    slug: 'tiktok-download',
    name: 'TikTok Downloader',
    shortName: 'TikTok',
    href: '/download/tiktok-download',
    category: 'download',
    tagline: 'Free TikTok downloader for available MP4, HD and no-watermark options.',
    description:
      'Paste a public TikTok link to resolve available MP4, HD and no-watermark video options.',
    icon: 'M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 15.68a6.34 6.34 0 0011.14 4.12v-7.4a8.3 8.3 0 003.45 1.55v-3.5a5.32 5.32 0 01-2-1.76z',
    iconStyle: 'fill',
    accent: 'oklch(0.7 0.16 195)',
    features: ['HD rendition', 'Watermark-free option', 'Thumbnail and caption'],
    available: true,
  },
  {
    slug: 'facebook-video-download',
    name: 'Facebook Video Downloader',
    shortName: 'Facebook',
    href: '/download/facebook-video-download',
    category: 'download',
    tagline: 'Free Facebook video downloader for public videos and Reels.',
    description:
      'Resolve a public Facebook video or Reel URL and choose from the available video quality options.',
    icon: 'M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.008 10.125 11.927v-8.437H7.078v-3.49h3.047V9.418c0-3.025 1.791-4.697 4.689-4.697 1.358 0 2.782.244 2.782.244v3.074h-1.569c-1.544 0-2.027.963-2.027 1.95v2.341h3.453l-.552 3.49H14v8.437C19.612 23.081 24 18.092 24 12.073z',
    iconStyle: 'fill',
    accent: 'oklch(0.55 0.2 262)',
    features: ['Reels and feed videos', 'Multiple qualities', 'Direct MP4 stream'],
    available: true,
  },
  {
    slug: 'youtube-download',
    name: 'YouTube Downloader',
    shortName: 'YouTube',
    href: '/download/youtube-download',
    category: 'download',
    tagline: 'Free YouTube downloader for ready video and source-audio streams.',
    description:
      'Paste a public YouTube URL to view ready video and source-audio streams without server-side FFmpeg merging.',
    icon: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.016 3.016 0 00.502 6.186C0 8.068 0 12 0 12s0 3.932.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.016 3.016 0 002.122-2.136C24 15.932 24 12 24 12s0-3.932-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
    iconStyle: 'fill',
    accent: 'oklch(0.593 0.216 17)',
    features: ['Ready video streams', 'Source audio streams', 'No FFmpeg conversion'],
    available: true,
  },
]

export const useTools = () => {
  const imageTools = tools.filter((tool) => tool.category === 'image')
  const downloadTools = tools.filter((tool) => tool.category === 'download')

  const findTool = (slug: string) => tools.find((tool) => tool.slug === slug)

  return { tools, imageTools, downloadTools, findTool }
}
