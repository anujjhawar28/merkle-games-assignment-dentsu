<script setup lang="ts">
import type { FeaturedGame, Game, GameStats } from '../../types/games'
import { formatRating, formatReleaseDate, mergeStats, resolveImageUrl } from '../../utils/games'

const route = useRoute()
const gameId = computed(() => Number(route.params.id))
const api = useGamesApi()
const apiBase = String(useRuntimeConfig().public.apiBase)

const { data: game, pending, error, refresh } = await useAsyncData<FeaturedGame>(
  () => `game-${gameId.value}`,
  async () => {
    if (!Number.isInteger(gameId.value) || gameId.value < 1) {
      throw createError({ statusCode: 404, statusMessage: 'Game not found' })
    }
    const [record, stats] = await Promise.all([
      api.getGame(gameId.value),
      api.getStats(gameId.value).catch(() => ({} as GameStats))
    ])
    return mergeStats(record, stats)
  }
)

useSeoMeta({
  title: () => game.value?.title ?? 'Game details',
  description: () => game.value?.description?.slice(0, 160) ?? 'Game details and community reviews.'
})

function useFallback(event: Event) {
  const image = event.target as HTMLImageElement
  image.onerror = null
  image.src = '/game-fallback.svg'
}

function reviewRating(review: NonNullable<Game['reviews']>[number]): number {
  return Number(review.rating_score ?? review.rating ?? 0)
}

function retryGame() {
  refresh()
}
</script>

<template>
  <div class="site-shell detail-shell">
    <a class="skip-link" href="#main-content">Skip to game details</a>
    <header class="site-header">
      <NuxtLink class="brand" to="/" aria-label="Merkle Games home">
        <span class="brand__mark" aria-hidden="true">M</span>
        <span>MERKLE<span class="brand__light"> / GAMES</span></span>
      </NuxtLink>
      <NuxtLink class="header-back" to="/">← <span>BACK TO THE COLLECTION</span></NuxtLink>
    </header>

    <main id="main-content" class="detail-main">
      <div v-if="pending" class="status-panel" role="status" aria-live="polite">
        <span class="loading-mark" aria-hidden="true" />
        <p>Opening the archive<span class="loading-dots">...</span></p>
      </div>
      <div v-else-if="error || !game" class="status-panel status-panel--error" role="alert">
        <p class="eyebrow">NOT FOUND</p>
        <h1>This game isn’t in the archive.</h1>
        <p>The details may be unavailable right now.</p>
        <button class="text-button" type="button" @click="retryGame">Try again <span aria-hidden="true">↗</span></button>
        <NuxtLink class="text-button detail-return" to="/">Back to all games <span aria-hidden="true">↗</span></NuxtLink>
      </div>
      <template v-else>
        <section class="detail-hero">
          <div class="detail-copy">
            <p class="eyebrow"><span>{{ game.genre?.name || 'GAME FILE' }}</span> · ARCHIVE NO. {{ String(game.id).padStart(4, '0') }}</p>
            <h1>{{ game.title }}</h1>
            <p class="detail-description">{{ game.description || 'No description is available for this title.' }}</p>
            <div class="detail-byline">
              <span>DEVELOPED BY</span>
              <strong>{{ game.developer?.name || 'Unknown studio' }}</strong>
            </div>
          </div>
          <figure class="detail-art">
            <img
              :src="resolveImageUrl(game.images?.[0]?.image_url, apiBase)"
              :alt="`${game.title} featured artwork`"
              fetchpriority="high"
              @error="useFallback"
            >
            <figcaption>FEATURED ARTWORK <span>FIG. {{ String(game.id).padStart(2, '0') }}</span></figcaption>
          </figure>
        </section>

        <section class="facts-row" aria-label="Game facts">
          <div class="fact"><span>RELEASED</span><strong>{{ formatReleaseDate(game.release_date) }}</strong></div>
          <div class="fact"><span>COMMUNITY RATING</span><strong class="fact-rating"><span aria-hidden="true">★</span> {{ formatRating(game.average_rating) }} <small>/ 10</small></strong></div>
          <div class="fact"><span>RATINGS</span><strong>{{ game.total_reviews.toLocaleString() }}</strong></div>
          <div class="fact"><span>GENRE</span><strong>{{ game.genre?.name || 'Uncategorized' }}</strong></div>
        </section>

        <section class="reviews-section" aria-labelledby="reviews-title">
          <div class="section-heading">
            <div>
              <p class="eyebrow">PLAYER IMPRESSIONS</p>
              <h2 id="reviews-title">The reviews <span>{{ game.reviews?.length ?? 0 }}</span></h2>
            </div>
            <span class="review-total">{{ game.total_reviews.toLocaleString() }} TOTAL RATINGS</span>
          </div>
          <div v-if="game.reviews?.length" class="review-list">
            <article v-for="review in game.reviews" :key="review.id" class="review-item">
              <div class="review-item__top">
                <strong>{{ review.user?.username || 'Anonymous player' }}</strong>
                <span class="review-score"><span aria-hidden="true">★</span> {{ formatRating(reviewRating(review)) }}</span>
              </div>
              <p>{{ review.review_text || 'This player left a rating without written notes.' }}</p>
              <time v-if="review.review_date" :datetime="review.review_date">{{ formatReleaseDate(review.review_date) }}</time>
            </article>
          </div>
          <p v-else class="no-reviews">No written reviews yet. Be the first to leave an impression.</p>
        </section>
      </template>
    </main>

    <footer class="site-footer">
      <span>MERKLE GAMES <span class="footer-dot">●</span> A SMALL ARCHIVE OF BIG WORLDS</span>
      <NuxtLink to="/">← ALL GAMES</NuxtLink>
    </footer>
  </div>
</template>