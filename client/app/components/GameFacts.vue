<script setup lang="ts">
import type { FeaturedGame } from '@/types/games'
import { formatRating, formatReleaseDate } from '@/utils/games'

defineProps<{ game: FeaturedGame }>()
</script>

<template>
  <section class="facts-row" aria-label="Game facts">
    <div class="fact"><span>RELEASED</span><strong>{{ formatReleaseDate(game.release_date) }}</strong></div>
    <div class="fact"><span>COMMUNITY RATING</span><strong class="fact-rating"><span aria-hidden="true">★</span> {{
      formatRating(game.average_rating) }} <small>/ 10</small></strong></div>
    <div class="fact"><span>RATINGS</span><strong>{{ game.total_reviews.toLocaleString() }}</strong></div>
    <div class="fact"><span>GENRE</span><strong>{{ game.genre?.name || 'Uncategorized' }}</strong></div>
  </section>
</template>

<style scoped lang="scss">
.facts-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 24px var(--section-gutter);
  border-bottom: 1px solid var(--color-border);
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.fact>span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.3px;
}

.fact strong {
  font: 400 19px var(--font-display);
}

.fact-rating>span {
  color: var(--color-accent-strong);
}

.fact-rating small {
  color: var(--color-text-muted);
  font: 12px var(--font-body);
}

@media (max-width: 900px) {
  .facts-row {
    padding-inline: 4%;
  }
}

@media (max-width: 620px) {
  .facts-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px 14px;
    padding: 22px 2%;
  }

  .fact strong {
    font-size: 17px;
  }
}
</style>
