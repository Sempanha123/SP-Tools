<script setup lang="ts">
import type { NewsArticle, NewsArticleSection } from '~/types/news'
const props = defineProps<{ article: NewsArticle }>()
interface NormalizedSection extends NewsArticleSection { id: string; paragraphs: string[] }
const slugify=(value:string)=>value.trim().toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu,'').replace(/[^\p{L}\p{N}\s-]/gu,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')
const cleanList=(value:unknown):string[]=>Array.isArray(value)?value.filter((item):item is string=>typeof item==='string'&&item.trim().length>0):[]
const sections=computed<NormalizedSection[]>(()=>{
  const source=props.article.sections??[]
  if(!source.length){return [{id:'article-summary',title:'Article summary',paragraphs:[props.article.lead?.trim(),props.article.excerpt?.trim()].filter((v):v is string=>Boolean(v))}]}
  return source.map((section,index)=>({ ...section, id:section.id?.trim()||slugify(section.title)||`section-${index+1}`, title:section.title?.trim()||`Section ${index+1}`, paragraphs:cleanList(section.paragraphs), bullets:cleanList(section.bullets), gallery:cleanList(section.gallery), quote:section.quote?.trim()||null, quoteAttribution:section.quoteAttribution?.trim()||null, note:section.note?.trim()||null, image:section.image?.trim()||null, imageAlt:section.imageAlt?.trim()||null, imageCaption:section.imageCaption?.trim()||null, imageCredit:section.imageCredit?.trim()||null, imagePosition:section.imagePosition==='before'?'before':'after', youtubeUrl:section.youtubeUrl?.trim()||null, youtubeCaption:section.youtubeCaption?.trim()||null }))
})
const keyPoints=computed(()=>cleanList(props.article.keyPoints))
const sources=computed(()=>props.article.sources??[])
const timeline=computed(()=>props.article.timeline??[])
const showLead=computed(()=>{const lead=props.article.lead?.trim();return Boolean(lead&&lead!==props.article.excerpt?.trim())})
</script>

<template>
  <article class="sp-editorial-article-body">
    <p v-if="showLead" class="sp-editorial-lead">{{ article.lead }}</p>

    <section v-if="keyPoints.length" id="key-points" class="sp-editorial-key-points scroll-mt-32">
      <p class="sp-editorial-kicker">What to know</p>
      <ul class="mt-4 grid gap-3"><li v-for="point in keyPoints" :key="point" class="flex gap-3"><span class="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent"/><span>{{ point }}</span></li></ul>
    </section>

    <section v-for="section in sections" :id="section.id" :key="section.id" class="sp-editorial-section scroll-mt-32">
      <figure v-if="section.image && section.imagePosition === 'before'" class="sp-editorial-inline-figure">
        <img :src="section.image" :alt="section.imageAlt || section.title" loading="lazy">
        <figcaption v-if="section.imageCaption || section.imageCredit" class="sp-editorial-caption"><span>{{ section.imageCaption }}</span><span v-if="section.imageCredit">{{ section.imageCredit }}</span></figcaption>
      </figure>

      <h2 class="sp-editorial-section-title">{{ section.title }}</h2>
      <div class="sp-editorial-copy"><p v-for="(paragraph,index) in section.paragraphs" :key="`${section.id}-p-${index}`">{{ paragraph }}</p></div>

      <ul v-if="section.bullets?.length" class="sp-editorial-bullets"><li v-for="bullet in section.bullets" :key="bullet"><span class="sp-editorial-bullet-dot">✓</span><span>{{ bullet }}</span></li></ul>
      <blockquote v-if="section.quote" class="sp-editorial-quote"><p>“{{ section.quote }}”</p><footer v-if="section.quoteAttribution">{{ section.quoteAttribution }}</footer></blockquote>
      <aside v-if="section.note" class="sp-editorial-note">{{ section.note }}</aside>

      <figure v-if="section.image && section.imagePosition !== 'before'" class="sp-editorial-inline-figure">
        <img :src="section.image" :alt="section.imageAlt || section.title" loading="lazy">
        <figcaption v-if="section.imageCaption || section.imageCredit" class="sp-editorial-caption"><span>{{ section.imageCaption }}</span><span v-if="section.imageCredit">{{ section.imageCredit }}</span></figcaption>
      </figure>

      <NewsPostSectionMedia :gallery="section.gallery ?? []" :youtube-url="section.youtubeUrl ?? null" :youtube-caption="section.youtubeCaption ?? null" />
    </section>

    <section v-if="timeline.length" id="story-timeline" class="sp-editorial-support-section scroll-mt-32">
      <p class="sp-editorial-kicker">Timeline</p><h2 class="sp-editorial-support-title">What happened</h2>
      <div class="mt-5 border-l border-line pl-5"><article v-for="item in timeline" :key="`${item.time}-${item.title}`" class="relative pb-7 last:pb-0"><span class="absolute -left-[23px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-accent"/><p v-if="item.time" class="text-[9px] font-bold uppercase tracking-[.12em] text-accent">{{ item.time }}</p><h3 class="mt-1 text-[16px] font-bold tracking-[-.02em] text-fg">{{ item.title }}</h3><p class="mt-1.5 text-[13px] leading-6 text-fg-muted">{{ item.description }}</p></article></div>
    </section>

    <section v-if="sources.length" id="article-sources" class="sp-editorial-support-section scroll-mt-32">
      <p class="sp-editorial-kicker">Sources</p><h2 class="sp-editorial-support-title">Sources used</h2>
      <div class="mt-5 divide-y divide-line border-y border-line"><article v-for="source in sources" :key="`${source.name}-${source.url}`" class="py-4"><div class="flex items-start justify-between gap-4"><div><p class="text-[13px] font-bold text-fg">{{ source.name }}</p><p v-if="source.type" class="mt-1 text-[9px] font-semibold uppercase tracking-[.11em] text-fg-subtle">{{ source.type }}</p></div><a v-if="source.url" :href="source.url" target="_blank" rel="noopener noreferrer" class="text-[10px] font-bold text-accent hover:underline">Open ↗</a></div><p v-if="source.description" class="mt-2 text-[12px] leading-6 text-fg-muted">{{ source.description }}</p></article></div>
    </section>

    <section v-if="article.methodologyNote || article.correctionNote" class="sp-editorial-report-notes">
      <div v-if="article.methodologyNote"><p class="sp-editorial-kicker">About this report</p><p class="mt-2">{{ article.methodologyNote }}</p></div>
      <div v-if="article.correctionNote" class="mt-4 border-t border-line pt-4"><p class="sp-editorial-kicker">Correction</p><p class="mt-2">{{ article.correctionNote }}</p></div>
    </section>
  </article>
</template>
