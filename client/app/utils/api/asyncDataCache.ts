/**
 * Helpers for reusing Nuxt async data across navigations without redundant fetches.
 */
import type { NuxtApp } from '#app'

type AsyncDataCacheContext = {
  cause?: string
}

/**
 * Looks up previously loaded async data from payload or static cache by `key`.
 * Returns nothing on manual or hook-driven refreshes so a new fetch can run.
 */
export function getPersistedAsyncData<T>(
  key: string,
  nuxtApp: NuxtApp,
  ctx: AsyncDataCacheContext
): T | undefined {
  if (ctx.cause === 'refresh:manual' || ctx.cause === 'refresh:hook') {
    return undefined
  }

  const cached = nuxtApp.payload.data[key] ?? nuxtApp.static.data[key]
  return cached as T | undefined
}
