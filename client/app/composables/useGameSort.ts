/**
 * Client-side sort state for a list of featured games (rating or release date).
 */
import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { GAME_CONFIG } from '@/constants'
import { sortGames, type GameSortOrder } from '@/utils/game/sorting'
import type { FeaturedGame } from '@/types/games'

/**
 * Holds the current sort order and a computed list of `games` sorted accordingly.
 * `games` can be a ref, getter, or plain array.
 */
export function useGameSort(games: MaybeRefOrGetter<FeaturedGame[]>) {
  const sortBy = ref<GameSortOrder>(GAME_CONFIG.defaultSort)
  const sortedGames = computed(() => sortGames(toValue(games), sortBy.value))

  return { sortBy, sortedGames }
}
