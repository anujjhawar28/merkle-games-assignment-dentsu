import type { FeaturedGame, Game, GameStats } from '../types/games'

export function selectRandomIds(ids: number[], count = 15, random = Math.random): number[] {
  const shuffled = [...new Set(ids)]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex]!, shuffled[index]!]
  }

  return shuffled.slice(0, count)
}

export function mergeStats(game: Game, stats: GameStats): FeaturedGame {
  const fallbackRatings = game.reviews ?? []
  const ratings = fallbackRatings
    .map(review => Number(review.rating_score ?? review.rating))
    .filter(Number.isFinite)
  const average = stats.average_rating ?? game.average_rating

  return {
    ...game,
    average_rating: average == null
      ? ratings.length
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0
      : Number(average),
    total_reviews: Number(stats.total_reviews ?? game.total_reviews ?? ratings.length)
  }
}

export function sortGames(games: FeaturedGame[], sortBy: 'rating' | 'date'): FeaturedGame[] {
  return [...games].sort((left, right) => {
    if (sortBy === 'date') {
      return (right.release_date ?? '').localeCompare(left.release_date ?? '')
    }
    return right.average_rating - left.average_rating
  })
}

export function formatReleaseDate(value?: string | null): string {
  if (!value) return 'Release date unavailable'
  const date = new Date(`${value.slice(0, 10)}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Release date unavailable'
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

export function formatRating(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : '0.0'
}

export function resolveImageUrl(value: string | null | undefined, apiBase: string): string {
  if (!value) return '/game-fallback.svg'

  try {
    return new URL(value, `${new URL(apiBase).origin}/`).toString()
  } catch {
    return '/game-fallback.svg'
  }
}
