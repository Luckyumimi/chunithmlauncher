<script setup lang="ts">
import type { ViewAction } from '../components/types';
const emit = defineEmits<{ (event: 'action', action: ViewAction): void }>();
</script>
<template><section class="workspace-view" data-view-panel="social"><div class="page-heading"><span class="eyebrow background-readable">SOCIAL / 05</span><h2 class="background-readable">好友动态</h2><p class="background-readable">看看朋友最近在挑战什么，也分享你的新成绩。</p></div><div class="social-list"><article class="friend-row"><div class="avatar-placeholder">A</div><div><strong>ArcaeaPlayer</strong><p>刚刚完成了「World Vanquisher」的 SSS</p></div><span>15.78</span></article><article class="friend-row"><div class="avatar-placeholder pink">M</div><div><strong>Mira</strong><p>更新了个人简介：今晚继续推分</p></div><button class="app-button compact" type="button" @click="emit('action', 'view-profile')">查看主页</button></article></div></section></template>
