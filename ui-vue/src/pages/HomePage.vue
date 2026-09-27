<script setup lang="ts">
import EventCarousel from '../components/EventCarousel.vue';
import type { EventSlide, NewsTab, ViewAction } from '../components/types';

defineProps<{
  eventSlides: EventSlide[];
  eventIndex: number;
  newsTab: NewsTab;
  newsTabs: Record<NewsTab, { title: string; date: string }[]>;
  targetMode?: string;
  originalMode?: string;
  primaryDisplay?: string;
}>();

const emit = defineEmits<{
  (event: 'event-change', index: number): void;
  (event: 'news-tab-change', tab: NewsTab): void;
  (event: 'action', action: ViewAction): void;
}>();
</script>

<template>
  <section class="workspace-view active" data-view-panel="home">
    <div class="home-title-block">
      <span class="background-readable">v2.5.0</span>
      <strong class="background-readable">Welcome to <em class="background-readable">CHUNITHM!</em></strong>
    </div>
    <div class="hero-copy">
      <p class="eyebrow">SEASON 01　/　COMMUNITY UPDATE</p>
      <h1>Welcome to<br /><em>CHUNITHM!</em></h1>
      <p class="hero-subtitle">启动游戏、记录成绩，和同样喜欢 CHUNITHM 的玩家一起探索新的节奏。</p>
      <div class="hero-actions">
        <button class="app-button primary launch" type="button" @click="emit('action', 'launch-game')">▶　启动游戏</button>
      </div>
    </div>
    <div class="home-activity-column">
      <div class="hero-art hero-art-placeholder event-hero">
        <EventCarousel :slides="eventSlides" :active-index="eventIndex" image-id="homeEventImage" @event-change="emit('event-change', $event)" />
      </div>
      <div class="home-lower">
        <article class="news-panel">
          <div class="panel-heading">
            <div><span class="eyebrow">LATEST</span><h2>最新资讯</h2></div>
            <button class="text-action" type="button" @click="emit('action', 'view-activity')">查看全部 →</button>
          </div>
          <div class="news-tabs">
            <button v-for="(_, tab) in newsTabs" :key="tab" type="button" :class="{ active: tab === newsTab }" @click="emit('news-tab-change', tab)">{{ tab === 'activities' ? '活动' : tab === 'announcements' ? '公告' : '资讯' }}</button>
          </div>
          <div class="news-list">
            <div v-for="item in newsTabs[newsTab]" :key="item.title" class="news-row"><span>{{ item.title }}</span><time>{{ item.date }}</time></div>
          </div>
        </article>
        <article class="mini-card"><span class="eyebrow">TODAY</span><strong>每日签到</strong><p>领取今日运势与积分奖励</p><button class="app-button compact" type="button" @click="emit('action', 'open-checkin')">去签到</button></article>
        <article class="mini-card score-card"><span class="eyebrow">PLAYER DATA</span><strong>12,840 <small>pts</small></strong><p>本周积分　↑ 18%</p><button class="app-button compact" type="button" @click="emit('action', 'open-scores')">查看成绩</button></article>
      </div>
    </div>
    <div class="home-launch-status"><slot name="launch-status" /></div>
  </section>
</template>
