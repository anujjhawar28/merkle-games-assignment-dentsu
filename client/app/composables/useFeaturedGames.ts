/**
 * Loads the home page featured games: random picks from a configured release-date window.
 */
import { GAME_CONFIG } from '@/constants'
import type { FeaturedGame } from '@/types/games'
import { getPersistedAsyncData } from '@/utils/api/asyncDataCache'
import { mergeStats, selectRandomIds } from '@/utils/games'

/**
 * Fetches game ids in the featured date range, randomly selects a fixed count,
 * and loads each game with stats. Returns Nuxt `useLazyAsyncData` (empty array by default).
 */
export function useFeaturedGames() {
  const api = useGamesApi()

  return useLazyAsyncData<FeaturedGame[]>(
    GAME_CONFIG.featuredDataKey,
    async () => {
      const ids = await api.getIdsByDateRange(GAME_CONFIG.releaseDateFrom, GAME_CONFIG.releaseDateTo)
      const selectedIds = selectRandomIds(ids, GAME_CONFIG.featuredCount)
      const records = await Promise.all(selectedIds.map(async (id) => {
        const [game, stats] = await Promise.all([api.getGame(id), api.getStats(id)])
        return mergeStats(game, stats)
      }))
      return records
    },
    {
      default: () => [],
      dedupe: 'defer',
      getCachedData: getPersistedAsyncData
    }
  )
}
