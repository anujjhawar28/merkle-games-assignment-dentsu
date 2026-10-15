<script setup lang="ts">
import { computed } from 'vue'
import { resolveImageUrl, setFallbackImage } from '@/utils/game/images'

const props = withDefaults(defineProps<{
  source?: string | null
  alt: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}>(), {
  source: null,
  loading: 'lazy',
  fetchPriority: 'auto'
})

const mediaBase = String(useRuntimeConfig().public.mediaBase)
const imageUrl = computed(() => resolveImageUrl(props.source, mediaBase))

function useFallback(event: Event) {
  if (event.currentTarget instanceof HTMLImageElement) setFallbackImage(event.currentTarget)
}
</script>

<template>
  <img :src="imageUrl" :alt="alt" :loading="loading" :fetchpriority="fetchPriority" @error="useFallback">
</template>

<style scoped lang="scss">
img {
  display: block;
  width: 100%;
  object-fit: cover;
  background: var(--color-surface-muted);
}
</style>
