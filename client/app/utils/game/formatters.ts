/**
 * Display helpers for game release dates, ratings, archive ids, and featured date checks.
 */
import { FORMAT_CONFIG, GAME_CONFIG } from '@/constants'

/** Formats an ISO date string for the UI, or a fixed message when missing or invalid. */
export function formatReleaseDate(value?: string | null): string {
  if (!value) return 'Release date unavailable'

  const date = new Date(`${value.slice(0, 10)}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Release date unavailable'

  return new Intl.DateTimeFormat(FORMAT_CONFIG.locale, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

/** One decimal place for ratings; uses `0.0` when the value is not a finite number. */
export function formatRating(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : '0.0'
}

/** Pads a game id with leading zeros for archive-style display. */
export function formatArchiveNumber(id: number, digits: number = FORMAT_CONFIG.archiveNumberDigits): string {
  return String(id).padStart(digits, '0')
}

/** True when the release date string lies within the configured featured window. */
export function isReleaseDateInFeaturedRange(value?: string | null): boolean {
  if (!value) return false
  const date = value.slice(0, 10)
  return date >= GAME_CONFIG.releaseDateFrom && date <= GAME_CONFIG.releaseDateTo
}
