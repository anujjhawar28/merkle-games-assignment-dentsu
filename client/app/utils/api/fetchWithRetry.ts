import { API_CONFIG } from '@/constants'

export interface FetchWithRetryOptions {
  maxRetries?: number
  retryDelayMs?: number
  wait?: (milliseconds: number) => Promise<void>
}

function getStatusCode(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined

  if ('statusCode' in error && typeof error.statusCode === 'number') return error.statusCode
  if ('status' in error && typeof error.status === 'number') return error.status

  if ('response' in error && typeof error.response === 'object' && error.response !== null
    && 'status' in error.response && typeof error.response.status === 'number') {
    return error.response.status
  }

  return undefined
}

function canRetry(error: unknown): boolean {
  if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'AbortError') {
    return false
  }

  const statusCode = getStatusCode(error)
  if (statusCode !== undefined) {
    return statusCode === 0 || statusCode === 408 || statusCode === 429 || statusCode >= 500
  }

  return error instanceof TypeError
    || (typeof error === 'object' && error !== null && 'name' in error && error.name === 'FetchError')
}

const wait = (milliseconds: number) => new Promise<void>(resolve => setTimeout(resolve, milliseconds))

export async function fetchWithRetry<T>(
  request: () => Promise<T>,
  {
    maxRetries = API_CONFIG.maxRetries,
    retryDelayMs = API_CONFIG.retryDelayMs,
    wait: waitForRetry = wait
  }: FetchWithRetryOptions = {}
): Promise<T> {
  async function attempt(retry: number): Promise<T> {
    try {
      return await request()
    } catch (error) {
      if (retry >= maxRetries || !canRetry(error)) throw error
      await waitForRetry(retryDelayMs * (2 ** retry))
      return attempt(retry + 1)
    }
  }

  return attempt(0)
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const statusCode = getStatusCode(error)
  if (statusCode === 404) return 'The requested game could not be found.'
  if (statusCode === 429) return 'The API is receiving too many requests. Please try again shortly.'
  if (statusCode !== undefined && statusCode >= 500) return 'The API is temporarily unavailable. Please try again.'
  if (statusCode !== undefined && statusCode >= 400) return 'The API rejected the request. Please check the request and try again.'
  return fallback
}
