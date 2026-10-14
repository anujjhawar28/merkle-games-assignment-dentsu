import { describe, expect, it } from 'vitest'
import { getApiErrorMessage, fetchWithRetry } from '@/utils/api/fetchWithRetry'

describe('fetchWithRetry', () => {
  it('retries transient server errors with a bounded exponential delay', async () => {
    let attempts = 0
    const delays: number[] = []

    const result = await fetchWithRetry(async () => {
      attempts += 1
      if (attempts < 3) throw Object.assign(new Error('Service unavailable'), { statusCode: 503 })
      return 'ok'
    }, {
      maxRetries: 2,
      retryDelayMs: 10,
      wait: async delay => { delays.push(delay) }
    })

    expect(result).toBe('ok')
    expect(attempts).toBe(3)
    expect(delays).toEqual([10, 20])
  })

  it('retries network errors and stops after the configured number of retries', async () => {
    let attempts = 0
    const wait = async () => {}

    await expect(fetchWithRetry(async () => {
      attempts += 1
      throw new TypeError('Network connection failed')
    }, { maxRetries: 2, wait })).rejects.toThrow('Network connection failed')

    expect(attempts).toBe(3)
  })

  it('does not retry client errors or unknown application errors', async () => {
    let attempts = 0
    const request = async (error: unknown) => fetchWithRetry(async () => {
      attempts += 1
      throw error
    }, { maxRetries: 3, wait: async () => {} })

    await expect(request(Object.assign(new Error('Not found'), { statusCode: 404 }))).rejects.toThrow('Not found')
    expect(attempts).toBe(1)

    await expect(request(new Error('Unexpected application error'))).rejects.toThrow('Unexpected application error')
    expect(attempts).toBe(2)
  })

  it('maps common API status codes to user-facing messages', () => {
    expect(getApiErrorMessage({ statusCode: 404 }, 'fallback')).toContain('could not be found')
    expect(getApiErrorMessage({ status: 429 }, 'fallback')).toContain('too many requests')
    expect(getApiErrorMessage({ statusCode: 503 }, 'fallback')).toContain('temporarily unavailable')
    expect(getApiErrorMessage({ statusCode: 401 }, 'fallback')).toContain('rejected the request')
    expect(getApiErrorMessage(new Error('network'), 'fallback')).toBe('fallback')
  })
})
