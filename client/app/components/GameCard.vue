<script setup lang="ts">
import { APP_PATHS } from '@/constants'
import type { FeaturedGame } from '@/types/games'
import { formatRating, formatReleaseDate } from '@/utils/games'

const props = withDefaults(defineProps<{
  game: FeaturedGame
  priorityImage?: boolean
}>(), {
  priorityImage: false,
})
</script>

<template>
  <NuxtLink class="game-card" :to="APP_PATHS.gameDetails(game.id)">
    <div class="game-card__art">
      <GameArtwork
        :source="game.images?.[0]?.image_url"
        :alt="`${game.title} artwork`"
        :loading="priorityImage ? 'eager' : 'lazy'"
        :fetch-priority="priorityImage ? 'high' : 'auto'"
      />
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

<style scoped lang="scss">
.game-card {
  display: block;
  min-width: 0;
  padding: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: 0 3px 10px rgb(var(--color-accent-rgb) / 8%);
  animation: reveal .4s both;
  animation-delay: calc(var(--card-order, 0) * 35ms);
  text-decoration: none;
  transition: box-shadow .2s ease, transform .2s ease;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgb(var(--color-accent-rgb) / 14%);
}

.game-card__art {
  position: relative;
  aspect-ratio: 1.48;
  overflow: hidden;
  background: var(--color-surface-muted);
}

.game-card__art :deep(img) {
  height: 100%;
  transition: transform .35s ease;
}

.game-card:hover .game-card__art :deep(img) {
  transform: scale(1.035);
}

.game-card__rating {
  position: absolute;
  right: 9px;
  bottom: 9px;
  padding: 5px 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 12px;
  font-weight: 800;
}

.game-card__rating span {
  color: var(--color-accent-strong);
}

.game-card__body {
  padding: 12px 1px 0;
}

.game-card__genre {
  margin: 0 0 3px;
  color: var(--color-accent);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.game-card h2 {
  overflow: hidden;
  margin: 0;
  font: 400 21px var(--font-display);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.game-card__meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 7px;
  color: var(--color-text-muted);
  font-size: 11px;
}

@media (max-width: 620px) {
  .game-card__art {
    aspect-ratio: 1.15;
  }

  .game-card__rating {
    right: 6px;
    bottom: 6px;
    padding: 4px 6px;
    font-size: 10px;
  }

  .game-card h2 {
    font-size: 17px;
  }

  .game-card__meta {
    flex-direction: column;
    gap: 1px;
    font-size: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .game-card {
    animation-duration: .01ms;
    animation-iteration-count: 1;
    animation-delay: 0ms;
    transition-duration: .01ms;
  }

  .game-card__art :deep(img) {
    transition-duration: .01ms;
  }
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>