import { describe, expect, it } from 'vitest'
import { computed, ref } from 'vue'
import { GAME_CONFIG } from '@/constants'
import { useGameSort } from '@/composables/useGameSort'
import { formatArchiveNumber, formatRating, formatReleaseDate, isReleaseDateInFeaturedRange, mergeStats, resolveImageUrl, selectRandomIds, sortGames } from '@/utils/games'
import type { FeaturedGame } from '@/types/games'

describe('game utilities', () => {
  it('selects a unique random sample without mutating the API ids', () => {
    const ids = [1, 2, 2, 3, 4]
    const selected = selectRandomIds(ids, 3, () => 0)

    expect(selected).toHaveLength(3)
    expect(new Set(selected).size).toBe(3)
    expect(ids).toEqual([1, 2, 2, 3, 4])
  })

  it('returns only the unique ids available when the requested sample is larger', () => {
    expect(selectRandomIds([4, 4, 7], 10, () => 0)).toHaveLength(2)
    expect(selectRandomIds([], 5)).toEqual([])
    expect(selectRandomIds([1, 2], 0)).toEqual([])
    expect(selectRandomIds(Array.from({ length: 30 }, (_, index) => index + 1), GAME_CONFIG.featuredCount, () => 0))
      .toHaveLength(GAME_CONFIG.featuredCount)
  })

  it('sorts rating high-to-low by default utility and dates newest first', () => {
    const games = [
      { id: 1, title: 'Older', release_date: '2015-01-01', average_rating: 9, total_reviews: 2 },
      { id: 2, title: 'Newer', release_date: '2017-01-01', average_rating: 7, total_reviews: 2 }
    ] as FeaturedGame[]

    expect(sortGames(games, 'rating').map(game => game.id)).toEqual([1, 2])
    expect(sortGames(games, 'date').map(game => game.id)).toEqual([2, 1])
  })

  it('sorts a copy and places games without release dates last', () => {
    const games = [
      { id: 1, title: 'Undated', average_rating: 8, total_reviews: 1 },
      { id: 2, title: 'Dated', release_date: '2016-01-01', average_rating: 7, total_reviews: 1 }
    ] as FeaturedGame[]

    expect(sortGames(games, 'date').map(game => game.id)).toEqual([2, 1])
    expect(games.map(game => game.id)).toEqual([1, 2])
  })

  it('formats dates and merges API stats with rating fallbacks', () => {
    expect(formatReleaseDate('2016-10-21')).toBe('Oct 21, 2016')
    expect(formatReleaseDate(null)).toBe('Release date unavailable')
    expect(mergeStats({ id: 1, title: 'Test' }, {}).average_rating).toBe(0)
    expect(mergeStats({
      id: 1,
      title: 'Test',
      reviews: [{ id: 1, rating_score: 8 }, { id: 2, rating_score: 6 }]
    }, {}).average_rating).toBe(7)
  })

  it('formats archive numbers and checks the featured release window', () => {
    expect(formatArchiveNumber(23)).toBe('0023')
    expect(formatArchiveNumber(23, 2)).toBe('23')
    expect(isReleaseDateInFeaturedRange('2015-01-01')).toBe(true)
    expect(isReleaseDateInFeaturedRange('2017-12-31')).toBe(true)
    expect(isReleaseDateInFeaturedRange('2014-12-31')).toBe(false)
    expect(isReleaseDateInFeaturedRange(null)).toBe(false)
    expect(GAME_CONFIG.featuredCount).toBe(15)
  })

  it('uses API stats when available and formats invalid values safely', () => {
    const game = { id: 1, title: 'Test', average_rating: 6, total_reviews: 2 }
    const stats = mergeStats(game, { average_rating: '8.5', total_reviews: '12' })

    expect(stats.average_rating).toBe(8.5)
    expect(stats.total_reviews).toBe(12)
    expect(formatRating(8.56)).toBe('8.6')
    expect(formatRating(Number.NaN)).toBe('0.0')
    expect(formatReleaseDate('not-a-date')).toBe('Release date unavailable')
  })

  it('resolves API-relative images against the media origin and falls back for missing images', () => {
    expect(resolveImageUrl('/media/cover?w=300', 'http://localhost:7000'))
      .toBe('http://localhost:7000/media/cover?w=300')
    expect(resolveImageUrl('https://cdn.example.test/cover.webp', 'http://localhost:7000'))
      .toBe('https://cdn.example.test/cover.webp')
    expect(resolveImageUrl(null, 'http://localhost:7000')).toBe('/game-fallback.svg')
    expect(resolveImageUrl('/cover.webp', 'not a url')).toBe('/game-fallback.svg')
    expect(resolveImageUrl('/media/cover?w=300', '/media')).toBe('/media/cover?w=300')
  })

  it('sorts filtered games through the sorting composable without watchers', () => {
    const games = ref([
      { id: 1, title: 'Low', average_rating: 4, total_reviews: 2 },
      { id: 2, title: 'High', average_rating: 9, total_reviews: 3 }
    ] as FeaturedGame[])
    const filteredGames = computed(() => games.value.filter(game => game.total_reviews > 2))
    const { sortBy, sortedGames } = useGameSort(filteredGames)

    expect(sortedGames.value.map(game => game.id)).toEqual([2])
    sortBy.value = 'date'
    expect(sortedGames.value.map(game => game.id)).toEqual([2])
  })
})