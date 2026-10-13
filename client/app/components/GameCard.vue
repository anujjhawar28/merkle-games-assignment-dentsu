<script setup lang="ts">
import type { FeaturedGame } from '../types/games'
import { formatRating, formatReleaseDate, resolveImageUrl } from '../utils/games'

defineProps<{ game: FeaturedGame }>()
const apiBase = String(useRuntimeConfig().public.apiBase)

function useFallback(event: Event) {
  const image = event.target as HTMLImageElement
  image.onerror = null
  image.src = '/game-fallback.svg'
}
</script>

<template>
  <NuxtLink class="game-card" :to="`/games/${game.id}`" :aria-label="`View ${game.title} details`">
    <div class="game-card__art">
      <img
        :src="resolveImageUrl(game.images?.[0]?.image_url, apiBase)"
        :alt="`${game.title} artwork`"
        loading="lazy"
        @error="useFallback"
      >
      <span class="game-card__rating"><span aria-hidden="true">★</span> {{ formatRating(game.average_rating) }}</span>
    </div>
    <div class="game-card__body">
      <p class="game-card__genre">{{ game.genre?.name || 'Uncategorized' }}</p>
      <h2>{{ game.title }}</h2>
      <div class="game-card__meta">
        <time :datetime="game.release_date || undefined">{{ formatReleaseDate(game.release_date) }}</time>
        <span>{{ game.total_reviews }} {{ game.total_reviews === 1 ? 'rating' : 'ratings' }}</span>
      </div>
    </div>
  </NuxtLink>
</template>