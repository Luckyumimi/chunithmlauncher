<script setup lang="ts">
import { ref } from 'vue';
import type { EventSlide } from './types';

const props = withDefaults(defineProps<{
  slides: EventSlide[];
  activeIndex?: number;
  imageId?: string;
  imageClass?: string;
  alt?: string;
}>(), { activeIndex: 0, imageId: '', imageClass: '', alt: '当前活动宣传图' });

const emit = defineEmits<{ (event: 'event-change', index: number): void }>();
const pointerStart = ref<number | null>(null);

function goTo(index: number): void {
  if (!props.slides.length) return;
  const next = (index + props.slides.length) % props.slides.length;
  emit('event-change', next);
}

function onPointerDown(event: PointerEvent): void {
  pointerStart.value = event.clientX;
  (event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
}

function onPointerUp(event: PointerEvent): void {
  if (pointerStart.value === null) return;
  const distance = event.clientX - pointerStart.value;
  pointerStart.value = null;
  if (Math.abs(distance) >= 36) goTo(props.activeIndex + (distance < 0 ? 1 : -1));
}
</script>

<template>
  <div
    class="event-carousel"
  >
    <div class="event-carousel-frame" @pointerdown="onPointerDown" @pointerup="onPointerUp" @pointercancel="pointerStart = null">
      <img
        v-if="slides[activeIndex]"
        :id="imageId || undefined"
        :class="imageClass"
        :src="slides[activeIndex].image"
        :alt="slides[activeIndex].alt || alt"
        draggable="false"
      />
      <div v-if="slides.length > 1" class="event-hero-controls" aria-label="活动翻页">
        <button type="button" aria-label="上一张活动" @click.stop="goTo(activeIndex - 1)">‹</button>
        <button type="button" aria-label="下一张活动" @click.stop="goTo(activeIndex + 1)">›</button>
      </div>
    </div>
  </div>
  <div v-if="slides.length > 1" class="event-indicator" aria-label="活动页码">
    <button
      v-for="(_, index) in slides"
      :key="index"
      class="event-dot"
      type="button"
      :class="{ active: index === activeIndex }"
      :aria-label="`第 ${index + 1} 张活动`"
      :aria-current="index === activeIndex ? 'true' : undefined"
      @click="goTo(index)"
    />
  </div>
</template>

<style scoped>
.event-carousel { position: relative; width: 100%; }
.event-carousel-frame { position: relative; width: 100%; aspect-ratio: 680 / 383; overflow: hidden; border-radius: inherit; touch-action: pan-y; }
.event-carousel-frame :deep(img) { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: contain; touch-action: pan-y; }
.event-indicator { min-height: 10px; }
:global(.event-hero), :global(.event-feature) { display: block !important; height: auto !important; aspect-ratio: auto !important; overflow: visible !important; background: transparent !important; }
:global(.event-hero::before), :global(.event-hero::after), :global(.event-feature::before), :global(.event-feature::after) { display: none !important; }
</style>
