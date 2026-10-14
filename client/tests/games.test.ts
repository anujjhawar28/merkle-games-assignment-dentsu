import { describe, expect, it } from 'vitest'
import { formatRating, formatReleaseDate, mergeStats, resolveImageUrl, selectRandomIds, sortGames } from '../app/utils/games'
import type { FeaturedGame } from '../app/types/games'

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

  it('uses API stats when available and formats invalid values safely', () => {
    const game = { id: 1, title: 'Test', average_rating: 6, total_reviews: 2 }
    const stats = mergeStats(game, { average_rating: '8.5', total_reviews: '12' })

    expect(stats.average_rating).toBe(8.5)
    expect(stats.total_reviews).toBe(12)
    expect(formatRating(8.56)).toBe('8.6')
    expect(formatRating(Number.NaN)).toBe('0.0')
    expect(formatReleaseDate('not-a-date')).toBe('Release date unavailable')
  })

  it('resolves API-relative images against the API origin and falls back for missing images', () => {
    expect(resolveImageUrl('/media/cover?w=300', 'http://localhost:7000/api/v1'))
      .toBe('http://localhost:7000/media/cover?w=300')
    expect(resolveImageUrl('https://cdn.example.test/cover.webp', 'http://localhost:7000/api/v1'))
      .toBe('https://cdn.example.test/cover.webp')
    expect(resolveImageUrl(null, 'http://localhost:7000/api/v1')).toBe('/game-fallback.svg')
    expect(resolveImageUrl('/cover.webp', 'not a url')).toBe('/game-fallback.svg')
  })
})