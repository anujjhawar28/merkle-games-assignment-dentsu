<script setup lang="ts">
import { computed } from 'vue'
import { API_ERROR_FALLBACK, APP_PATHS, GAME_CONFIG, SITE_CONFIG } from '@/constants'
import type { FeaturedGame } from '@/types/games'
import { mergeStats } from '@/utils/games'
import { getApiErrorMessage } from '@/utils/api/fetchWithRetry'

const route = useRoute()
const gameId = computed(() => Number(route.params.id))
const api = useGamesApi()

const { data: game, pending, error, refresh } = await useLazyAsyncData<FeaturedGame>(
  () => `${GAME_CONFIG.detailDataKeyPrefix}${gameId.value}`,
  async () => {
    if (!Number.isInteger(gameId.value) || gameId.value < 1) {
      throw createError({ statusCode: 404, statusMessage: 'Game not found' })
    }

    const [record, stats] = await Promise.all([
      api.getGame(gameId.value),
      api.getStats(gameId.value)
    ])
    return mergeStats(record, stats)
  }
)

useSeoMeta({
  title: () => game.value?.title ?? 'Game details',
  description: () => game.value?.description?.slice(0, 160) ?? SITE_CONFIG.description
})

const errorMessage = computed(() => error.value
  ? getApiErrorMessage(error.value, API_ERROR_FALLBACK.gameDetails)
  : API_ERROR_FALLBACK.gameDetails)

function retryGame() {
  return refresh()
}
</script>

<template>
  <main id="main-content" class="detail-main">
    <div v-if="pending" class="status-panel" aria-live="polite">
      <span class="loading-mark" aria-hidden="true" />
      <span class="status-panel__message">Opening the archive<span class="loading-dots">...</span></span>
    </div>
    <FeedbackPanel v-else-if="error || !game" kind="error" heading-level="h1" eyebrow="NOT FOUND"
      title="This game isn’t in the archive." :message="errorMessage">
      <template #actions>
        <button class="text-button" type="button" @click="retryGame">Try again <span
            aria-hidden="true">↗</span></button>
        <NuxtLink class="text-button" :to="APP_PATHS.home">Back to all games <span aria-hidden="true">↗</span>
        </NuxtLink>
      </template>
    </FeedbackPanel>
    <template v-else>
      <GameDetailHero :game="game" />
      <GameFacts :game="game" />
      <GameReviews :reviews="game.reviews" :total-reviews="game.total_reviews" />
    </template>
  </main>
</template>

<style scoped lang="scss">
.detail-main {
  min-height: 65vh;
}

.status-panel {
  min-height: 265px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-mark {
  width: 30px;
  aspect-ratio: 1;
  margin-bottom: 15px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-accent-strong);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

.loading-dots {
  display: inline-block;
  width: 17px;
  overflow: hidden;
  animation: dots 1s steps(4, end) infinite;
  vertical-align: bottom;
}

@media (prefers-reduced-motion: reduce) {

  .loading-mark,
  .loading-dots {
    animation-duration: .01ms;
    animation-iteration-count: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dots {
  to {
    width: 0;
  }
}
</style>
