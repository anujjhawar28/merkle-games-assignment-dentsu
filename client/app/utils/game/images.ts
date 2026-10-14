import { APP_PATHS } from '@/constants'

export function resolveImageUrl(value: string | null | undefined, apiBase: string): string {
  if (!value) return APP_PATHS.gameImageFallback

  try {
    return new URL(value, `${new URL(apiBase).origin}/`).toString()
  } catch {
    return APP_PATHS.gameImageFallback
  }
}

export function setFallbackImage(image: HTMLImageElement): void {
  image.onerror = null
  image.src = APP_PATHS.gameImageFallback
}
