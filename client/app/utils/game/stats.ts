import type { FeaturedGame, Game, GameStats } from '@/types/games'

export function mergeStats(game: Game, stats: GameStats): FeaturedGame {
  const ratings = (game.reviews ?? [])
    .map(review => Number(review.rating_score ?? review.rating))
    .filter(Number.isFinite)
  const average = stats.average_rating ?? game.average_rating
  const averageFromReviews = ratings.length === 0
    ? 0
    : ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length

  return {
    ...game,
    average_rating: average == null ? averageFromReviews : Number(average),
    total_reviews: Number(stats.total_reviews ?? game.total_reviews ?? ratings.length)
  }
}
