import type { ApiResource, Game, GameStats } from '../types/games'

export function useGamesApi() {
  const config = useRuntimeConfig()
  const base = String(config.public.apiBase).replace(/\/$/, '')

  return {
    async getIdsByDateRange(from: string, to: string): Promise<number[]> {
      const result = await $fetch<{ ids: number[] }>(`${base}/games/by-date-range`, {
        query: { from, to }
      })
      return result.ids
    },
    async getGame(id: number): Promise<Game> {
      const result = await $fetch<ApiResource<Game>>(`${base}/games/${id}`)
      return result.data
    },
    async getStats(id: number): Promise<GameStats> {
      const result = await $fetch<ApiResource<GameStats>>(`${base}/games/${id}/stats`)
      return result.data
    }
  }
}