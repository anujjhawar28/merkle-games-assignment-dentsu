/**
 * Builds safe game image URLs and handles broken images in the browser.
 */
import { APP_PATHS } from '@/constants'

/**
 * Returns a usable image URL: absolute http(s) as-is, relative paths joined to `mediaBase`,
 * or the app fallback when the value is missing or invalid.
 */
export function resolveImageUrl(value: string | null | undefined, mediaBase: string): string {
  if (!value) return APP_PATHS.gameImageFallback

  try {
    if (/^https?:\/\//i.test(value)) return value

    const base = mediaBase.replace(/\/$/, '')

    // Same-origin media base (e.g. /media via Nitro proxy).
    if (base.startsWith('/')) {
      return value.startsWith('/') ? value : `/${value}`
    }

    return new URL(value, `${base}/`).toString()
  } catch {
    return APP_PATHS.gameImageFallback
  }
}

/** Stops error loops and swaps the element to the shared fallback image. */
export function setFallbackImage(image: HTMLImageElement): void {
  image.onerror = null
  image.src = APP_PATHS.gameImageFallback
}
