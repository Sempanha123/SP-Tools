<script setup lang="ts">
import type { NewsArticle } from '~/types/news'
const props=defineProps<{article:NewsArticle;mostRead:NewsArticle[]}>()
const {timeAgo}=useNewsData()
const slugify=(value:string)=>value.trim().toLowerCase().normalize('NFKD').replace(/\p{Diacritic}/gu,'').replace(/[^\p{L}\p{N}\s-]/gu,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'')
const toc=computed(()=>{const items=(props.article.sections??[]).map((section,index)=>({id:section.id?.trim()||slugify(section.title)||`section-${index+1}`,title:section.title?.trim()||`Section ${index+1}`})); if((props.article.keyPoints??[]).length) items.splice(Math.min(1,items.length),0,{id:'key-points',title:'What to know'}); if((props.article.timeline??[]).length) items.push({id:'story-timeline',title:'Timeline'}); if((props.article.sources??[]).length) items.push({id:'article-sources',title:'Sources'}); return items})
const activeId=ref(''); let observer:IntersectionObserver|null=null
const initObserver=async()=>{if(!import.meta.client)return;await nextTick();observer?.disconnect();activeId.value=toc.value[0]?.id??'';observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(visible[0]?.target.id)activeId.value=visible[0].target.id},{rootMargin:'-150px 0px -65% 0px',threshold:[0,.1,.25]});toc.value.forEach(item=>{const el=document.getElementById(item.id);if(el)observer?.observe(el)})}
const jumpTo=(id:string)=>{if(!import.meta.client)return;const el=document.getElementById(id);if(!el)return;el.scrollIntoView({behavior:'smooth',block:'start'});activeId.value=id}
const readNext=computed(()=>props.mostRead.filter(item=>item.id!==props.article.id).slice(0,4))
watch(()=>props.article.slug,()=>initObserver());watch(toc,()=>initObserver(),{deep:true});onMounted(()=>initObserver());onBeforeUnmount(()=>observer?.disconnect())
</script>

<template>
  <aside class="sp-editorial-sidebar space-y-7 xl:sticky xl:top-[154px]">
    <section v-if="toc.length" class="border-b border-line pb-5">
      <p class="sp-editorial-kicker">In this article</p>
      <nav aria-label="Article contents" class="mt-3"><button v-for="item in toc" :key="item.id" type="button" class="block w-full border-l-2 py-2 pl-3 text-left text-[11px] font-semibold leading-5 transition" :class="activeId===item.id?'border-accent text-fg':'border-line text-fg-subtle hover:border-line-strong hover:text-fg'" @click="jumpTo(item.id)">{{ item.title }}</button></nav>
    </section>

    <section v-if="readNext.length">
      <div class="flex items-end justify-between gap-3"><div><p class="sp-editorial-kicker">More news</p><h2 class="mt-1.5 text-[22px] font-[780] tracking-[-.04em] text-fg">Read next</h2></div><NuxtLink :to="{path:'/news/search',query:{sort:'popular'}}" class="text-[9px] font-bold text-fg-subtle hover:text-accent">View all →</NuxtLink></div>
      <div class="mt-4 divide-y divide-line border-y border-line"><NuxtLink v-for="item in readNext" :key="item.id" :to="`/news/posts/${item.slug}`" class="group grid grid-cols-[104px_minmax(0,1fr)] gap-3 py-4"><div class="aspect-[4/3] overflow-hidden rounded-[10px] bg-surface-3"><img v-if="item.image" :src="item.image" :alt="item.title" loading="lazy" class="h-full w-full object-cover transition duration-500 group-hover:scale-105"></div><div class="min-w-0"><p class="text-[8px] font-bold uppercase tracking-[.12em] text-accent">{{ item.categoryName }}</p><h3 class="mt-1.5 line-clamp-3 text-[13px] font-bold leading-[1.25rem] tracking-[-.015em] text-fg transition group-hover:text-accent">{{ item.title }}</h3><p class="mt-1.5 text-[8px] text-fg-subtle">{{ timeAgo(item.publishedAt) }}</p></div></NuxtLink></div>
    </section>
  </aside>
</template>
