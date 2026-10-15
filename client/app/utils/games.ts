/**
 * Barrel re-exports for game formatting, images, selection, stats, and sorting utilities.
 */
export { formatArchiveNumber, formatRating, formatReleaseDate, isReleaseDateInFeaturedRange } from '@/utils/game/formatters'
export { resolveImageUrl, setFallbackImage } from '@/utils/game/images'
export { selectRandomIds } from '@/utils/game/selection'
export { mergeStats } from '@/utils/game/stats'
export { sortGames, type GameSortOrder } from '@/utils/game/sorting'
