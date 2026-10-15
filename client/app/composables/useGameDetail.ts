/**
 * Loads a single game by id for the detail page, including merged review stats from the API.
 */
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { GAME_CONFIG } from '@/constants'
import type { FeaturedGame } from '@/types/games'
import { getPersistedAsyncData } from '@/utils/api/asyncDataCache'
import { mergeStats } from '@/utils/games'

/**
 * Fetches one game and its stats when `gameId` is a valid positive integer.
 * Returns Nuxt `useLazyAsyncData` with a cached key per id; invalid ids yield a 404 error.
 */
export function useGameDetail(gameId: MaybeRefOrGetter<number>) {
  const api = useGamesApi()
  const id = computed(() => toValue(gameId))

  return useLazyAsyncData<FeaturedGame>(
    () => `${GAME_CONFIG.detailDataKeyPrefix}${id.value}`,
    async () => {
      if (!Number.isInteger(id.value) || id.value < 1) {
        throw createError({ statusCode: 404, statusMessage: 'Game not found' })
      }

      const [record, stats] = await Promise.all([
        api.getGame(id.value),
        api.getStats(id.value)
      ])
      return mergeStats(record, stats)
    },
    {
      dedupe: 'defer',
      getCachedData: getPersistedAsyncData
    }
  )
}
