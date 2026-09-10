export type SpToolSeoSlug =
  | 'bg-remover'
  | 'image-upscaler'
  | 'tiktok-download'
  | 'facebook-video-download'
  | 'youtube-download'

export interface SpToolSeoFaq {
  question: string
  answer: string
}

export interface SpToolSeoStep {
  title: string
  text: string
}

export interface SpToolSeoCard {
  title: string
  text: string
}

export interface SpToolSeoRelated {
  href: string
  name: string
  text: string
}

export interface SpToolSeoConfig {
  slug: SpToolSeoSlug
  toolName: string
  seoTitle: string
  metaDescription: string
  primaryKeyword: string
  keywords: string[]
  eyebrow: string
  heading: string
  quickAnswer: string
  intro: string[]
  benefitsTitle: string
  benefits: SpToolSeoCard[]
  stepsTitle: string
  steps: SpToolSeoStep[]
  detailsTitle: string
  details: string[]
  useCasesTitle: string
  useCases: string[]
  faqTitle: string
  faqs: SpToolSeoFaq[]
  related: SpToolSeoRelated[]
}

export const spToolSeoContent:
  Record<
    SpToolSeoSlug,
    SpToolSeoConfig
  > = {
  'bg-remover': {
    slug: 'bg-remover',
    toolName: 'SP-Tools Free AI Background Remover',
    seoTitle:
      'Free AI Background Remover Online – Transparent PNG | SP-Tools',
    metaDescription:
      'Free AI background remover online. Upload JPG, PNG or WEBP, remove the background, and download a transparent PNG with no signup and no SP-Tools watermark.',
    primaryKeyword:
      'free AI background remover',
    keywords: [
      'free background remover',
      'AI background remover',
      'remove background from image',
      'remove bg online',
      'transparent PNG maker',
      'photo background remover',
      'background eraser online',
      'background remover no watermark',
      '100% free background remover',
      'free background remover no signup',
      'free AI background remover no watermark',
      'remove background free online',
      'remove image background free',
      'transparent background tool',
    ],
    eyebrow:
      'Free AI image tool',
    heading:
      'Free AI background remover for transparent PNG images',
    quickAnswer:
      'Upload a JPG, PNG or WEBP image, let SP-Tools isolate the main subject, preview the cutout, and download a transparent PNG. The core tool is free to use, requires no account, and adds no SP-Tools watermark.',
    intro: [
      'SP-Tools is a free AI background remover built for quick cutouts of people, products, pets, objects and everyday photos. Instead of manually tracing around a subject, you can add an image and get a transparent-background result that is ready for design, ecommerce, social media, presentations or another editor.',
      'The page is designed around the search tasks people actually need: remove a background from an image, make a transparent PNG, isolate a product photo, erase a photo background, or prepare a clean cutout without installing desktop software.',
    ],
    benefitsTitle:
      'What this free background remover can do',
    benefits: [
      {
        title:
          'Create transparent PNG files',
        text:
          'The result keeps transparency so the subject can be placed over a new color, image, slide, thumbnail or product layout.',
      },
      {
        title:
          'Work with common image formats',
        text:
          'Use JPG, PNG or WEBP source images and download the processed result as a transparent PNG.',
      },
      {
        title:
          'Remove backgrounds without a watermark',
        text:
          'SP-Tools does not place a branded watermark on the transparent PNG you download.',
      },
      {
        title:
          'Compare before and after',
        text:
          'Use the result preview to compare the original image with the transparent cutout before saving it.',
      },
    ],
    stepsTitle:
      'How to remove an image background online for free',
    steps: [
      {
        title:
          'Upload your image',
        text:
          'Choose a JPG, PNG or WEBP photo from your device. Clear, well-lit subjects usually produce the easiest edges to review.',
      },
      {
        title:
          'Let the AI remove the background',
        text:
          'SP-Tools separates the main subject from the surrounding background and prepares a transparent result.',
      },
      {
        title:
          'Preview and download the PNG',
        text:
          'Check the before-and-after preview, then download the transparent PNG and use it in your next design.',
      },
    ],
    detailsTitle:
      'Background removal for products, portraits and creative work',
    details: [
      'A transparent background is useful when a photo needs to fit many layouts. Product sellers can isolate an item before placing it on a clean store background. Creators can prepare portraits for thumbnails, profile graphics and social posts. Students and office users can make presentation assets that sit naturally over slides instead of carrying a rectangular photo background.',
      'Background removal works best when the foreground subject is visually distinct from the background. Hair, fur, glass, shadows and similarly colored edges can be more difficult than a simple product on a plain wall, so always review the preview before using the final image.',
    ],
    useCasesTitle:
      'Popular background-removal uses',
    useCases: [
      'Transparent product photos for shops and catalog layouts',
      'Profile pictures, avatars and social media graphics',
      'YouTube thumbnails, posters and promotional artwork',
      'Presentation cutouts for slides and school projects',
      'Sticker-style PNG assets with transparent backgrounds',
      'Portrait, pet and object cutouts for photo editing',
    ],
    faqTitle:
      'Free background remover questions',
    faqs: [
      {
        question:
          'Is the SP-Tools AI background remover free?',
        answer:
          'Yes. The core background-removal tool is free to use and does not require an account to process and download a result.',
      },
      {
        question:
          'Can I remove a background without a watermark?',
        answer:
          'Yes. SP-Tools does not add a branded watermark to the transparent PNG it creates.',
      },
      {
        question:
          'What file types can I use?',
        answer:
          'The tool accepts common JPG, PNG and WEBP images. The processed cutout is downloaded as PNG so transparency can be preserved.',
      },
      {
        question:
          'How do I make the background of a photo transparent?',
        answer:
          'Upload the photo, wait for the subject to be isolated, review the preview, and download the PNG. The transparent area can then be placed over another background in a compatible editor.',
      },
      {
        question:
          'Does background removal work for people and product photos?',
        answer:
          'Yes. It can be useful for portraits, people, products, pets and many everyday objects. Results vary with lighting, contrast and edge complexity.',
      },
      {
        question:
          'Why do hair or fine edges sometimes need extra review?',
        answer:
          'Fine hair, fur, transparent materials and low-contrast edges are harder to separate from a background. Review the result at full size before using it.',
      },
      {
        question:
          'Can I use the transparent PNG in Canva, Photoshop or slides?',
        answer:
          'Yes. A PNG with transparency can be imported into most modern design, presentation and photo-editing tools.',
      },
      {
        question:
          'Do I need to install software?',
        answer:
          'No. SP-Tools is an online tool that runs from a supported web browser.',
      },
    ],
    related: [
      {
        href:
          '/tools/image-upscaler',
        name:
          'Free AI Image Upscaler',
        text:
          'Increase image resolution 2× or 4× after preparing a clean cutout.',
      },
      {
        href:
          '/download/youtube-download',
        name:
          'YouTube Downloader',
        text:
          'Review available video or audio streams for content you are allowed to save.',
      },
      {
        href:
          '/download/tiktok-download',
        name:
          'TikTok Downloader',
        text:
          'Resolve available TikTok MP4 options for content you have permission to download.',
      },
    ],
  },

  'image-upscaler': {
    slug: 'image-upscaler',
    toolName: 'SP-Tools Free AI Image Upscaler',
    seoTitle:
      'Free AI Image Upscaler Online – Enlarge 2× or 4× | SP-Tools',
    metaDescription:
      'Free AI image upscaler online. Enlarge JPG, PNG or WEBP images by 2× or 4×, compare the result, and download with no signup or SP-Tools watermark.',
    primaryKeyword:
      'free AI image upscaler',
    keywords: [
      'free image upscaler',
      'AI image upscaler',
      'upscale image online',
      'upscale image 4x',
      'increase image resolution',
      'image enlarger online',
      'photo upscaler',
      'AI photo enhancer',
      'upscale JPG PNG WEBP',
      'image upscaler no watermark',
      '100% free image upscaler',
      'free image upscaler no signup',
      'free AI photo upscaler online',
      'upscale image free online',
    ],
    eyebrow:
      'Free AI image tool',
    heading:
      'Free AI image upscaler for 2× and 4× enlargement',
    quickAnswer:
      'Choose a JPG, PNG or WEBP image, select 2× or 4×, run the AI upscaler, compare the result with the original, and download the enlarged image. The core tool is free and does not add an SP-Tools watermark.',
    intro: [
      'The SP-Tools free AI image upscaler is built for people who need a larger image without simply stretching the original pixels. It can increase image dimensions by 2× or 4× and is useful for photos, product images, social graphics, artwork, screenshots and older low-resolution files.',
      'Common search tasks such as upscale image online, increase image resolution, enlarge a photo, enhance a small image, or make a picture bigger all point to the same goal: create a more useful high-resolution version while keeping the image visually coherent.',
    ],
    benefitsTitle:
      'What the free AI image upscaler can do',
    benefits: [
      {
        title:
          'Upscale images by 2×',
        text:
          'Use 2× for a practical balance between larger dimensions, processing time and memory use.',
      },
      {
        title:
          'Upscale smaller images by 4×',
        text:
          'Use 4× when you need a larger result and the source image is within the page limits.',
      },
      {
        title:
          'Compare original and upscaled versions',
        text:
          'The before-and-after view makes it easier to inspect edges, texture and overall sharpness before downloading.',
      },
      {
        title:
          'Download without an SP-Tools watermark',
        text:
          'The saved image is not stamped with an SP-Tools promotional watermark.',
      },
    ],
    stepsTitle:
      'How to upscale an image online for free',
    steps: [
      {
        title:
          'Choose a JPG, PNG or WEBP image',
        text:
          'Upload the photo or graphic you want to enlarge. Smaller source images are usually better suited to 4× processing.',
      },
      {
        title:
          'Select 2× or 4×',
        text:
          'Choose 2× for most images or 4× when you need more output pixels and the original is small enough.',
      },
      {
        title:
          'Compare and download',
        text:
          'Review the upscaled result beside the original, switch scale if needed, and download the final image.',
      },
    ],
    detailsTitle:
      'AI upscaling versus ordinary image resizing',
    details: [
      'A normal resize enlarges the existing pixel grid and can make a small image look softer. An AI upscaler uses a learned image model to reconstruct a larger result that can look more detailed than basic interpolation. It cannot recover every real-world detail that was missing from the source, so the preview remains important.',
      'Upscaling is useful when an image is too small for a layout, product card, social post, presentation, thumbnail or larger display. For text-heavy screenshots or tiny faces, always compare the result carefully because AI enhancement may interpret uncertain details differently from the source.',
    ],
    useCasesTitle:
      'Popular image-upscaling uses',
    useCases: [
      'Enlarge product photos for ecommerce layouts',
      'Improve small images before using them in presentations',
      'Prepare social media images and thumbnails at larger dimensions',
      'Upscale artwork, illustrations and older digital images',
      'Increase resolution before cropping part of an image',
      'Create a larger version of a JPG, PNG or WEBP image',
    ],
    faqTitle:
      'Free AI image upscaler questions',
    faqs: [
      {
        question:
          'Is the SP-Tools image upscaler free?',
        answer:
          'Yes. The core 2× and 4× image-upscaling tool is free to use and does not require a paid API key from the visitor.',
      },
      {
        question:
          'Can I upscale an image to 4×?',
        answer:
          'Yes, for source images within the tool limits. Because 4× creates many more output pixels, it works best with smaller input images.',
      },
      {
        question:
          'What is the difference between 2× and 4× upscaling?',
        answer:
          '2× doubles the width and height, while 4× multiplies both dimensions by four. A 4× result therefore contains much more pixel data and needs more processing.',
      },
      {
        question:
          'Which image formats are supported?',
        answer:
          'JPG, PNG and WEBP images are supported by the current upscaler page.',
      },
      {
        question:
          'Does the upscaled image have a watermark?',
        answer:
          'SP-Tools does not add a promotional watermark to the downloaded upscaled image.',
      },
      {
        question:
          'Can AI make every blurry photo perfectly sharp?',
        answer:
          'No. AI can create a more useful enlarged result, but it cannot guarantee recovery of real detail that was never present in the original file.',
      },
      {
        question:
          'Which scale should I choose first?',
        answer:
          'Start with 2× for most images. Try 4× when the original is small and you specifically need more output pixels.',
      },
      {
        question:
          'Do I need to install an app?',
        answer:
          'No. The upscaler is available as an online SP-Tools page in a supported browser.',
      },
    ],
    related: [
      {
        href:
          '/tools/bg-remover',
        name:
          'Free AI Background Remover',
        text:
          'Create a transparent PNG before or after enlarging an image.',
      },
      {
        href:
          '/download/facebook-video-download',
        name:
          'Facebook Video Downloader',
        text:
          'Resolve public Facebook video or Reel formats when you have permission to save them.',
      },
      {
        href:
          '/download/tiktok-download',
        name:
          'TikTok Downloader',
        text:
          'Review available TikTok video formats from a supported public link.',
      },
    ],
  },

  'tiktok-download': {
    slug: 'tiktok-download',
    toolName: 'SP-Tools Free TikTok Downloader',
    seoTitle:
      'Free TikTok Video Downloader – HD & No Watermark | SP-Tools',
    metaDescription:
      'Free TikTok downloader online for public links. Resolve available MP4, HD and no-watermark options with no SP-Tools signup required.',
    primaryKeyword:
      'free TikTok video downloader',
    keywords: [
      'TikTok downloader',
      'free TikTok downloader',
      'TikTok video downloader',
      'download TikTok video',
      'TikTok downloader without watermark',
      'TikTok no watermark download',
      'TikTok MP4 downloader',
      'TikTok HD download',
      'save TikTok video',
      'download TikTok MP4',
      'free TikTok downloader online',
      'TikTok downloader free no signup',
      'free TikTok MP4 downloader',
      'free TikTok HD downloader',
    ],
    eyebrow:
      'Free social video tool',
    heading:
      'Free TikTok downloader for available MP4 and HD video',
    quickAnswer:
      'Paste a public TikTok link into SP-Tools to resolve the available MP4 options, including no-watermark or HD versions when the source service provides them. Choose the format you want and save only content you own or have permission to download.',
    intro: [
      'The SP-Tools TikTok downloader is designed for a simple workflow: paste a TikTok video URL, resolve the public media information, review the available formats, and choose the version you need. The page can show the video thumbnail, creator information, caption and available download choices.',
      'High-intent searches around TikTok downloader, download TikTok video, TikTok MP4 downloader, HD TikTok download and TikTok downloader without watermark all describe variations of this same task. SP-Tools keeps those options on one focused page rather than sending users through unrelated conversion screens.',
    ],
    benefitsTitle:
      'What the free TikTok downloader can show',
    benefits: [
      {
        title:
          'Available MP4 video',
        text:
          'Resolve a standard MP4 source when the public TikTok link and upstream resolver provide one.',
      },
      {
        title:
          'HD option when available',
        text:
          'If a higher-quality source is returned, SP-Tools presents it as a separate choice.',
      },
      {
        title:
          'No-watermark option when available',
        text:
          'A no-watermark rendition can be shown when the resolver returns one for that public TikTok URL.',
      },
      {
        title:
          'Thumbnail and caption context',
        text:
          'Preview the resolved post information before choosing a media link.',
      },
    ],
    stepsTitle:
      'How to download a TikTok video with SP-Tools',
    steps: [
      {
        title:
          'Copy a public TikTok video URL',
        text:
          'Open the TikTok post and copy its share link. Private, deleted or restricted posts may not resolve.',
      },
      {
        title:
          'Paste the link into the TikTok downloader',
        text:
          'SP-Tools reads the public media information and lists the video choices that are currently available.',
      },
      {
        title:
          'Choose the permitted version you need',
        text:
          'Select the available MP4, HD or no-watermark option and save content only when you have the right to do so.',
      },
    ],
    detailsTitle:
      'TikTok MP4, HD and no-watermark availability',
    details: [
      'Not every TikTok URL returns the same set of formats. One post may expose standard MP4 and HD choices while another may have fewer options. Media links can also expire, so resolving the post again is useful if an older download link stops working.',
      'SP-Tools is a resolver interface rather than a promise that every TikTok post can be downloaded. Private accounts, removed videos, region restrictions and upstream changes can prevent a link from resolving.',
    ],
    useCasesTitle:
      'Common TikTok downloader searches',
    useCases: [
      'Download a TikTok MP4 from a public post you are allowed to save',
      'Choose an HD TikTok video when an HD source is available',
      'Review a no-watermark option when the resolver provides one',
      'Save your own TikTok content for editing or archiving',
      'Check the thumbnail and caption before selecting a file',
      'Resolve a new media URL after an older temporary link expires',
    ],
    faqTitle:
      'TikTok downloader questions',
    faqs: [
      {
        question:
          'Is the SP-Tools TikTok downloader free?',
        answer:
          'Yes. The current TikTok resolver can be used without a paid visitor account. Availability still depends on the public source and upstream resolver.',
      },
      {
        question:
          'Can it download TikTok without a watermark?',
        answer:
          'When the resolver returns a no-watermark source, SP-Tools shows it as an available choice. Some posts may not return every format.',
      },
      {
        question:
          'Can I download TikTok videos in HD?',
        answer:
          'An HD option is shown when a higher-quality source is available for the resolved public post.',
      },
      {
        question:
          'Why does a TikTok link sometimes stop working?',
        answer:
          'Resolved media URLs can be temporary. Paste the original TikTok post URL again to request fresh media links.',
      },
      {
        question:
          'Why can a TikTok video fail to resolve?',
        answer:
          'The post may be private, deleted, restricted, unavailable in the current region, or the upstream page may have changed.',
      },
      {
        question:
          'Do I need a TikTok account to use SP-Tools?',
        answer:
          'SP-Tools does not require you to create an SP-Tools account for the downloader, but only publicly resolvable links are supported.',
      },
      {
        question:
          'Can I use the downloader on mobile?',
        answer:
          'Yes, the page is designed to work in modern mobile browsers as well as desktop browsers.',
      },
      {
        question:
          'Can I download any TikTok video?',
        answer:
          'Only download content you own or have permission to save, and follow applicable copyright rules and platform terms.',
      },
    ],
    related: [
      {
        href:
          '/download/facebook-video-download',
        name:
          'Free Facebook Video Downloader',
        text:
          'Resolve available public Facebook video and Reel formats.',
      },
      {
        href:
          '/download/youtube-download',
        name:
          'Free YouTube Video & Audio Downloader',
        text:
          'Review ready YouTube video and source-audio streams for permitted content.',
      },
      {
        href:
          '/tools/bg-remover',
        name:
          'Free AI Background Remover',
        text:
          'Create transparent PNG graphics for thumbnails and social posts.',
      },
    ],
  },

  'facebook-video-download': {
    slug: 'facebook-video-download',
    toolName: 'SP-Tools Free Facebook Video Downloader',
    seoTitle:
      'Free Facebook Video Downloader – Reels & HD MP4 | SP-Tools',
    metaDescription:
      'Free Facebook video downloader online for permitted public videos and Reels. Paste a link, review available qualities, and save the MP4 you need.',
    primaryKeyword:
      'free Facebook video downloader',
    keywords: [
      'Facebook video downloader',
      'free Facebook video downloader',
      'download Facebook video',
      'Facebook Reel downloader',
      'FB video downloader',
      'Facebook MP4 downloader',
      'Facebook HD video download',
      'save Facebook Reels',
      'download Facebook Reel',
      'Facebook video download online',
      'free Facebook downloader online',
      'Facebook Reels downloader free',
      'free FB video downloader',
      'Facebook video downloader no signup',
    ],
    eyebrow:
      'Free social video tool',
    heading:
      'Free Facebook video downloader for public videos and Reels',
    quickAnswer:
      'Paste a public Facebook video or Reel URL, let SP-Tools resolve the available media sources, choose the quality that is available, and save only content you own or have permission to download.',
    intro: [
      'The SP-Tools Facebook video downloader is focused on public Facebook media. It reads a supported public video or Reel link, shows resolved post information, and presents the available video quality options without requiring a separate desktop downloader.',
      'Searches such as Facebook video downloader, Facebook Reel downloader, download Facebook video, FB video downloader and Facebook MP4 downloader usually come from users who already have a specific public link. This page is structured around that direct workflow.',
    ],
    benefitsTitle:
      'What the Facebook downloader can do',
    benefits: [
      {
        title:
          'Resolve public Facebook videos',
        text:
          'Use direct public Facebook video URLs that expose a media source without requiring a signed-in private session.',
      },
      {
        title:
          'Support public Reels when available',
        text:
          'Public Reel links can be resolved when Facebook exposes a usable video source for the request.',
      },
      {
        title:
          'Show available quality choices',
        text:
          'SP-Tools collapses repeated sources so the result list stays focused on meaningful quality options.',
      },
      {
        title:
          'Keep the download workflow on SP-Tools',
        text:
          'The current interface prepares the download without forcing the user to browse through unrelated pages.',
      },
    ],
    stepsTitle:
      'How to download a public Facebook video or Reel',
    steps: [
      {
        title:
          'Copy the public Facebook link',
        text:
          'Use the share link for a public video, Watch page or Reel that can be viewed without a private account session.',
      },
      {
        title:
          'Paste the URL into SP-Tools',
        text:
          'The resolver checks the public page and looks for usable media sources and post metadata.',
      },
      {
        title:
          'Choose an available video quality',
        text:
          'Select the quality you need and save the file only when you have permission to download the content.',
      },
    ],
    detailsTitle:
      'Why some Facebook videos resolve and others do not',
    details: [
      'Facebook does not expose every post in the same way. Public videos and Reels are the best candidates. Friends-only posts, private groups, login-only pages, deleted content and region-restricted media may not expose a downloadable public source.',
      'Facebook can also return multiple signed URLs for the same quality. SP-Tools reduces duplicate choices so users do not see a long list of nearly identical rows.',
    ],
    useCasesTitle:
      'Common Facebook video downloader uses',
    useCases: [
      'Save your own public Facebook video for an editing workflow',
      'Download a permitted public Facebook Reel',
      'Choose an available HD source when one is exposed',
      'Resolve a fresh source link when a previous signed URL expires',
      'Review the post thumbnail and title before downloading',
      'Use a browser-based Facebook MP4 downloader without installing an app',
    ],
    faqTitle:
      'Facebook video downloader questions',
    faqs: [
      {
        question:
          'Is the SP-Tools Facebook video downloader free?',
        answer:
          'Yes. The current public-video resolver is free to use without creating a paid visitor account.',
      },
      {
        question:
          'Can it download Facebook Reels?',
        answer:
          'Public Reels can work when Facebook exposes a usable video source. Private or login-only Reels are not supported.',
      },
      {
        question:
          'Can I download Facebook video in HD?',
        answer:
          'SP-Tools shows an HD choice when the public Facebook response includes a higher-quality source.',
      },
      {
        question:
          'Why does a public Facebook link sometimes fail?',
        answer:
          'Facebook may require sign-in, change its public page format, restrict the content, or stop exposing a direct media source.',
      },
      {
        question:
          'Why are private Facebook posts not supported?',
        answer:
          'SP-Tools does not attempt to bypass private-account or login restrictions. The resolver is intended for publicly accessible media.',
      },
      {
        question:
          'Can a resolved Facebook download link expire?',
        answer:
          'Yes. Facebook CDN URLs can be signed and temporary. Resolve the original post again when an old source stops working.',
      },
      {
        question:
          'Does it work on phones?',
        answer:
          'The page is responsive and can be used from modern mobile browsers, although the final save behavior depends on the browser and operating system.',
      },
      {
        question:
          'Can I download any Facebook video?',
        answer:
          'Only save content you own or have permission to download, and respect copyright and applicable platform terms.',
      },
    ],
    related: [
      {
        href:
          '/download/tiktok-download',
        name:
          'Free TikTok Downloader',
        text:
          'Resolve available TikTok MP4, HD and no-watermark options.',
      },
      {
        href:
          '/download/youtube-download',
        name:
          'Free YouTube Video & Audio Downloader',
        text:
          'Review ready YouTube video and source-audio streams.',
      },
      {
        href:
          '/tools/image-upscaler',
        name:
          'Free AI Image Upscaler',
        text:
          'Increase the size of thumbnail or social graphics by 2× or 4×.',
      },
    ],
  },

  'youtube-download': {
    slug: 'youtube-download',
    toolName: 'SP-Tools Free YouTube Video & Audio Downloader',
    seoTitle:
      'Free YouTube Video & Audio Downloader Online | SP-Tools',
    metaDescription:
      'Free YouTube video and audio downloader online. View ready video and source-audio streams from a public URL and save permitted content without SP-Tools signup.',
    primaryKeyword:
      'free YouTube video downloader',
    keywords: [
      'YouTube downloader',
      'free YouTube downloader',
      'YouTube video downloader',
      'YouTube audio downloader',
      'download YouTube video',
      'YouTube MP4 downloader',
      'YouTube audio download',
      'save YouTube video',
      'download YouTube audio',
      'YouTube download online',
      'free YouTube downloader online',
      'YouTube downloader free no signup',
      'free YouTube audio downloader',
      'free YouTube MP4 downloader',
    ],
    eyebrow:
      'Free video and audio tool',
    heading:
      'Free YouTube video and audio downloader for available streams',
    quickAnswer:
      'Paste a public YouTube watch, Shorts or youtu.be link to see the ready video formats and source-audio streams SP-Tools can resolve. Choose an available stream and save only content you own or have permission to download.',
    intro: [
      'The SP-Tools YouTube downloader separates the job into two clear choices: ready video streams and source-audio streams. The page resolves a supported public YouTube URL, shows the video title, channel, thumbnail and duration, then lists the formats that are currently usable without running a heavy video conversion pipeline.',
      'High-intent searches such as YouTube downloader, YouTube video downloader, YouTube audio downloader, download YouTube video, YouTube MP4 downloader and download YouTube audio are covered naturally by the page content and format controls.',
    ],
    benefitsTitle:
      'What the free YouTube downloader can show',
    benefits: [
      {
        title:
          'Ready video streams',
        text:
          'The Video tab lists progressive formats that already contain video and audio together when YouTube exposes them.',
      },
      {
        title:
          'Source-audio streams',
        text:
          'The Audio tab lists available source audio such as M4A or WebM rather than pretending every stream is an MP3 conversion.',
      },
      {
        title:
          'Video details before download',
        text:
          'Review the title, channel, thumbnail, duration and available format count before choosing a stream.',
      },
      {
        title:
          'No server-side FFmpeg conversion',
        text:
          'The current downloader avoids CPU-heavy merging and transcoding, which keeps the format behavior predictable for a lightweight service.',
      },
    ],
    stepsTitle:
      'How to download a permitted YouTube video or audio stream',
    steps: [
      {
        title:
          'Copy a public YouTube URL',
        text:
          'Use a watch URL, Shorts URL or youtu.be link for content that is publicly accessible.',
      },
      {
        title:
          'Paste the link and resolve formats',
        text:
          'SP-Tools reads the available ready video and source-audio streams and displays the usable choices.',
      },
      {
        title:
          'Choose video or audio',
        text:
          'Select the stream you need and save it only when you own the content or otherwise have permission to download it.',
      },
    ],
    detailsTitle:
      'Why 1080p, 1440p or 4K may not appear as a normal video choice',
    details: [
      'YouTube often serves high-resolution video and audio as separate adaptive tracks. SP-Tools currently avoids server-side FFmpeg merging, so it does not label a silent video-only track as a normal ready-to-watch download. The Video tab focuses on formats where video and audio are already together.',
      'The Audio tab keeps the source format instead of converting every file to MP3. Depending on the video, the available audio may be M4A or WebM. This is more accurate than promising an MP3 when no MP3 conversion is being performed.',
    ],
    useCasesTitle:
      'Common YouTube downloader uses',
    useCases: [
      'Save your own YouTube upload for a permitted editing workflow',
      'Download an available combined video stream',
      'Save a source-audio stream when you have permission to use it',
      'Check which ready resolutions are exposed for a public video',
      'Review title, channel, thumbnail and duration before downloading',
      'Use a browser-based YouTube downloader without installing desktop software',
    ],
    faqTitle:
      'YouTube video and audio downloader questions',
    faqs: [
      {
        question:
          'Is the SP-Tools YouTube downloader free?',
        answer:
          'Yes. The current resolver can be used without a paid visitor account. Availability depends on the public YouTube response and the selected stream.',
      },
      {
        question:
          'Why do I sometimes only see 360p or 720p video?',
        answer:
          'YouTube often separates higher-resolution video from audio. SP-Tools currently lists ready progressive video streams that already contain audio instead of merging separate tracks on the server.',
      },
      {
        question:
          'Can SP-Tools download YouTube audio?',
        answer:
          'It can list and save supported source-audio streams when YouTube exposes a usable audio URL for the selected video.',
      },
      {
        question:
          'Is the audio always MP3?',
        answer:
          'No. SP-Tools does not currently transcode audio to MP3. The source may be M4A or WebM depending on what YouTube provides.',
      },
      {
        question:
          'Why is 1080p or 4K sometimes missing?',
        answer:
          'Those resolutions are commonly provided as video-only adaptive tracks and need a separate audio merge. The lightweight SP-Tools downloader does not currently run that heavy merge step.',
      },
      {
        question:
          'Which YouTube links are supported?',
        answer:
          'Public watch links, Shorts links and youtu.be links are supported when the video information and streams are publicly resolvable.',
      },
      {
        question:
          'Why can a YouTube stream fail after it was listed?',
        answer:
          'Media URLs can change or expire. Resolve the original YouTube URL again to request a fresh set of stream options.',
      },
      {
        question:
          'Can I download any YouTube video?',
        answer:
          'Only download content you own or have permission to save, and follow applicable copyright rules and platform terms.',
      },
    ],
    related: [
      {
        href:
          '/download/tiktok-download',
        name:
          'Free TikTok Downloader',
        text:
          'Resolve available TikTok MP4, HD and no-watermark choices.',
      },
      {
        href:
          '/download/facebook-video-download',
        name:
          'Free Facebook Video Downloader',
        text:
          'Resolve permitted public Facebook video and Reel sources.',
      },
      {
        href:
          '/tools/image-upscaler',
        name:
          'Free AI Image Upscaler',
        text:
          'Upscale thumbnail or social graphics by 2× or 4×.',
      },
    ],
  },
}

export const useToolSeo = (
  slug: SpToolSeoSlug,
) => {
  const content =
    spToolSeoContent[slug]

  if (!content) {
    throw new Error(
      `Unknown SP-Tools SEO slug: ${slug}`,
    )
  }

  return content
}
