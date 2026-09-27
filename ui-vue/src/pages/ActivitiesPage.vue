<script setup lang="ts">
import { computed } from 'vue';
import EventCarousel from '../components/EventCarousel.vue';
import type { EventSlide, ViewAction } from '../components/types';
const props = defineProps<{ eventSlides: EventSlide[]; eventIndex: number }>();
const emit = defineEmits<{ (event: 'event-change', index: number): void; (event: 'action', action: ViewAction): void }>();
const activeSlide = computed(() => props.eventSlides[props.eventIndex]);
</script>
<template>
  <section class="workspace-view" data-view-panel="activities">
    <div class="page-heading"><span class="eyebrow background-readable">COMMUNITY / 01</span><h2 class="background-readable">活动与公告</h2><p class="background-readable">把近期活动、社区内容和版本动态集中在这里。</p></div>
    <div class="feature-grid">
      <div class="event-slide"><article class="feature-banner hero-art-placeholder event-feature"><EventCarousel :slides="eventSlides" :active-index="eventIndex" image-id="activityEventImage" @event-change="emit('event-change', $event)" /></article></div>
      <article class="feature-copy event-copy-panel"><div class="event-copy-scroll"><span class="eyebrow background-readable">{{ activeSlide?.date }}</span><h3 class="background-readable">{{ activeSlide?.title }}</h3><p class="background-readable">{{ activeSlide?.body }}</p></div><button class="app-button primary" type="button" @click="emit('action', 'view-activity')">查看活动详情</button></article>
    </div>
    <div class="content-grid compact-grid"><article class="content-card"><span class="eyebrow">NEWS</span><h3>社区内容展示页</h3><p>分享你的谱面记录、桌面布置和游玩心得。</p></article><article class="content-card"><span class="eyebrow">UPDATE</span><h3>版本 2.5.0</h3><p>启动器工作台、公告系统与主题体验更新。</p></article></div>
  </section>
</template>
<style scoped>
.event-copy-panel { display: flex; flex-direction: column; overflow: hidden; }
.event-copy-scroll { flex: 1; min-height: 0; overflow: auto; }
.event-copy-scroll h3, .event-copy-scroll p { white-space: pre-line; }
</style>
