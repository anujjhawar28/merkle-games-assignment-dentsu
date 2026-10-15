/**
 * Sorts featured games for the browser UI by rating or release date.
 */
import type { FeaturedGame } from '@/types/games'

export type GameSortOrder = 'rating' | 'date'

/**
 * Returns a new array sorted by `sortBy`: newest release first for `date`,
 * highest average rating first for `rating`.
 */
export function sortGames(games: FeaturedGame[], sortBy: GameSortOrder): FeaturedGame[] {
  return [...games].sort((left, right) => {
    if (sortBy === 'date') {
      return (right.release_date ?? '').localeCompare(left.release_date ?? '')
    }

    return right.average_rating - left.average_rating
  })
}
