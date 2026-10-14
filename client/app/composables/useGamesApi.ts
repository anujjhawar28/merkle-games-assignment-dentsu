import { API_CONFIG } from '@/constants'
import type { ApiResource, Game, GameStats } from '@/types/games'
import { fetchWithRetry } from '@/utils/api/fetchWithRetry'

export function useGamesApi() {
  const config = useRuntimeConfig()
  const base = String(config.public.apiBase).replace(/\/$/, '')

  return {
    async getIdsByDateRange(from: string, to: string): Promise<number[]> {
      const result = await fetchWithRetry(() => $fetch<{ ids: number[] }>(
        `${base}${API_CONFIG.gameIdsByDateRangePath}`,
        { query: { from, to }, timeout: API_CONFIG.timeoutMs }
      ))
      return result.ids
    },

    async getGame(id: number): Promise<Game> {
      const result = await fetchWithRetry(() => $fetch<ApiResource<Game>>(
        `${base}${API_CONFIG.gamesPath}/${id}`,
        { timeout: API_CONFIG.timeoutMs }
      ))
      return result.data
    },

    async getStats(id: number): Promise<GameStats> {
      const result = await fetchWithRetry(() => $fetch<ApiResource<GameStats>>(
        `${base}${API_CONFIG.gamesPath}/${id}${API_CONFIG.gameStatsPath}`,
        { timeout: API_CONFIG.timeoutMs }
      ))
      return result.data
    }
  }
}