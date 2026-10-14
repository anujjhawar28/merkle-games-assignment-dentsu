import type { FeaturedGame } from '@/types/games'

export type GameSortOrder = 'rating' | 'date'

export function sortGames(games: FeaturedGame[], sortBy: GameSortOrder): FeaturedGame[] {
  return [...games].sort((left, right) => {
    if (sortBy === 'date') {
      return (right.release_date ?? '').localeCompare(left.release_date ?? '')
    }

    return right.average_rating - left.average_rating
  })
}
