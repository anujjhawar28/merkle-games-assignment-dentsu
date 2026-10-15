/**
 * Thin client for the games backend: ids by date, game records, and per-game stats.
 */
import { API_CONFIG } from '@/constants'
import type { ApiResource, Game, GameStats } from '@/types/games'
import { fetchWithRetry } from '@/utils/api/fetchWithRetry'

/** Picks the API base URL for server vs browser and strips a trailing slash. */
function resolveApiBase(): string {
  const config = useRuntimeConfig()
  const base = import.meta.server ? config.apiBase : config.public.apiBase
  return String(base).replace(/\/$/, '')
}

/**
 * Composable that returns typed API helpers using the configured base URL and retries.
 */
export function useGamesApi() {
  const base = resolveApiBase()
  const requestFetch = useRequestFetch()

  return {
    /** Game ids whose release dates fall between `from` and `to` (inclusive). */
    async getIdsByDateRange(from: string, to: string): Promise<number[]> {
      const result = await fetchWithRetry(() => requestFetch<{ ids: number[] }>(
        `${base}${API_CONFIG.gameIdsByDateRangePath}`,
        { query: { from, to }, timeout: API_CONFIG.timeoutMs }
      ))
      return result.ids
    },

    /** Full game record for a given id. */
    async getGame(id: number): Promise<Game> {
      const result = await fetchWithRetry(() => requestFetch<ApiResource<Game>>(
        `${base}${API_CONFIG.gamesPath}/${id}`,
        { timeout: API_CONFIG.timeoutMs }
      ))
      return result.data
    },

    /** Aggregate review stats for a given game id. */
    async getStats(id: number): Promise<GameStats> {
      const result = await fetchWithRetry(() => requestFetch<ApiResource<GameStats>>(
        `${base}${API_CONFIG.gamesPath}/${id}${API_CONFIG.gameStatsPath}`,
        { timeout: API_CONFIG.timeoutMs }
      ))
      return result.data
    }
  }
}
